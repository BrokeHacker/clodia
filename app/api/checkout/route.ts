import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { getUserFromCookies } from '@/lib/supabase-server'
import { getSemainesDisponibles, getTarifUnitaire, getTarifPrecommande, type Tarif } from '@/lib/menus'
import { normaliserTelephone, REGEX_TELEPHONE } from '@/lib/utils'

if (!process.env.NEXT_PUBLIC_BASE_URL) throw new Error('Missing NEXT_PUBLIC_BASE_URL')

// Limites : metadata Stripe = 500 caractères max (un UUID ≈ 37 caractères)
const MAX_LIGNES = 12
const MAX_QTE_LIGNE = 20
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface LigneIn {
  menuId: string
  variante: 'plat' | 'plat_vege'
  quantite: number
}

interface Ligne {
  menuId: string
  quantite: number
  type: 'unite' | 'pre-commande'
  date_livraison: string
  variante: 'standard' | 'vegetarien'
  prix: number
}

type Admin = ReturnType<typeof getSupabaseAdmin>

function erreur(status: number, code: string, message: string) {
  return NextResponse.json({ error: code, message }, { status })
}

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function texte(v: unknown, max = 100) {
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

function lireLignes(raw: unknown): LigneIn[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_LIGNES) return null
  const out: LigneIn[] = []
  for (const l of raw) {
    if (typeof l !== 'object' || l === null) return null
    const { menuId, variante, quantite } = l as Record<string, unknown>
    if (typeof menuId !== 'string' || menuId.length === 0 || menuId.length > 64) return null
    if (variante !== 'plat' && variante !== 'plat_vege') return null
    if (typeof quantite !== 'number' || !Number.isInteger(quantite) || quantite < 1 || quantite > MAX_QTE_LIGNE) return null
    out.push({ menuId, variante, quantite })
  }
  return out
}

async function libererSlots(admin: Admin, lignes: Ligne[]) {
  for (const l of lignes.filter(l => l.type === 'unite')) {
    const { error } = await admin.rpc('decrementer_reserves_slot', {
      p_date: l.date_livraison,
      p_variante: l.variante,
      p_quantite: l.quantite,
    })
    if (error) console.error('[checkout] libération de slot échouée:', error.message)
  }
}

export async function POST(req: NextRequest) {
  let body: Record<string, any>
  try {
    body = await req.json()
  } catch {
    return erreur(400, 'requete_invalide', 'Requête invalide')
  }

  const lignesIn = lireLignes(body?.items)
  if (!lignesIn) return erreur(400, 'panier_invalide', 'Panier invalide')

  const pointId = typeof body?.pointId === 'string' && body.pointId ? body.pointId : null
  const admin = getSupabaseAdmin()
  const user = await getUserFromCookies()

  try {
    // ── 1. Point de livraison ──
    if (pointId) {
      const { data: p } = await admin.from('points_livraison').select('id').eq('id', pointId).maybeSingle()
      if (!p) return erreur(400, 'point_invalide', 'Point de livraison invalide')
    }

    // ── 2. Menus commandables + tarifs (tout est recalculé côté serveur) ──
    const nowParis = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Paris' }))
    const { semaineCourante, semaineSuivante } = getSemainesDisponibles(nowParis)
    const today = ymd(nowParis)

    const menuIds = [...new Set(lignesIn.map(l => l.menuId))]
    const [menusRes, tarifsRes] = await Promise.all([
      admin.from('menus').select('id, date_livraison').in('id', menuIds).eq('publie', true),
      admin.from('tarifs').select('id, type, repas_de, repas_a, prix_unitaire'),
    ])
    if (menusRes.error || tarifsRes.error || !menusRes.data || !tarifsRes.data) {
      console.error('[checkout] lecture menus/tarifs:', menusRes.error?.message, tarifsRes.error?.message)
      return erreur(500, 'erreur_serveur', 'Erreur serveur')
    }
    const menus = menusRes.data as { id: string; date_livraison: string }[]
    const tarifs = tarifsRes.data as unknown as Tarif[]

    const prixUnite = getTarifUnitaire(tarifs)
    const lignes: Ligne[] = []
    for (const l of lignesIn) {
      const menu = menus.find(m => m.id === l.menuId)
      if (!menu) return erreur(400, 'menu_indisponible', "Un menu de votre panier n'est plus disponible")
      const d = menu.date_livraison
      let type: Ligne['type']
      if (d >= semaineSuivante.lundi && d <= semaineSuivante.vendredi) type = 'pre-commande'
      else if (d > today && d <= semaineCourante.vendredi) type = 'unite'
      else return erreur(400, 'menu_indisponible', "Un menu de votre panier n'est plus commandable")
      lignes.push({
        menuId: l.menuId,
        quantite: l.quantite,
        type,
        date_livraison: d,
        variante: l.variante === 'plat_vege' ? 'vegetarien' : 'standard',
        prix: 0,
      })
    }

    const qtePre = lignes.filter(l => l.type === 'pre-commande').reduce((a, l) => a + l.quantite, 0)
    const prixPre = getTarifPrecommande(tarifs, qtePre)
    for (const l of lignes) l.prix = l.type === 'pre-commande' ? prixPre : prixUnite
    if (lignes.some(l => !(l.prix > 0))) return erreur(500, 'tarif_indisponible', 'Tarif indisponible')

    const totalCents = lignes.reduce((a, l) => a + Math.round(l.prix * 100) * l.quantite, 0)
    if (totalCents < 50) return erreur(400, 'montant_invalide', 'Montant invalide')

    // ── 3. Client : connecté (sa propre fiche) ou invité (par téléphone) ──
    let clientId: string
    let clientPrenom = ''
    let clientNom = ''
    let emailStripe = ''
    let peutEnregistrerPoint = false

    // Session sans fiche client (parcours invité) : traitée comme un invité
    let c: { id: unknown; prenom: unknown; nom: unknown; email: unknown } | null = null
    if (user) {
      const res = await admin
        .from('clients')
        .select('id, prenom, nom, email')
        .eq('user_id', user.id)
        .maybeSingle()
      c = res.data
    }

    if (user && c) {
      clientId = c.id as string
      clientPrenom = (c.prenom as string | null) ?? ''
      clientNom = (c.nom as string | null) ?? ''
      emailStripe = (c.email as string | null) ?? user.email ?? ''
      peutEnregistrerPoint = true
    } else {
      const prenom = texte(body?.client?.prenom)
      const nom = texte(body?.client?.nom)
      const email = texte(body?.client?.email, 200)
      const telephone = normaliserTelephone(texte(body?.client?.telephone, 30))
      if (!prenom || !nom) return erreur(400, 'infos_invalides', 'Prénom et nom requis')
      if (!EMAIL_RE.test(email)) return erreur(400, 'infos_invalides', 'Email invalide')
      if (!REGEX_TELEPHONE.test(telephone)) return erreur(400, 'infos_invalides', 'Numéro de téléphone invalide')

      const { data: existant } = await admin
        .from('clients')
        .select('id, user_id')
        .eq('telephone', telephone)
        .maybeSingle()

      if (existant) {
        if (existant.user_id) {
          return erreur(409, 'compte_existant', 'Un compte existe déjà pour ce numéro. Connectez-vous pour commander.')
        }
        // Fiche existante (client WhatsApp) : on l'utilise mais on ne la modifie JAMAIS
        clientId = existant.id as string
      } else {
        const { data: cree, error: creeErr } = await admin
          .from('clients')
          .insert({ telephone, prenom, nom, email })
          .select('id')
          .single()
        if (creeErr || !cree) {
          console.error('[checkout] création client invité:', creeErr?.message)
          return erreur(500, 'erreur_serveur', 'Erreur serveur')
        }
        clientId = cree.id as string
        peutEnregistrerPoint = true
      }
      clientPrenom = prenom
      clientNom = nom
      emailStripe = email
    }

    // ── 4. Réservation atomique des créneaux (commandes à l'unité) ──
    const reservations = lignes
      .filter(l => l.type === 'unite')
      .map(l => ({ date_livraison: l.date_livraison, variante: l.variante, quantite: l.quantite }))

    if (reservations.length > 0) {
      const { error: rpcError } = await admin.rpc('reserver_slots', { p_reservations: reservations })
      if (rpcError) {
        if (rpcError.message.includes('Slot complet')) {
          return erreur(409, 'slot_complet', rpcError.message)
        }
        console.error('[checkout] reserver_slots:', rpcError.message)
        return erreur(500, 'erreur_serveur', 'Erreur lors de la réservation des créneaux')
      }
    }

    // ── 5. Point de livraison enregistré sur la fiche (max 3) ──
    if (pointId && peutEnregistrerPoint) {
      try {
        const { data: existant } = await admin
          .from('client_points_livraison')
          .select('id')
          .eq('client_id', clientId)
          .eq('point_livraison_id', pointId)
          .maybeSingle()
        if (!existant) {
          const { count } = await admin
            .from('client_points_livraison')
            .select('id', { count: 'exact', head: true })
            .eq('client_id', clientId)
          if ((count ?? 0) < 3) {
            await admin.from('client_points_livraison').insert({
              client_id: clientId,
              point_livraison_id: pointId,
              est_defaut: (count ?? 0) === 0,
            })
          }
        }
      } catch (e) {
        console.error('[checkout] enregistrement du point de livraison:', e)
      }
    }

    // ── 6. Lignes de commande (prix fixés par le serveur) ──
    const { data: creees, error: insErr } = await admin
      .from('commandes')
      .insert(
        lignes.map(l => ({
          client_id: clientId,
          menu_id: l.menuId,
          type: l.type,
          variante: l.variante,
          quantite: l.quantite,
          prix_unitaire: l.prix,
          statut: 'en_attente',
          point_livraison: pointId,
        }))
      )
      .select('id')
    if (insErr || !creees || creees.length !== lignes.length) {
      console.error('[checkout] insertion commandes:', insErr?.message)
      await libererSlots(admin, lignes)
      return erreur(500, 'erreur_serveur', 'Erreur lors de la création de la commande')
    }
    const commandeIds = creees.map(c => c.id as string)

    // ── 7. Session Stripe (montant calculé ci-dessus, jamais reçu du navigateur) ──
    let session
    try {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: emailStripe || undefined,
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Commande Clodia',
                description: `Commande de ${clientPrenom} ${clientNom}`.trim().slice(0, 200),
              },
              unit_amount: totalCents,
            },
            quantity: 1,
          },
        ],
        metadata: { source: 'site', commande_ids: commandeIds.join(',') },
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      })
    } catch (e) {
      console.error('[checkout] Stripe:', e)
      await admin.from('commandes').delete().in('id', commandeIds).eq('statut', 'en_attente')
      await libererSlots(admin, lignes)
      return erreur(500, 'erreur_stripe', 'Erreur Stripe')
    }

    const { error: majErr } = await admin
      .from('commandes')
      .update({
        stripe_checkout_url: session.url,
        stripe_id: session.id,
        stripe_expires_at: new Date(session.expires_at * 1000).toISOString(),
      })
      .in('id', commandeIds)
    if (majErr) console.error('[checkout] mise à jour stripe_id:', majErr.message)

    return NextResponse.json({ url: session.url })
  } catch (e) {
    console.error('[checkout] erreur inattendue:', e)
    return erreur(500, 'erreur_serveur', 'Erreur serveur')
  }
}
