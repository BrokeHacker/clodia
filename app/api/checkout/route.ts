import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

if (!process.env.NEXT_PUBLIC_BASE_URL) throw new Error('Missing NEXT_PUBLIC_BASE_URL')

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { commandeIds, email, total, prenom, nom } = body

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Commande Clodia',
              description: `Commande de ${prenom} ${nom}`,
            },
            unit_amount: Math.round(total * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        commande_ids: commandeIds.join(','),
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    })

    await supabase
      .from('commandes')
      .update({
        stripe_checkout_url: session.url,
        stripe_id: session.id,
      })
      .in('id', commandeIds)

    return NextResponse.json({ url: session.url })
  } catch {
    return NextResponse.json({ error: 'Erreur Stripe' }, { status: 500 })
  }
}
