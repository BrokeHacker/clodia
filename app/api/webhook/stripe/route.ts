import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

if (!process.env.STRIPE_WEBHOOK_SECRET) throw new Error('Missing STRIPE_WEBHOOK_SECRET')
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

interface LigneCommande {
  id: string
  menu_id: string
  variante: string
  quantite: number
  type: string
  prix_unitaire: number
}

// Date de livraison de chaque menu concerné (pour retrouver le créneau à mettre à jour)
async function datesParMenu(menuIds: string[]) {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin.from('menus').select('id, date_livraison').in('id', menuIds)
  if (error) throw new Error(`lecture menus: ${error.message}`)
  return new Map((data ?? []).map(m => [m.id as string, m.date_livraison as string]))
}

async function paiementReussi(session: Stripe.Checkout.Session) {
  const admin = getSupabaseAdmin()
  const ids = session.metadata?.commande_ids?.split(',').filter(Boolean) ?? []
  if (ids.length === 0) return

  // Seules les commandes encore "en_attente" sont traitées : un rejeu de l'évènement
  // par Stripe ne double-compte donc jamais les créneaux.
  const { data: enAttente, error } = await admin
    .from('commandes')
    .select('id, menu_id, variante, quantite, type, prix_unitaire')
    .in('id', ids)
    .eq('statut', 'en_attente')
  if (error) throw new Error(`lecture commandes: ${error.message}`)
  if (!enAttente || enAttente.length === 0) return

  // Contrôle : le montant réellement payé doit correspondre aux commandes
  const attendu = (enAttente as LigneCommande[]).reduce(
    (a, c) => a + Math.round(Number(c.prix_unitaire) * 100) * c.quantite,
    0
  )
  if (session.payment_status !== 'paid' || session.amount_total !== attendu) {
    console.error('[stripe] paiement non conforme, commandes laissées en attente', {
      session: session.id,
      statut_paiement: session.payment_status,
      paye: session.amount_total,
      attendu,
    })
    return
  }

  const { data: confirmees, error: majErr } = await admin
    .from('commandes')
    .update({ statut: 'confirme', stripe_id: session.id })
    .in('id', ids)
    .eq('statut', 'en_attente')
    .select('id, menu_id, variante, quantite, type, prix_unitaire')
  if (majErr) throw new Error(`confirmation commandes: ${majErr.message}`)

  const unites = ((confirmees ?? []) as LigneCommande[]).filter(c => c.type === 'unite')
  if (unites.length === 0) return

  const dates = await datesParMenu([...new Set(unites.map(c => c.menu_id))])
  for (const c of unites) {
    const date = dates.get(c.menu_id)
    if (!date) continue
    const { error: rpcErr } = await admin.rpc('incrementer_confirmes_slot', {
      p_date: date,
      p_variante: c.variante,
      p_quantite: c.quantite,
    })
    if (rpcErr) throw new Error(`incrementer_confirmes_slot: ${rpcErr.message}`)
  }
}

async function sessionExpiree(session: Stripe.Checkout.Session) {
  const admin = getSupabaseAdmin()
  const ids = session.metadata?.commande_ids?.split(',').filter(Boolean) ?? []
  if (ids.length === 0) return

  const { data: annulees, error } = await admin
    .from('commandes')
    .update({ statut: 'annule' })
    .in('id', ids)
    .eq('statut', 'en_attente')
    .select('id, menu_id, variante, quantite, type, prix_unitaire')
  if (error) throw new Error(`annulation commandes: ${error.message}`)

  const unites = ((annulees ?? []) as LigneCommande[]).filter(c => c.type === 'unite')
  if (unites.length === 0) return

  const dates = await datesParMenu([...new Set(unites.map(c => c.menu_id))])
  for (const c of unites) {
    const date = dates.get(c.menu_id)
    if (!date) continue
    const { error: rpcErr } = await admin.rpc('decrementer_reserves_slot', {
      p_date: date,
      p_variante: c.variante,
      p_quantite: c.quantite,
    })
    if (rpcErr) throw new Error(`decrementer_reserves_slot: ${rpcErr.message}`)
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Session créée par le bot WhatsApp : c'est son propre webhook qui la traite
  const objet = event.data.object as { metadata?: Record<string, string> | null }
  if (objet.metadata?.source === 'bot') return NextResponse.json({ received: true, ignored: 'bot' })

  try {
    if (event.type === 'checkout.session.completed') {
      await paiementReussi(event.data.object as Stripe.Checkout.Session)
    } else if (event.type === 'checkout.session.expired') {
      await sessionExpiree(event.data.object as Stripe.Checkout.Session)
    }
  } catch (e) {
    // On répond 500 pour que Stripe réessaie (le traitement est idempotent)
    console.error('[stripe webhook] erreur de traitement:', e)
    return NextResponse.json({ error: 'Processing error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
