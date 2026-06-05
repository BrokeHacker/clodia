"use client";

import { useEffect, useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase"

const JOURS = [
  { key: 'lundi', label: 'Lundi' },
  { key: 'mardi', label: 'Mardi' },
  { key: 'mercredi', label: 'Mercredi' },
  { key: 'jeudi', label: 'Jeudi' },
  { key: 'vendredi', label: 'Vendredi' },
]

const VARIANTES = [
  { key: 'standard', label: 'Plat standard', description: 'Le plat du jour chaque semaine' },
  { key: 'vegetarien', label: 'Végétarien', description: 'L\'alternative végétarienne chaque semaine' },
  { key: 'alternance', label: 'En alternance', description: 'Une semaine standard, une semaine végétarien' },
]

export default function ProgrammationPage() {
  const supabase = createSupabaseBrowserClient()

  const [client, setClient] = useState<any>(null)
  const [joursSelectionnes, setJoursSelectionnes] = useState<string[]>([])
  const [variante, setVariante] = useState('standard')
  const [actif, setActif] = useState(true)
  const [programmationId, setProgrammationId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', session.user.id)
        .single()

      if (!clientData) return
      setClient(clientData)

      const { data: prog } = await supabase
        .from('programmations')
        .select('*')
        .eq('client_id', clientData.id)
        .single()

      if (prog) {
        setProgrammationId(prog.id)
        setJoursSelectionnes(prog.jours ?? [])
        setVariante(prog.variante ?? 'standard')
        setActif(prog.actif ?? true)
      }

      setLoading(false)
    }
    load()
  }, [])

  function toggleJour(jour: string) {
    setJoursSelectionnes(prev =>
      prev.includes(jour) ? prev.filter(j => j !== jour) : [...prev, jour]
    )
  }

  async function handleSave() {
    if (joursSelectionnes.length === 0) return
    setSaving(true)

    const payload = {
      client_id: client.id,
      jours: joursSelectionnes,
      variante,
      actif,
      updated_at: new Date().toISOString(),
    }

    if (programmationId) {
      await supabase
        .from('programmations')
        .update(payload)
        .eq('id', programmationId)
    } else {
      const { data } = await supabase
        .from('programmations')
        .insert(payload)
        .select('id')
        .single()
      if (data) setProgrammationId(data.id)
    }

    setSaving(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  async function handleToggleActif() {
    if (!programmationId) return
    const nouvelEtat = !actif
    setActif(nouvelEtat)
    await supabase
      .from('programmations')
      .update({ actif: nouvelEtat, updated_at: new Date().toISOString() })
      .eq('id', programmationId)
  }

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px" }}>
      <p style={{ color: "#9B9B9B" }}>Chargement...</p>
    </div>
  )

  const joursOrdre = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi']
  const joursLabel = joursSelectionnes
    .sort((a, b) => joursOrdre.indexOf(a) - joursOrdre.indexOf(b))
    .map(j => j.charAt(0).toUpperCase() + j.slice(1))
    .join(', ')

  return (
    <div style={{ padding: "40px 48px", maxWidth: "680px", margin: "0 auto" }}>

      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 600, color: "#1A1A1A", letterSpacing: "-0.02em", marginBottom: "8px" }}>
          Ma programmation
        </h1>
        <p style={{ fontSize: "14px", color: "#9B9B9B", lineHeight: 1.6 }}>
          Définissez votre rythme habituel. Chaque jeudi, vous recevrez un rappel
          avec votre panier pré-rempli pour la semaine suivante. Sans engagement —
          vous pouvez modifier ou annuler à tout moment avant mercredi 22h.
        </p>
      </div>

      {saveSuccess && (
        <div style={{ background: "#E8FFF8", borderRadius: "12px", padding: "12px 16px", marginBottom: "20px" }}>
          <p style={{ fontSize: "13px", color: "#00CCCC", fontWeight: 600 }}>✓ Programmation enregistrée</p>
        </div>
      )}

      {/* Statut actif/inactif */}
      {programmationId && (
        <div style={{
          background: actif ? "#E8FFF8" : "#F5F0E8",
          border: `1px solid ${actif ? "#00CCCC" : "#E8E3D8"}`,
          borderRadius: "16px", padding: "16px 20px",
          marginBottom: "24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: actif ? "#00CCCC" : "#9B9B9B" }}>
              {actif ? "✓ Programmation active" : "Programmation désactivée"}
            </p>
            <p style={{ fontSize: "12px", color: "#6B6B6B", marginTop: "2px" }}>
              {actif
                ? `Rappel chaque jeudi pour : ${joursLabel}`
                : "Activez votre programmation pour recevoir des rappels"}
            </p>
          </div>
          <button
            onClick={handleToggleActif}
            style={{
              background: actif ? "#fff" : "#4D0F1F",
              color: actif ? "#FD3D6B" : "#fff",
              border: actif ? "1px solid #FDD5D9" : "none",
              fontSize: "12px", fontWeight: 600,
              padding: "8px 16px", borderRadius: "999px",
              cursor: "pointer", flexShrink: 0,
            }}
          >
            {actif ? "Désactiver" : "Activer"}
          </button>
        </div>
      )}

      {/* Sélection des jours */}
      <div style={{ background: "#fff", border: "1px solid #E8E3D8", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
        <p style={{ fontSize: "12px", fontWeight: 700, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
          Mes jours habituels
        </p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {JOURS.map(jour => {
            const selected = joursSelectionnes.includes(jour.key)
            return (
              <button
                key={jour.key}
                onClick={() => toggleJour(jour.key)}
                style={{
                  padding: "10px 20px", borderRadius: "999px",
                  border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 600,
                  background: selected ? "#4D0F1F" : "#F5F0E8",
                  color: selected ? "#fff" : "#6B6B6B",
                  transition: "all 0.15s ease",
                  transform: selected ? "scale(1.05)" : "scale(1)",
                }}
              >
                {jour.label}
              </button>
            )
          })}
        </div>
        {joursSelectionnes.length > 0 && (
          <p style={{ fontSize: "12px", color: "#9B9B9B", marginTop: "12px" }}>
            {joursSelectionnes.length} jour{joursSelectionnes.length > 1 ? 's' : ''} sélectionné{joursSelectionnes.length > 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Variante */}
      <div style={{ background: "#fff", border: "1px solid #E8E3D8", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
        <p style={{ fontSize: "12px", fontWeight: 700, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
          Ma variante préférée
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {VARIANTES.map(v => {
            const selected = variante === v.key
            return (
              <button
                key={v.key}
                onClick={() => setVariante(v.key)}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "14px 16px", borderRadius: "12px",
                  border: `2px solid ${selected ? "#4D0F1F" : "#E8E3D8"}`,
                  background: selected ? "#F5F0E8" : "#fff",
                  cursor: "pointer", textAlign: "left",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: "50%",
                  border: `2px solid ${selected ? "#4D0F1F" : "#E8E3D8"}`,
                  background: selected ? "#4D0F1F" : "#fff",
                  flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {selected && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
                </div>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#1A1A1A" }}>{v.label}</p>
                  <p style={{ fontSize: "12px", color: "#9B9B9B", marginTop: "2px" }}>{v.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Bouton enregistrer */}
      <button
        onClick={handleSave}
        disabled={saving || joursSelectionnes.length === 0}
        style={{
          width: "100%",
          background: joursSelectionnes.length === 0 ? "#E8E3D8" : "#4D0F1F",
          color: joursSelectionnes.length === 0 ? "#9B9B9B" : "#fff",
          fontSize: "14px", fontWeight: 600,
          padding: "16px", borderRadius: "999px",
          border: "none",
          cursor: joursSelectionnes.length === 0 ? "not-allowed" : "pointer",
        }}
      >
        {saving ? "Enregistrement..." : programmationId ? "Mettre à jour ma programmation" : "Activer ma programmation →"}
      </button>

      {joursSelectionnes.length === 0 && (
        <p style={{ fontSize: "12px", color: "#9B9B9B", textAlign: "center", marginTop: "8px" }}>
          Sélectionnez au moins un jour pour continuer
        </p>
      )}

    </div>
  )
}
