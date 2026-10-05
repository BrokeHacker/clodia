import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { normaliserTelephone, REGEX_TELEPHONE } from '@/lib/utils'
import { ipDe, limiteAtteinte } from '@/lib/rate-limit'

// Indique uniquement, pour ce numéro : `compte` (un compte du site existe) ou `whatsapp`
// (client connu du bot WhatsApp, sans compte), afin d'orienter l'inscription.
// Aucune autre information n'est renvoyée. Limité par IP pour freiner l'énumération.
export async function POST(req: NextRequest) {
  if (limiteAtteinte(`tel:${ipDe(req)}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'trop_de_requetes' }, { status: 429 })
  }

  let telephone = ''
  try {
    const body = await req.json()
    telephone = normaliserTelephone(typeof body?.telephone === 'string' ? body.telephone.slice(0, 30) : '')
  } catch {
    // corps invalide : traité comme un numéro invalide
  }
  if (!REGEX_TELEPHONE.test(telephone)) {
    return NextResponse.json({ error: 'telephone_invalide' }, { status: 400 })
  }

  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('clients')
    .select('user_id')
    .eq('telephone', telephone)
    .limit(1)

  if (error) {
    console.error('[auth/telephone]', error.message)
    return NextResponse.json({ error: 'erreur_serveur' }, { status: 500 })
  }

  const fiche = data?.[0]
  let compte = Boolean(fiche?.user_id)
  let whatsapp = Boolean(fiche && !fiche.user_id)

  // Compte jamais confirmé (email erroné, lien perdu) : la connexion est impossible.
  // On oriente vers le bot (« compte »), qui libère la fiche et renvoie un nouveau lien.
  if (fiche?.user_id) {
    const { data: u, error: errU } = await admin.auth.admin.getUserById(fiche.user_id)
    if (!errU && u?.user && !u.user.email_confirmed_at) {
      compte = false
      whatsapp = true
    }
  }

  return NextResponse.json(
    { compte, whatsapp },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
