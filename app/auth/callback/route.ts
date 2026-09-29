import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// N'accepte que des chemins internes ("/xxx") : rejette "//domaine", "/\domaine",
// et tout ce qui, une fois résolu, sortirait de notre origine
function cheminInterneSur(next: string | null, origin: string): string {
  const defaut = '/espace-client'
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return defaut
  try {
    const url = new URL(next, origin)
    if (url.origin !== origin) return defaut
    return url.pathname + url.search
  } catch {
    return defaut
  }
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = cheminInterneSur(searchParams.get('next'), origin)

  if (code) {
    const response = NextResponse.redirect(new URL(next, origin))

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return response
    console.error('[auth/callback] error:', error.message)
  }

  const erreurUrl = new URL(next, origin)
  erreurUrl.searchParams.set('erreur', 'lien_invalide')
  return NextResponse.redirect(erreurUrl)
}
