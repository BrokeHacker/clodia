"use client";

import { useState } from "react"

// Bouton + petit formulaire pour les clients connectés, rattaché à une commande.
//  * mode "modifier" (commande à venir) : « Modifier ou annuler », sans choix de type (ticket d'annulation / modification)
//  * mode "general" (commande du jour ou passée) : « Faire une demande » avec « Signaler un problème » ou « Autre question »
//    (pas de demande de remboursement proposée : c'est l'équipe qui décide d'un geste commercial)
export default function DemandeCommande({ commandeId, libelle, mode }: { commandeId: string; libelle: string; mode: "modifier" | "general" }) {
  const modifier = mode === "modifier"
  const [ouvert, setOuvert] = useState(false)
  const [type, setType] = useState(modifier ? "annulation" : "probleme_livraison")
  const [message, setMessage] = useState("")
  const [erreur, setErreur] = useState("")
  const [loading, setLoading] = useState(false)
  const [envoye, setEnvoye] = useState(false)

  const titre = modifier ? "Modifier ou annuler" : "Faire une demande"

  async function envoyer() {
    if (loading) return
    if (message.trim().length < 5) { setErreur("Merci de décrire votre demande."); return }
    setLoading(true); setErreur("")
    try {
      const r = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, message, commandeId, website: "" }),
      })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) setErreur(j.error ?? "Une erreur est survenue. Veuillez réessayer.")
      else setEnvoye(true)
    } catch {
      setErreur("Connexion impossible. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  if (envoye) return <span style={{ fontSize: "11px", color: "#00A5A5", fontWeight: 600 }}>Demande envoyée ✓</span>

  return (
    <>
      <button onClick={() => setOuvert(true)}
        style={{ fontSize: "12px", color: "#4D0F1F", fontWeight: 600, background: "#fff", border: "1.5px solid #4D0F1F", borderRadius: "999px", cursor: "pointer", padding: "5px 14px", whiteSpace: "nowrap", lineHeight: 1.2 }}>
        {titre}
      </button>

      {ouvert && (
        <div role="dialog" aria-modal="true" onClick={() => !loading && setOuvert(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", zIndex: 1000 }}>
          <div onClick={ev => ev.stopPropagation()} style={{ background: "#fff", borderRadius: "16px", padding: "24px", width: "100%", maxWidth: "440px", textAlign: "left" }}>
            <p style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A", marginBottom: "4px" }}>{titre}</p>
            <p style={{ fontSize: "12px", color: "#9B9B9B", marginBottom: "16px" }}>{libelle}</p>

            {!modifier && (
              <>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B6B6B", display: "block", marginBottom: "6px" }}>Votre demande</label>
                <select value={type} onChange={ev => setType(ev.target.value)}
                  style={{ width: "100%", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "10px 12px", fontSize: "14px", marginBottom: "12px", background: "#fff" }}>
                  <option value="probleme_livraison">Signaler un problème</option>
                  <option value="autre">Autre question</option>
                </select>
              </>
            )}

            <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B6B6B", display: "block", marginBottom: "6px" }}>{modifier ? "Que souhaitez-vous ?" : "Commentaire"}</label>
            <textarea value={message} onChange={ev => setMessage(ev.target.value)} maxLength={2000} rows={4}
              placeholder={modifier ? "Ex. : annuler la commande, annuler 2 plats sur 5, passer en végétarien." : "Décrivez ce qui s'est passé (ex. : repas absent du frigo, problème de qualité…)."}
              style={{ width: "100%", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "10px 12px", fontSize: "14px", resize: "vertical" }} />

            {erreur && <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "8px" }}>{erreur}</p>}

            <div style={{ display: "flex", gap: "8px", marginTop: "16px", justifyContent: "flex-end" }}>
              <button onClick={() => setOuvert(false)} disabled={loading}
                style={{ fontSize: "13px", padding: "10px 16px", borderRadius: "999px", border: "1px solid #E8E3D8", background: "transparent", color: "#6B6B6B", cursor: "pointer" }}>
                Fermer
              </button>
              <button onClick={envoyer} disabled={loading}
                style={{ fontSize: "13px", fontWeight: 600, padding: "10px 18px", borderRadius: "999px", border: "none", background: loading ? "#E8E3D8" : "#4D0F1F", color: loading ? "#9B9B9B" : "#fff", cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Envoi..." : "Envoyer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
