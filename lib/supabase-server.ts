import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Renvoie l'utilisateur connecté (session lue dans les cookies), ou null pour un invité.
// getUser() valide le jeton auprès de Supabase : on ne fait pas confiance à un simple cookie.
export async function getUserFromCookies() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {
          // Lecture seule ici : le rafraîchissement de session est géré par proxy.ts
        },
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
