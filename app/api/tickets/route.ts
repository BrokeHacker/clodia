import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'node:crypto'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { getUserFromCookies } from '@/lib/supabase-server'
import { limiteAtteinte, ipDe } from '@/lib/rate-limit'
import { normaliserTelephone, REGEX_TELEPHONE } from '@/lib/utils'

// Demandes au service client (SAV) : formulaire public « Nous contacter » et demande par commande.
// Seule cette route écrit dans la table tickets_sav (clé service_role, jamais depuis le navigateur).

const TYPES = ['annulation', 'remboursement', 'probleme_livraison', 'nouveau_point', 'autre']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const UUID_RE = /^[0-9a-f-]{36}$/i
const MAX_PAR_HEURE = 5

function erreur(status: number, message: string) {
  return NextResponse.json({ error: message }, { status })
}

function texte(v: unknown, max: number) {
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

// Refuse les appels venant d'un autre site (protection contre les envois automatisés depuis une page tierce)
function origineValide(req: NextRequest) {
  const origin = req.headers.get('origin')
  if (!origin) return true
  try {
    return new URL(origin).host === req.headers.get('host')
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  if (!origineValide(req)) return erreur(403, 'Requête refusée.')

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return erreur(400, 'Requête invalide.')
  }

  // Champ piège : invisible pour une personne, rempli par les robots. Réponse « ok » pour ne rien leur apprendre.
  if (typeof body.website === 'string' && body.website.trim() !== '') return NextResponse.json({ ok: true })

  const ip = ipDe(req)
  if (limiteAtteinte(`ticket:${ip}`, MAX_PAR_HEURE, 60 * 60 * 1000)) return erreur(429, 'Trop de demandes. Réessayez dans une heure.')

  const type = texte(body.type, 40)
  const message = texte(body.message, 2000)
  if (!TYPES.includes(type)) return erreur(400, 'Type de demande invalide.')
  if (message.length < 5) return erreur(400, 'Merci de décrire votre demande (5 caractères minimum).')

  const admin = getSupabaseAdmin()
  const user = await getUserFromCookies()

  // Identité : fiche du client connecté, sinon coordonnées saisies (avec vérification)
  let source: 'invite' | 'compte' = 'invite'
  let clientId: string | null = null
  let nom = ''
  let email = ''
  let telephone = ''

  if (user) {
    const { data: c } = await admin.from('clients').select('id, prenom, nom, email, telephone').eq('user_id', user.id).maybeSingle()
    if (c) {
      source = 'compte'
      clientId = c.id as string
      nom = `${(c.prenom as string) ?? ''} ${(c.nom as string) ?? ''}`.trim()
      email = ((c.email as string) ?? user.email ?? '').toLowerCase()
      telephone = (c.telephone as string) ?? ''
    }
  }

  // Demande depuis « Mes commandes » : elle exige une session valide côté serveur (sinon, la session du navigateur est expirée)
  if (source === 'invite' && typeof body.commandeId === 'string' && body.commandeId) {
    console.error('[tickets] demande par commande sans session valide côté serveur', user ? 'session sans fiche client' : 'aucune session')
    return erreur(401, 'Votre session a expiré. Veuillez vous reconnecter puis réessayer.')
  }

  if (source === 'invite') {
    nom = texte(body.nom, 100)
    email = texte(body.email, 200).toLowerCase()
    const tel = texte(body.telephone, 30)
    telephone = tel ? normaliserTelephone(tel) : ''
    if (!nom) return erreur(400, 'Merci d’indiquer votre nom.')
    if (!EMAIL_RE.test(email)) return erreur(400, 'Adresse email invalide.')
    if (telephone && !REGEX_TELEPHONE.test(telephone)) return erreur(400, 'Numéro de téléphone invalide.')
  }

  // Commande concernée
  let commandeId: string | null = null
  let refCommande: number | null = null
  if (typeof body.commandeId === 'string' && body.commandeId) {
    // Demande depuis « Mes commandes » : la commande doit appartenir au client connecté
    if (!clientId || !UUID_RE.test(body.commandeId)) return erreur(403, 'Commande introuvable.')
    const { data: cmd } = await admin.from('commandes').select('id, ref_commande').eq('id', body.commandeId).eq('client_id', clientId).maybeSingle()
    if (!cmd) return erreur(403, 'Commande introuvable.')
    commandeId = cmd.id as string
    refCommande = (cmd.ref_commande as number | null) ?? null
  } else if (body.refCommande !== undefined && body.refCommande !== null && body.refCommande !== '') {
    const n = Number(String(body.refCommande).replace(/\D/g, ''))
    if (!Number.isInteger(n) || n < 1 || n > 9_999_999) return erreur(400, 'Numéro de commande invalide.')
    refCommande = n
  }

  // Anti-spam durable (partagé entre toutes les instances) : 5 demandes par heure et par adresse IP
  // L'adresse IP n'est jamais stockée en clair, seulement une empreinte.
  const ipHash = createHash('sha256').update(`${ip}|${process.env.IP_HASH_SALT ?? 'clodia'}`).digest('hex')
  const depuis = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count } = await admin.from('tickets_sav').select('id', { count: 'exact', head: true }).eq('ip_hash', ipHash).gte('created_at', depuis)
  if ((count ?? 0) >= MAX_PAR_HEURE) return erreur(429, 'Trop de demandes. Réessayez dans une heure.')

  const { error } = await admin.from('tickets_sav').insert({
    source, type, client_id: clientId, commande_id: commandeId, ref_commande: refCommande,
    nom, email, telephone, message, ip_hash: ipHash,
  })
  if (error) {
    console.error('[tickets] insertion:', error.message)
    return erreur(500, 'Une erreur est survenue. Veuillez réessayer ou nous écrire par email.')
  }
  return NextResponse.json({ ok: true })
}
