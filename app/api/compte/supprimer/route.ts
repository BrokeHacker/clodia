import { NextRequest, NextResponse } from 'next/server'
import { getUserFromCookies } from '@/lib/supabase-server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { ipDe, limiteAtteinte } from '@/lib/rate-limit'

// Suppression (effacement RGPD) du compte de l'utilisateur CONNECTÉ.
// Toute la partie données est faite par la fonction SQL supprimer_client (une transaction),
// puis le compte de connexion est supprimé.
export async function POST(req: NextRequest) {
  // Requête émise depuis notre propre site uniquement
  const origin = req.headers.get('origin')
  const host = req.headers.get('host')
  if (origin) {
    let hoteOrigine = ''
    try { hoteOrigine = new URL(origin).host } catch { /* origine invalide */ }
    if (hoteOrigine !== host) {
      return NextResponse.json({ error: 'interdit' }, { status: 403 })
    }
  }

  if (limiteAtteinte(`suppr:${ipDe(req)}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'trop_de_requetes' }, { status: 429 })
  }

  const user = await getUserFromCookies()
  if (!user) {
    return NextResponse.json({ error: 'non_connecte' }, { status: 401 })
  }

  let confirmation = ''
  try {
    const body = await req.json()
    confirmation = typeof body?.confirmation === 'string' ? body.confirmation : ''
  } catch {
    // corps invalide
  }
  if (confirmation !== 'SUPPRIMER') {
    return NextResponse.json({ error: 'confirmation_requise' }, { status: 400 })
  }

  const admin = getSupabaseAdmin()

  const { data, error } = await admin.rpc('supprimer_client', { p_user_id: user.id })
  if (error) {
    console.error('[compte/supprimer] rpc', error.message)
    return NextResponse.json({ error: 'erreur_serveur' }, { status: 500 })
  }

  const statut = (data as { statut?: string } | null)?.statut
  if (statut === 'commandes_a_venir' || statut === 'paiement_en_cours') {
    return NextResponse.json({ error: statut }, { status: 409 })
  }
  if (statut !== 'ok') {
    console.error('[compte/supprimer] statut inattendu', statut)
    return NextResponse.json({ error: 'erreur_serveur' }, { status: 500 })
  }

  // Les données personnelles sont effacées : on supprime maintenant le compte de connexion.
  // En cas d'échec, l'opération peut être relancée (la fonction SQL est idempotente).
  const { error: errUser } = await admin.auth.admin.deleteUser(user.id)
  if (errUser) {
    console.error('[compte/supprimer] deleteUser', errUser.message)
    return NextResponse.json({ error: 'suppression_incomplete' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } })
}
