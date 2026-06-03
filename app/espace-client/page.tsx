"use client";

import { useEffect, useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function EspaceClientPage() {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const [loading, setLoading] = useState(true)
  const [client, setClient] = useState<any>(null)

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/connexion')
        return
      }
      const { data } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', session.user.id)
        .single()
      setClient(data)
      setLoading(false)
    }
    checkSession()
  }, [])

  async function handleDeconnexion() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#9B9B9B" }}>Chargement...</p>
    </div>
  )

  return (
    <div style={{ background: "#FAFAF8", minHeight: "100vh" }}>
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "88px 64px 72px" }}>
        <h1 style={{
          fontSize: "clamp(36px, 5vw, 64px)",
          fontWeight: 600, color: "#1A1A1A",
          lineHeight: 1.0, letterSpacing: "-0.025em",
          textTransform: "uppercase", margin: "0 0 32px",
        }}>
          Bonjour<br />
          <span style={{ color: "#C4704F" }}>{client?.prenom} {client?.nom}</span>
        </h1>

        <div style={{ height: "1px", background: "#E8E3D8", marginBottom: "48px" }} />

        <div style={{
          background: "#fff", border: "1px solid #E8E3D8",
          borderRadius: "16px", padding: "32px",
          textAlign: "center",
        }}>
          <p style={{ fontSize: "16px", color: "#9B9B9B" }}>
            Votre espace client est en cours de développement.
          </p>
          <Link href="/commander" style={{
            display: "inline-flex", marginTop: "16px",
            background: "#4D0F1F", color: "#fff",
            fontSize: "14px", fontWeight: 600,
            padding: "12px 24px", borderRadius: "999px",
            textDecoration: "none",
          }}>
            Commander →
          </Link>
        </div>

        <button
          onClick={handleDeconnexion}
          style={{
            marginTop: "32px", background: "transparent",
            border: "none", color: "#9B9B9B",
            fontSize: "13px", cursor: "pointer",
          }}
        >
          Se déconnecter
        </button>

      </section>
    </div>
  )
}
