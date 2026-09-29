"use client";

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { createSupabaseBrowserClient } from "@/lib/supabase"
import { useRouter, useSearchParams } from "next/navigation"
import { validerMotDePasse } from "@/lib/utils"

type EtatSession = 'verification' | 'valide' | 'invalide'

function ReinitialiserContent() {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const searchParams = useSearchParams()
  const erreurLien = searchParams.get('erreur') === 'lien_invalide'

  const [etatSession, setEtatSession] = useState<EtatSession>('verification')
  const [motDePasse, setMotDePasse] = useState("")
  const [motDePasseConfirm, setMotDePasseConfirm] = useState("")
  const [mdpFocus, setMdpFocus] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [succes, setSucces] = useState(false)

  useEffect(() => {
    if (erreurLien) {
      setEtatSession('invalide')
      return
    }
    async function verifierSession() {
      try {
        const { data } = await supabase.auth.getSession()
        setEtatSession(data.session ? 'valide' : 'invalide')
      } catch (err: unknown) {
        console.error('[reinitialiser-mot-de-passe] error:', err)
        setEtatSession('invalide')
      }
    }
    verifierSession()
  }, [supabase, erreurLien])

  useEffect(() => {
    if (!succes) return
    const timer = setTimeout(() => router.push('/espace-client'), 2000)
    return () => clearTimeout(timer)
  }, [succes, router])

  async function handleReinitialisation() {
    if (loading) return
    const newErrors: Record<string, string> = {}
    if (!validerMotDePasse(motDePasse).valide) newErrors.motDePasse = "Le mot de passe ne respecte pas les critères requis"
    if (motDePasse !== motDePasseConfirm) newErrors.motDePasseConfirm = "Les mots de passe ne correspondent pas"
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: motDePasse })
      if (error) {
        console.error('[reinitialiser-mot-de-passe] error:', error.message)
        setErrors({ global: "Impossible de mettre à jour le mot de passe. Le lien a peut-être expiré." })
        return
      }
      setSucces(true)
    } catch (err) {
      console.error('[reinitialiser-mot-de-passe] error:', err)
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
          Nouveau mot de passe
        </h1>

        {etatSession === 'verification' && (
          <p style={{ fontSize: "14px", color: "#9B9B9B", marginBottom: "32px" }}>Vérification du lien...</p>
        )}

        {etatSession === 'invalide' && (
          <div style={{ background: "#FDD5D9", borderRadius: "12px", padding: "12px 16px", marginTop: "24px" }}>
            <p style={{ fontSize: "13px", color: "#4D0F1F" }}>
              Ce lien a expiré ou n&apos;est plus valide.{" "}
              <Link href="/mot-de-passe-oublie" style={{ color: "#4D0F1F", fontWeight: 600 }}>
                Demander un nouveau lien
              </Link>
            </p>
          </div>
        )}

        {etatSession === 'valide' && succes && (
          <div style={{ background: "#F5F0E8", borderRadius: "12px", padding: "16px", marginTop: "24px" }}>
            <p style={{ fontSize: "14px", color: "#1A1A1A", lineHeight: 1.6 }}>
              Votre mot de passe a été modifié. Redirection vers votre espace client...
            </p>
          </div>
        )}

        {etatSession === 'valide' && !succes && (
          <>
            <p style={{ fontSize: "14px", color: "#9B9B9B", marginBottom: "32px" }}>
              Choisissez votre nouveau mot de passe.
            </p>

            {errors.global && (
              <div style={{ background: "#FDD5D9", borderRadius: "12px", padding: "12px 16px", marginBottom: "20px" }}>
                <p style={{ fontSize: "13px", color: "#4D0F1F" }}>{errors.global}</p>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>Nouveau mot de passe</label>
                <input type="password" value={motDePasse} onChange={e => setMotDePasse(e.target.value)} onFocus={() => setMdpFocus(true)} placeholder="Minimum 8 caractères" className={inputClass} style={{ borderColor: errors.motDePasse ? "#ef4444" : undefined }} />
                {errors.motDePasse && <p className={errorClass}>{errors.motDePasse}</p>}
                {(mdpFocus || motDePasse.length > 0) && (() => {
                  const { force, regles } = validerMotDePasse(motDePasse)
                  return (
                    <div style={{ marginTop: "8px" }}>
                      <div style={{ display: "flex", gap: "4px", marginBottom: "8px" }}>
                        {['faible', 'moyen', 'fort'].map((niveau, i) => (
                          <div key={niveau} style={{
                            flex: 1, height: "4px", borderRadius: "999px",
                            background: force === 'faible' && i === 0 ? "#ef4444"
                              : force === 'moyen' && i <= 1 ? "#FF9933"
                              : force === 'fort' ? "#00CCCC"
                              : "#E8E3D8",
                            transition: "background 0.2s ease",
                          }} />
                        ))}
                      </div>
                      <p style={{ fontSize: "11px", fontWeight: 600, color:
                        force === 'faible' ? "#ef4444" :
                        force === 'moyen' ? "#FF9933" : "#00CCCC",
                        marginBottom: "6px",
                      }}>
                        Force : {force === 'faible' ? 'Faible' : force === 'moyen' ? 'Moyen' : 'Fort'}
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                        {regles.map(r => (
                          <p key={r.label} style={{ fontSize: "11px", color: r.ok ? "#00CCCC" : "#9B9B9B", display: "flex", alignItems: "center", gap: "6px" }}>
                            <span>{r.ok ? "✓" : "○"}</span>
                            {r.label}
                          </p>
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>Confirmer le mot de passe</label>
                <input type="password" value={motDePasseConfirm} onChange={e => setMotDePasseConfirm(e.target.value)} placeholder="Répétez votre mot de passe" className={inputClass} style={{ borderColor: errors.motDePasseConfirm ? "#ef4444" : undefined }} onKeyDown={e => e.key === 'Enter' && handleReinitialisation()} />
                {errors.motDePasseConfirm && <p className={errorClass}>{errors.motDePasseConfirm}</p>}
              </div>
            </div>

            <button
              onClick={handleReinitialisation}
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
              {loading ? "Enregistrement..." : "Enregistrer le mot de passe →"}
            </button>
          </>
        )}

      </section>
    </div>
  )
}

export default function ReinitialiserMotDePassePage() {
  return (
    <Suspense fallback={null}>
      <ReinitialiserContent />
    </Suspense>
  )
}
