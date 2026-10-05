// Simule le webhook Stripe "checkout.session.completed" en local, sans Stripe CLI.
// Usage (depuis le dossier du site) :
//   node scripts/simuler-webhook.mjs                -> liste les 8 dernières sessions Stripe
//   node scripts/simuler-webhook.mjs cs_test_xxx    -> rejoue le paiement de cette session
//   node scripts/simuler-webhook.mjs cs_test_xxx 3001   (port du serveur, 3000 par défaut)
// Lit STRIPE_SECRET_KEY et STRIPE_WEBHOOK_SECRET dans .env.local (rien n'est affiché).
import { readFileSync } from 'node:fs'
import Stripe from 'stripe'

function chargerEnv() {
  try {
    for (const l of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
      const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  } catch { console.error('Fichier .env.local introuvable : lancez la commande depuis le dossier du site.'); process.exit(1) }
}
chargerEnv()

const cle = process.env.STRIPE_SECRET_KEY
const secret = process.env.STRIPE_WEBHOOK_SECRET
if (!cle) { console.error('STRIPE_SECRET_KEY absente de .env.local'); process.exit(1) }
if (!secret) { console.error('STRIPE_WEBHOOK_SECRET absente de .env.local (mettez par exemple whsec_local_test puis redémarrez npm run dev)'); process.exit(1) }

const stripe = new Stripe(cle)
const [id, port = '3000'] = process.argv.slice(2)

if (!id) {
  const liste = await stripe.checkout.sessions.list({ limit: 8 })
  for (const s of liste.data) {
    console.log(`${s.id}  ${s.status}/${s.payment_status}  ${(s.amount_total ?? 0) / 100} €  ${new Date(s.created * 1000).toLocaleString('fr-FR')}  source=${s.metadata?.source ?? '?'}`)
  }
  console.log('\nRejouez avec : node scripts/simuler-webhook.mjs <id de session> [port]')
  process.exit(0)
}

const session = await stripe.checkout.sessions.retrieve(id)
if (session.payment_status !== 'paid') {
  console.error(`Cette session n'est pas payée (statut : ${session.payment_status}). Terminez d'abord le paiement sur la page Stripe.`)
  process.exit(1)
}
const payload = JSON.stringify({
  id: 'evt_local_' + Date.now(), object: 'event', api_version: null, created: Math.floor(Date.now() / 1000),
  type: 'checkout.session.completed', livemode: false, pending_webhooks: 0, request: { id: null, idempotency_key: null },
  data: { object: session },
})
const header = stripe.webhooks.generateTestHeaderString({ payload, secret })
const rep = await fetch(`http://localhost:${port}/api/webhook/stripe`, {
  method: 'POST', headers: { 'Content-Type': 'application/json', 'stripe-signature': header }, body: payload,
})
console.log(rep.status, await rep.text())
