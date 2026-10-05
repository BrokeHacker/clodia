import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Client "administrateur" : utilise la clé service_role, qui CONTOURNE la RLS.
// À importer UNIQUEMENT depuis du code serveur (app/api/**).
// Ne jamais l'importer depuis un composant "use client" (la clé fuiterait dans le navigateur).
// La variable SUPABASE_SERVICE_ROLE_KEY ne doit JAMAIS commencer par NEXT_PUBLIC_.
let admin: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (admin) return admin
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Configuration Supabase serveur manquante (SUPABASE_SERVICE_ROLE_KEY)')
  admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return admin
}
