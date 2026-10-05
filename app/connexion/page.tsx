"use client";

import { useState, Suspense } from "react"
import Link from "next/link"
import { createSupabaseBrowserClient } from "@/lib/supabase"
import { useRouter, useSearchParams } from "next/navigation"

function ConnexionContent() {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')
  const emailConfirme = searchParams.get('confirme') === '1'

  const [email, setEmail] = useState("")
  const [motDePasse, setMotDePasse] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [nonConfirme, setNonConfirme] = useState(false)
  const [renvoiBloque, setRenvoiBloque] = useState(false)
  const [renvoiMessage, setRenvoiMessage] = useState("")

  async function handleConnexion() {
    setErrors({})
    if (!email.trim()) { setErrors({ email: "Email requis" }); return }
    if (!motDePasse.trim()) { setErrors({ motDePasse: "Mot de passe requis" }); return }

    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password: motDePasse })
      if (error) {
        if (error.code === 'email_not_confirmed' || /not confirmed/i.test(error.message)) {
          setNonConfirme(true)
          setErrors({ global: "Votre adresse email n'est pas encore confirmée. Cliquez sur le lien reçu par email." })
        } else {
          setNonConfirme(false)
          setErrors({ global: "Email ou mot de passe incorrect" })
        }
        return
      }
      if (redirect === 'checkout') {
        router.push('/checkout?auth=success')
      } else {
        router.push('/espace-client')
      }
    } catch (err) {
      setErrors({ global: "Une erreur est survenue." })
    } finally {
      setLoading(false)
    }
  }

  async function renvoyerConfirmation() {
    if (!email.trim() || renvoiBloque) return
    setRenvoiBloque(true)
    setRenvoiMessage("")
    const destination = redirect === 'checkout' ? '/checkout?auth=success' : '/espace-client'
    const echec = redirect === 'checkout' ? '/connexion?confirme=1&redirect=checkout' : '/connexion?confirme=1'
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(destination)}&echec=${encodeURIComponent(echec)}` },
    })
    setRenvoiMessage(error ? "Impossible de renvoyer l'email pour le moment. Réessayez dans quelques minutes." : "Email renvoyé. Pensez à vérifier vos courriers indésirables.")
    setTimeout(() => setRenvoiBloque(false), 60000)
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#FD3D6B] bg-white"
  const errorClass = "text-xs text-red-500 mt-1"

  return (
    <div style={{ background: "#FAFAF8", minHeight: "100vh" }}>
      <section style={{ maxWidth: "520px", margin: "0 auto", padding: "64px 24px" }}>

        <Link href={redirect === 'checkout' ? '/checkout' : '/'} style={{ fontSize: "13px", color: "#9B9B9B", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "32px" }}>
          ← {redirect === 'checkout' ? 'Retour au panier' : "Retour à l'accueil"}
        </Link>

        <h1 style={{ fontSize: "28px", fontWeight: 600, color: "#1A1A1A", letterSpacing: "-0.02em", marginBottom: "8px" }}>
          Se connecter
        </h1>
        <p style={{ fontSize: "14px", color: "#9B9B9B", marginBottom: "32px" }}>
          Pas encore de compte ?{" "}
          <Link href={redirect ? `/inscription?redirect=${redirect}` : "/inscription"} style={{ color: "#4D0F1F", fontWeight: 600, textDecoration: "none" }}>
            Créer un compte
          </Link>
        </p>

        {emailConfirme && (
          <div style={{ background: "#E6F7F7", borderRadius: "12px", padding: "12px 16px", marginBottom: "20px" }}>
            <p style={{ fontSize: "13px", color: "#0B5A5A" }}>Votre adresse email est confirmée. Connectez-vous pour continuer.</p>
          </div>
        )}

        {errors.global && (
          <div style={{ background: "#FDD5D9", borderRadius: "12px", padding: "12px 16px", marginBottom: "20px" }}>
            <p style={{ fontSize: "13px", color: "#4D0F1F" }}>{errors.global}</p>
            {nonConfirme && (
              <button
                onClick={renvoyerConfirmation}
                disabled={renvoiBloque}
                style={{ marginTop: "8px", background: "none", border: "none", padding: 0, fontSize: "13px", fontWeight: 600, color: renvoiBloque ? "#9B9B9B" : "#4D0F1F", cursor: renvoiBloque ? "not-allowed" : "pointer", textDecoration: "underline" }}
              >
                Renvoyer l'email de confirmation
              </button>
            )}
            {renvoiMessage && <p style={{ fontSize: "12px", color: "#4D0F1F", marginTop: "6px" }}>{renvoiMessage}</p>}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.fr" className={inputClass} style={{ borderColor: errors.email ? "#ef4444" : undefined }} onKeyDown={e => e.key === 'Enter' && handleConnexion()} />
            {errors.email && <p className={errorClass}>{errors.email}</p>}
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>Mot de passe</label>
            <input type="password" value={motDePasse} onChange={e => setMotDePasse(e.target.value)} placeholder="Votre mot de passe" className={inputClass} style={{ borderColor: errors.motDePasse ? "#ef4444" : undefined }} onKeyDown={e => e.key === 'Enter' && handleConnexion()} />
            {errors.motDePasse && <p className={errorClass}>{errors.motDePasse}</p>}
          </div>
        </div>

        <button
          onClick={handleConnexion}
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
          {loading ? "Connexion..." : "Se connecter →"}
        </button>

        <p style={{ fontSize: "13px", color: "#9B9B9B", textAlign: "center", marginTop: "16px" }}>
          <Link href="/mot-de-passe-oublie" style={{ color: "#007FFF", textDecoration: "none" }}>
            Mot de passe oublié ?
          </Link>
        </p>

      </section>
    </div>
  )
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={null}>
      <ConnexionContent />
    </Suspense>
  )
}
