"use client";

import { useEffect, useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase"
import { getSemainesDisponibles } from "@/lib/menus"
import Image from "next/image"
import Link from "next/link"

interface Commande {
  id: string
  variante: string
  quantite: number
  prix_unitaire: number
  statut: string
  menus: {
    date_livraison: string
    plat: string
    plat_vege: string
    dessert: string
    photo: string
  }
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

function formatPrice(p: number): string {
  return p.toFixed(2).replace('.', ',') + ' €'
}

function getSemaineLabel(dateStr: string): string {
  const d = new Date(dateStr)
  const jourSemaine = d.getDay()
  const lundi = new Date(d)
  lundi.setDate(d.getDate() - (jourSemaine === 0 ? 6 : jourSemaine - 1))
  const vendredi = new Date(lundi)
  vendredi.setDate(lundi.getDate() + 4)
  return `Semaine du ${lundi.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} au ${vendredi.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`
}

const statutConfig: Record<string, { label: string; color: string; bg: string }> = {
  en_attente: { label: 'Réservé', color: '#FF9933', bg: '#FFF9D6' },
  confirme:   { label: 'Confirmé', color: '#00CCCC', bg: '#E8FFF8' },
  annule:     { label: 'Annulé', color: '#FD3D6B', bg: '#FDD5D9' },
}

export default function CommandesEnCoursPage() {
  const supabase = createSupabaseBrowserClient()

  const [client, setClient] = useState<any>(null)
  const [commandes, setCommandes] = useState<Commande[]>([])
  const [loading, setLoading] = useState(true)
  const [modifyingId, setModifyingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const { deadlinePrecommande, semaineSuivante } = getSemainesDisponibles()
  const peutModifier = new Date() < deadlinePrecommande
  const deadlineLabel = deadlinePrecommande.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

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

      const today = new Date().toISOString().split('T')[0]

      const { data } = await supabase
        .from('commandes')
        .select('*, menus(date_livraison, plat, plat_vege, dessert, photo)')
        .eq('client_id', clientData.id)
        .neq('statut', 'annule')
        .gte('menus.date_livraison', today)
        .order('menus(date_livraison)', { ascending: true })

      setCommandes((data ?? []).filter((c: any) => c.menus))
      setLoading(false)
    }
    load()
  }, [])

  async function handleModifierVariante(cmd: Commande, nouvelleVariante: string) {
    if (nouvelleVariante === cmd.variante) { setModifyingId(null); return }
    setSaving(true)
    await supabase
      .from('commandes')
      .update({ variante: nouvelleVariante })
      .eq('id', cmd.id)

    setCommandes(prev =>
      prev.map(c => c.id === cmd.id ? { ...c, variante: nouvelleVariante } : c)
    )
    setSaving(false)
    setModifyingId(null)
  }

  function CommandeRow({ cmd, modifiable }: { cmd: Commande; modifiable: boolean }) {
    const statut = statutConfig[cmd.statut] ?? statutConfig.en_attente
    const plat = cmd.variante === 'vegetarien' ? cmd.menus.plat_vege : cmd.menus.plat
    const isModifying = modifyingId === cmd.id

    return (
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 0", borderBottom: "1px solid #F0EDE6" }}>

        {/* Photo */}
        <div style={{
          width: 52, height: 52, borderRadius: "10px",
          overflow: "hidden", flexShrink: 0, position: "relative",
          background: "#F5F0E8",
        }}>
          {cmd.menus.photo ? (
            <Image src={cmd.menus.photo} alt={plat} fill sizes="52px" style={{ objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className="ti ti-soup" style={{ fontSize: 20, color: "#C4704F" }} />
            </div>
          )}
        </div>

        {/* Infos */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: "13px", fontWeight: 500, color: "#1A1A1A", marginBottom: "2px" }}>
            {formatDate(cmd.menus.date_livraison)}
          </p>

          {isModifying ? (
            <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
              <button
                onClick={() => handleModifierVariante(cmd, 'standard')}
                disabled={saving}
                style={{
                  fontSize: "11px", fontWeight: 600, padding: "5px 12px",
                  borderRadius: "999px", border: "none", cursor: "pointer",
                  background: cmd.variante === 'standard' ? "#4D0F1F" : "#F5F0E8",
                  color: cmd.variante === 'standard' ? "#fff" : "#1A1A1A",
                }}
              >
                Plat standard
              </button>
              <button
                onClick={() => handleModifierVariante(cmd, 'vegetarien')}
                disabled={saving}
                style={{
                  fontSize: "11px", fontWeight: 600, padding: "5px 12px",
                  borderRadius: "999px", border: "none", cursor: "pointer",
                  background: cmd.variante === 'vegetarien' ? "#4D0F1F" : "#F5F0E8",
                  color: cmd.variante === 'vegetarien' ? "#fff" : "#1A1A1A",
                }}
              >
                Végétarien
              </button>
              <button
                onClick={() => setModifyingId(null)}
                style={{
                  fontSize: "11px", padding: "5px 10px",
                  borderRadius: "999px", border: "1px solid #E8E3D8",
                  background: "transparent", color: "#9B9B9B", cursor: "pointer",
                }}
              >
                Annuler
              </button>
            </div>
          ) : (
            <p style={{ fontSize: "12px", color: "#6B6B6B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {plat} · + {cmd.menus.dessert}
            </p>
          )}
        </div>

        {/* Prix + statut + modifier */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", flexShrink: 0 }}>
          <span style={{
            fontSize: "11px", fontWeight: 600,
            color: statut.color, background: statut.bg,
            padding: "3px 10px", borderRadius: "999px",
          }}>
            {statut.label}
          </span>
          <p style={{ fontSize: "12px", color: "#9B9B9B" }}>{formatPrice(cmd.prix_unitaire)}</p>
          {modifiable && !isModifying && (
            <button
              onClick={() => setModifyingId(cmd.id)}
              style={{
                fontSize: "11px", color: "#007FFF", fontWeight: 600,
                background: "none", border: "none", cursor: "pointer", padding: 0,
              }}
            >
              Modifier →
            </button>
          )}
        </div>

      </div>
    )
  }

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px" }}>
      <p style={{ color: "#9B9B9B" }}>Chargement...</p>
    </div>
  )

  const commandesParSemaine = commandes.reduce((acc: Record<string, Commande[]>, cmd) => {
    const label = getSemaineLabel(cmd.menus.date_livraison)
    if (!acc[label]) acc[label] = []
    acc[label].push(cmd)
    return acc
  }, {})

  return (
    <div style={{ padding: "40px 48px", maxWidth: "800px", margin: "0 auto" }}>

      <h1 style={{ fontSize: "28px", fontWeight: 600, color: "#1A1A1A", letterSpacing: "-0.02em", marginBottom: "32px" }}>
        Commandes en cours
      </h1>

      {commandes.length === 0 ? (
        <div style={{
          background: "#fff", border: "1px solid #E8E3D8",
          borderRadius: "16px", padding: "40px", textAlign: "center",
        }}>
          <p style={{ fontSize: "15px", color: "#9B9B9B", marginBottom: "16px" }}>
            Vous n'avez aucune commande en cours.
          </p>
          <Link href="/espace-client/programmation" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "#4D0F1F", color: "#fff",
            fontSize: "14px", fontWeight: 600,
            padding: "12px 24px", borderRadius: "999px",
            textDecoration: "none",
          }}>
            Commander →
          </Link>
        </div>
      ) : (
        <div>
          {peutModifier && (
            <p style={{ fontSize: "12px", color: "#00CCCC", marginBottom: "16px" }}>
              Pré-commandes modifiables jusqu'au {deadlineLabel} à 23h59
            </p>
          )}
          {Object.entries(commandesParSemaine).map(([semaine, cmds]) => (
            <div key={semaine} style={{ background: "#fff", border: "1px solid #E8E3D8", borderRadius: "16px", padding: "20px 24px", marginBottom: "16px" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
                {semaine}
              </p>
              <div>
                {cmds.map(cmd => (
                  <CommandeRow
                    key={cmd.id}
                    cmd={cmd}
                    modifiable={peutModifier && cmd.menus.date_livraison >= semaineSuivante.lundi && cmd.menus.date_livraison <= semaineSuivante.vendredi}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
