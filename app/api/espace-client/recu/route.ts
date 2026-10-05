import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { getUserFromCookies } from '@/lib/supabase-server'

// Reçu Stripe d'un paiement (une Checkout Session = un paiement = un stripe_id partagé par ses commandes).
// Récupéré à la demande chez Stripe : rien n'est stocké en base.
const REF_RE = /^(cs|pi)_[A-Za-z0-9_]{6,200}$/

// Même réponse pour « paiement inconnu », « pas à vous » et « pas de reçu » :
// on ne révèle jamais l'existence d'un paiement.
function indisponible() {
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Reçu indisponible — Clodia</title></head><body style="font-family:system-ui,sans-serif;background:#FAFAF8;color:#1A1A1A;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;padding:24px;text-align:center"><div><h1 style="font-size:22px;margin:0 0 8px">Reçu indisponible</h1><p style="color:#6B6B6B;font-size:15px;margin:0">Ce reçu n'est pas disponible. Vous pouvez fermer cet onglet.</p></div></body></html>`
  return new NextResponse(html, {
    status: 404,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
  })
}

export async function GET(req: NextRequest) {
  try {
    const ref = req.nextUrl.searchParams.get('ref') ?? ''
    if (!REF_RE.test(ref)) return indisponible()

    const user = await getUserFromCookies()
    if (!user) return indisponible()

    const admin = getSupabaseAdmin()
    const { data: client } = await admin
      .from('clients')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()
    if (!client) return indisponible()

    // Au moins une commande de CE client, avec ce stripe_id, payée (confirmée) ou annulée
    const { data: commande } = await admin
      .from('commandes')
      .select('id')
      .eq('client_id', client.id as string)
      .eq('stripe_id', ref)
      .in('statut', ['confirme', 'annule'])
      .limit(1)
      .maybeSingle()
    if (!commande) return indisponible()

    // Reçu chez Stripe : la charge porte le receipt_url (absent si le paiement n'a pas abouti)
    let charge: Stripe.Charge | string | null | undefined
    if (ref.startsWith('cs_')) {
      const session = await stripe.checkout.sessions.retrieve(ref, {
        expand: ['payment_intent.latest_charge'],
      })
      const pi = session.payment_intent
      charge = pi && typeof pi !== 'string' ? pi.latest_charge : null
    } else {
      const pi = await stripe.paymentIntents.retrieve(ref, { expand: ['latest_charge'] })
      charge = pi.latest_charge
    }

    const url = charge && typeof charge !== 'string' ? charge.receipt_url : null
    if (!url || !url.startsWith('https://')) return indisponible()

    const res = NextResponse.redirect(url, 302)
    res.headers.set('cache-control', 'no-store')
    return res
  } catch (e) {
    // Aucun détail (ni clé ni URL) dans le journal
    console.error('[recu] erreur:', e instanceof Error ? e.name : 'inconnue')
    return indisponible()
  }
}
