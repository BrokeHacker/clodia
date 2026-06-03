import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature invalide:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const commandeIds = session.metadata?.commande_ids?.split(',') ?? []

    if (commandeIds.length > 0) {
      await supabase
        .from('commandes')
        .update({ statut: 'confirme', stripe_id: session.id })
        .in('id', commandeIds)

      const { data: commandes } = await supabase
        .from('commandes')
        .select('menu_id, variante, quantite, type')
        .in('id', commandeIds)
        .eq('type', 'unite')

      if (commandes) {
        const menuIds = commandes.map(c => c.menu_id)
        const { data: menus } = await supabase
          .from('menus')
          .select('id, date_livraison')
          .in('id', menuIds)

        for (const commande of commandes) {
          const menu = menus?.find(m => m.id === commande.menu_id)
          if (!menu) continue

          const { data: slot } = await supabase
            .from('slots_unite')
            .select('id, reserves, confirmes')
            .eq('date_livraison', menu.date_livraison)
            .eq('variante', commande.variante)
            .single()

          if (slot) {
            await supabase
              .from('slots_unite')
              .update({
                confirmes: (slot.confirmes ?? 0) + commande.quantite,
                reserves: Math.max(0, (slot.reserves ?? 0) - commande.quantite),
              })
              .eq('id', slot.id)
          }
        }
      }
    }
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as any
    const commandeIds = session.metadata?.commande_ids?.split(',') ?? []

    if (commandeIds.length > 0) {
      await supabase
        .from('commandes')
        .update({ statut: 'annule' })
        .in('id', commandeIds)

      const { data: commandes } = await supabase
        .from('commandes')
        .select('menu_id, variante, quantite, type')
        .in('id', commandeIds)
        .eq('type', 'unite')

      if (commandes) {
        const menuIds = commandes.map(c => c.menu_id)
        const { data: menus } = await supabase
          .from('menus')
          .select('id, date_livraison')
          .in('id', menuIds)

        for (const commande of commandes) {
          const menu = menus?.find(m => m.id === commande.menu_id)
          if (!menu) continue

          const { data: slot } = await supabase
            .from('slots_unite')
            .select('id, reserves')
            .eq('date_livraison', menu.date_livraison)
            .eq('variante', commande.variante)
            .single()

          if (slot) {
            await supabase
              .from('slots_unite')
              .update({
                reserves: Math.max(0, (slot.reserves ?? 0) - commande.quantite),
              })
              .eq('id', slot.id)
          }
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
