import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(url, key)

let browserClient: ReturnType<typeof createBrowserClient> | null = null

export function createSupabaseBrowserClient() {
  if (browserClient) return browserClient
  browserClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  return browserClient
}
