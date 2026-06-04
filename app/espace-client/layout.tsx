"use client";

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { createSupabaseBrowserClient } from "@/lib/supabase"

const navItems = [
  { href: "/espace-client", label: "Accueil", icon: "ti-home" },
  { href: "/espace-client/commandes", label: "Commandes en cours", icon: "ti-clock" },
  { href: "/espace-client/historique", label: "Historique", icon: "ti-history" },
  { href: "/espace-client/programmation", label: "Programmation", icon: "ti-calendar" },
  { href: "/espace-client/profil", label: "Mon profil", icon: "ti-user" },
]

export default function EspaceClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const [client, setClient] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/connexion'); return }
      const { data } = await supabase
        .from('clients')
        .select('prenom, nom')
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
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAFAF8" }}>
      <p style={{ color: "#9B9B9B" }}>Chargement...</p>
    </div>
  )

  return (
    <div style={{ background: "#FAFAF8", minHeight: "100vh", display: "flex" }}>

      {/* Sidebar gauche — desktop uniquement */}
      <aside className="hidden md:flex" style={{
        width: "260px", flexShrink: 0,
        background: "#fff", borderRight: "1px solid #E8E3D8",
        flexDirection: "column",
        padding: "32px 16px",
        position: "sticky", top: 0, height: "100vh",
        overflowY: "auto",
      }}>

        {/* Avatar + nom */}
        <div style={{ padding: "0 8px 24px", borderBottom: "1px solid #E8E3D8", marginBottom: "24px" }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "#4D0F1F", display: "flex",
            alignItems: "center", justifyContent: "center",
            marginBottom: "10px",
          }}>
            <span style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>
              {client?.prenom?.[0]}{client?.nom?.[0]}
            </span>
          </div>
          <p style={{ fontSize: "14px", fontWeight: 600, color: "#1A1A1A" }}>
            {client?.prenom} {client?.nom}
          </p>
          <p style={{ fontSize: "12px", color: "#9B9B9B", marginTop: "2px" }}>
            Espace client
          </p>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
          {navItems.map(item => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "10px 12px", borderRadius: "12px",
                  textDecoration: "none", fontSize: "14px", fontWeight: 500,
                  background: isActive ? "#F5F0E8" : "transparent",
                  color: isActive ? "#4D0F1F" : "#6B6B6B",
                  transition: "all 0.15s ease",
                }}
              >
                <i className={`ti ${item.icon}`} style={{ fontSize: 18 }} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Déconnexion */}
        <div style={{ borderTop: "1px solid #E8E3D8", paddingTop: "16px", marginTop: "16px" }}>
          <button
            onClick={handleDeconnexion}
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              width: "100%", padding: "10px 12px", borderRadius: "12px",
              background: "transparent", border: "none",
              fontSize: "14px", fontWeight: 500, color: "#9B9B9B",
              cursor: "pointer", transition: "all 0.15s ease",
            }}
          >
            <i className="ti ti-logout" style={{ fontSize: 18 }} />
            Se déconnecter
          </button>
        </div>

      </aside>

      {/* Contenu principal */}
      <main style={{ flex: 1, overflowY: "auto" }}>
        {children}
      </main>

    </div>
  )
}
