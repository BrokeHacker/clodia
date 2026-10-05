"use client";

import { useState } from "react"
import Link from "next/link"
import { normaliserTelephone, REGEX_TELEPHONE } from "@/lib/utils"

export const TYPES_DEMANDE = [
  { valeur: "annulation", libelle: "Modifier ou annuler une commande" },
  { valeur: "probleme_livraison", libelle: "Signaler un problème avec une commande" },
  { valeur: "nouveau_point", libelle: "Demander un nouveau point de livraison" },
  { valeur: "autre", libelle: "Autre question" },
]

const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#FD3D6B] bg-white"
const labelStyle = { fontSize: "12px", fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase" as const, letterSpacing: "0.08em", display: "block", marginBottom: "6px" }

// Formulaire public « Nous contacter » (clients avec ou sans compte).
export default function ContactForm({ typeInitial }: { typeInitial?: string }) {
  const [type, setType] = useState(TYPES_DEMANDE.some(t => t.valeur === typeInitial) ? (typeInitial as string) : "annulation")
  const [nom, setNom] = useState("")
  const [email, setEmail] = useState("")
  const [telephone, setTelephone] = useState("")
  const [refCommande, setRefCommande] = useState("")
  const [message, setMessage] = useState("")
  const [website, setWebsite] = useState("") // champ piège anti-robots
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [envoye, setEnvoye] = useState(false)

  async function handleEnvoi() {
    if (loading) return
    const e: Record<string, string> = {}
    if (!nom.trim()) e.nom = "Nom requis"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Email invalide"
    if (telephone.trim() && !REGEX_TELEPHONE.test(normaliserTelephone(telephone))) e.telephone = "Numéro de téléphone invalide"
    if (message.trim().length < 5) e.message = "Merci de décrire votre demande"
    setErrors(e)
    if (Object.keys(e).length > 0) return

    setLoading(true)
    try {
      const r = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, nom, email, telephone, refCommande: type === "nouveau_point" ? "" : refCommande, message, website }),
      })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) { setErrors({ global: j.error ?? "Une erreur est survenue. Veuillez réessayer." }); return }
      setEnvoye(true)
    } catch {
      setErrors({ global: "Connexion impossible. Veuillez réessayer." })
    } finally {
      setLoading(false)
    }
  }

  if (envoye) {
    return (
      <div style={{ background: "#E8FFF8", border: "1px solid #00CCCC", borderRadius: "16px", padding: "28px" }}>
        <p style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A", marginBottom: "8px" }}>Demande bien reçue ✓</p>
        <p style={{ fontSize: "14px", color: "#4B4B4B", lineHeight: 1.6 }}>
          Merci, notre équipe va traiter votre demande. Nous reviendrons vers vous par email ou par téléphone si besoin.
        </p>
        <Link href="/" style={{ display: "inline-block", marginTop: "16px", fontSize: "13px", color: "#007FFF", fontWeight: 600, textDecoration: "none" }}>← Retour à l&apos;accueil</Link>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {errors.global && (
        <div style={{ background: "#FDD5D9", borderRadius: "12px", padding: "12px 16px" }}>
          <p style={{ fontSize: "13px", color: "#4D0F1F" }}>{errors.global}</p>
        </div>
      )}

      <div>
        <label style={labelStyle}>Votre demande</label>
        <select value={type} onChange={ev => setType(ev.target.value)} className={inputClass}>
          {TYPES_DEMANDE.map(t => <option key={t.valeur} value={t.valeur}>{t.libelle}</option>)}
        </select>
      </div>

      <div>
        <label style={labelStyle}>Nom et prénom</label>
        <input value={nom} onChange={ev => setNom(ev.target.value)} maxLength={100} autoComplete="name" className={inputClass} style={{ borderColor: errors.nom ? "#ef4444" : undefined }} />
        {errors.nom && <p className="text-xs text-red-500 mt-1">{errors.nom}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Email</label>
          <input type="email" value={email} onChange={ev => setEmail(ev.target.value)} maxLength={200} autoComplete="email" placeholder="votre@email.fr" className={inputClass} style={{ borderColor: errors.email ? "#ef4444" : undefined }} />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>
        <div>
          <label style={labelStyle}>Téléphone (facultatif)</label>
          <input type="tel" value={telephone} onChange={ev => setTelephone(ev.target.value)} maxLength={30} autoComplete="tel" placeholder="06 12 34 56 78" className={inputClass} style={{ borderColor: errors.telephone ? "#ef4444" : undefined }} />
          {errors.telephone && <p className="text-xs text-red-500 mt-1">{errors.telephone}</p>}
        </div>
      </div>

      {type !== "nouveau_point" && (
        <div>
          <label style={labelStyle}>N° de commande (facultatif)</label>
          <input value={refCommande} onChange={ev => setRefCommande(ev.target.value)} maxLength={12} inputMode="numeric" placeholder="Indiqué dans votre confirmation de commande" className={inputClass} />
        </div>
      )}

      <div>
        <label style={labelStyle}>Message</label>
        <textarea value={message} onChange={ev => setMessage(ev.target.value)} maxLength={2000} rows={5} placeholder={type === "nouveau_point" ? "Indiquez votre établissement, votre bâtiment et votre service, et si possible l'emplacement d'un frigo à disposition." : undefined} className={inputClass} style={{ borderColor: errors.message ? "#ef4444" : undefined, resize: "vertical" }} />
        {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
      </div>

      {/* Champ piège : invisible, ne pas remplir */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: "1px", height: "1px", overflow: "hidden" }}>
        <label>Ne pas remplir<input tabIndex={-1} autoComplete="off" value={website} onChange={ev => setWebsite(ev.target.value)} /></label>
      </div>

      <p style={{ fontSize: "12px", color: "#9B9B9B", lineHeight: 1.5 }}>
        Les informations saisies servent uniquement à traiter votre demande. Pour en savoir plus, consultez notre{" "}
        <Link href="/confidentialite" style={{ color: "#007FFF" }}>politique de confidentialité</Link>.
      </p>

      <button onClick={handleEnvoi} disabled={loading}
        style={{ width: "100%", background: loading ? "#E8E3D8" : "#4D0F1F", color: loading ? "#9B9B9B" : "#fff", fontSize: "14px", fontWeight: 600, padding: "16px", borderRadius: "999px", border: "none", cursor: loading ? "not-allowed" : "pointer" }}>
        {loading ? "Envoi..." : "Envoyer ma demande →"}
      </button>
    </div>
  )
}
