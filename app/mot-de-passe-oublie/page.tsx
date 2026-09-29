"use client";

import { useState } from "react"
import Link from "next/link"
import { createSupabaseBrowserClient } from "@/lib/supabase"

const MESSAGE_SUCCES = "Si un compte existe avec cet email, vous allez recevoir un lien de réinitialisation."

export default function MotDePasseOubliePage() {
  const supabase = createSupabaseBrowserClient()

  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [envoye, setEnvoye] = useState(false)

  async function handleEnvoi() {
    if (loading) return
    setErrors({})
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrors({ email: "Email invalide" })
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/callback?next=/reinitialiser-mot-de-passe`,
      })
      // Même message que l'email existe ou non : on ne révèle pas l'existence d'un compte
      if (error) console.error('[mot-de-passe-oublie] error:', error.message)
      setEnvoye(true)
    } catch (err) {
      console.error('[mot-de-passe-oublie] error:', err)
      setErrors({ global: "Une erreur est survenue." })
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#FD3D6B] bg-white"
  const errorClass = "text-xs text-red-500 mt-1"

  return (
    <div style={{ background: "#FAFAF8", minHeight: "100vh" }}>
      <section style={{ maxWidth: "520px", margin: "0 auto", padding: "64px 24px" }}>

        <Link href="/connexion" style={{ fontSize: "13px", color: "#9B9B9B", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "32px" }}>
          ← Retour à la connexion
        </Link>

        <h1 style={{ fontSize: "28px", fontWeight: 600, color: "#1A1A1A", letterSpacing: "-0.02em", marginBottom: "8px" }}>
          Mot de passe oublié
        </h1>
        <p style={{ fontSize: "14px", color: "#9B9B9B", marginBottom: "32px" }}>
          Saisissez votre email, nous vous enverrons un lien pour choisir un nouveau mot de passe.
        </p>

        {errors.global && (
          <div style={{ background: "#FDD5D9", borderRadius: "12px", padding: "12px 16px", marginBottom: "20px" }}>
            <p style={{ fontSize: "13px", color: "#4D0F1F" }}>{errors.global}</p>
          </div>
        )}

        {envoye ? (
          <div style={{ background: "#F5F0E8", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
            <p style={{ fontSize: "14px", color: "#1A1A1A", lineHeight: 1.6 }}>{MESSAGE_SUCCES}</p>
          </div>
        ) : (
          <>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.fr" className={inputClass} style={{ borderColor: errors.email ? "#ef4444" : undefined }} onKeyDown={e => e.key === 'Enter' && handleEnvoi()} />
              {errors.email && <p className={errorClass}>{errors.email}</p>}
            </div>

            <button
              onClick={handleEnvoi}
              disabled={loading}
              style={{
                marginTop: "24px", width: "100%",
                background: loading ? "#E8E3D8" : "#4D0F1F",
                color: loading ? "#9B9B9B" : "#fff",
                fontSize: "14px", fontWeight: 600,
                padding: "16px", borderRadius: "999px",
                border: "none", cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Envoi..." : "Envoyer le lien →"}
            </button>
          </>
        )}

      </section>
    </div>
  )
}
