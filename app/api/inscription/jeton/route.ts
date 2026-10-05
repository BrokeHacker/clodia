import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { ipDe, limiteAtteinte } from '@/lib/rate-limit'

// Vérifie un lien d'inscription envoyé par le bot WhatsApp et renvoie de quoi préremplir
// le formulaire. Le jeton n'est PAS consommé ici : c'est le trigger de création de compte
// (handle_new_user) qui le consomme, de façon atomique, au moment de l'inscription.
const noStore = { 'Cache-Control': 'no-store' }

function masquer(tel: string | null): string {
  if (!tel) return ''
  const d = tel.startsWith('+33') ? `0${tel.slice(3)}` : tel
  if (d.length < 4) return ''
  return `${d.slice(0, 2)} •• •• •• ${d.slice(-2)}`
}

export async function GET(req: NextRequest) {
  if (limiteAtteinte(`jeton:${ipDe(req)}`, 20, 10 * 60 * 1000)) {
    return NextResponse.json({ valide: false, error: 'trop_de_requetes' }, { status: 429, headers: noStore })
  }

  const t = req.nextUrl.searchParams.get('t') ?? ''
  if (!/^[A-Za-z0-9_-]{20,128}$/.test(t)) {
    return NextResponse.json({ valide: false }, { headers: noStore })
  }

  const hash = createHash('sha256').update(t).digest('hex')
  const admin = getSupabaseAdmin()

  const { data: jeton, error } = await admin
    .from('signup_tokens')
    .select('client_id, expires_at, used_at')
    .eq('token_hash', hash)
    .maybeSingle()
  if (error) {
    console.error('[inscription/jeton]', error.message)
    return NextResponse.json({ valide: false, error: 'erreur_serveur' }, { status: 500, headers: noStore })
  }
  if (!jeton || jeton.used_at || new Date(jeton.expires_at as string) <= new Date()) {
    return NextResponse.json({ valide: false }, { headers: noStore })
  }

  const { data: client } = await admin
    .from('clients')
    .select('prenom, nom, email, telephone, user_id')
    .eq('id', jeton.client_id)
    .maybeSingle()
  if (!client) return NextResponse.json({ valide: false }, { headers: noStore })
  if (client.user_id) return NextResponse.json({ valide: false, compteExistant: true }, { headers: noStore })

  return NextResponse.json(
    {
      valide: true,
      prenom: (client.prenom as string | null) ?? '',
      nom: (client.nom as string | null) ?? '',
      email: (client.email as string | null) ?? '',
      telephoneMasque: masquer(client.telephone as string | null),
    },
    { headers: noStore }
  )
}
