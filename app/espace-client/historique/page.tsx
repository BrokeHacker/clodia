"use client";

import { useEffect, useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase"
import Image from "next/image"

interface Commande {
  id: string
  variante: string
  quantite: number
  prix_unitaire: number
  prix_total: number
  statut: string
  created_at: string
  menus: {
    date_livraison: string
    plat: string
    plat_vege: string
    dessert: string
    photo: string
  }
}

interface Rating {
  commande_id: string
  note: number
  updated_at: string
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

function formatPrice(p: number): string {
  return p.toFixed(2).replace('.', ',') + ' €'
}

function peutNoter(datelivraison: string): boolean {
  const livraison = new Date(datelivraison)
  const now = new Date()
  const diff = now.getTime() - livraison.getTime()
  return diff >= 0 && diff <= 7 * 24 * 60 * 60 * 1000
}

function peutModifierNote(updatedAt: string): boolean {
  const updated = new Date(updatedAt)
  const now = new Date()
  return now.getTime() - updated.getTime() <= 24 * 60 * 60 * 1000
}

const statutConfig: Record<string, { label: string; color: string; bg: string }> = {
  en_attente: { label: 'Réservé', color: '#FF9933', bg: '#FFF9D6' },
  confirme:   { label: 'Confirmé', color: '#00CCCC', bg: '#E8FFF8' },
  annule:     { label: 'Annulé', color: '#FD3D6B', bg: '#FDD5D9' },
}

function StarRating({ commandeId, initialNote, initialUpdatedAt, clientId, onRated }: {
  commandeId: string
  initialNote: number | null
  initialUpdatedAt: string | null
  clientId: string
  onRated: (commandeId: string, note: number, updatedAt: string) => void
}) {
  const supabase = createSupabaseBrowserClient()
  const [hovered, setHovered] = useState(0)
  const [note, setNote] = useState(initialNote ?? 0)
  const [updatedAt, setUpdatedAt] = useState(initialUpdatedAt)
  const [saving, setSaving] = useState(false)

  const modifiable = !note || (updatedAt ? peutModifierNote(updatedAt) : true)

  async function handleRate(n: number) {
    if (!modifiable) return
    setSaving(true)
    const now = new Date().toISOString()
    await supabase.from('ratings').upsert({
      commande_id: commandeId,
      client_id: clientId,
      note: n,
      updated_at: now,
    }, { onConflict: 'commande_id,client_id' })
    setNote(n)
    setUpdatedAt(now)
    onRated(commandeId, n, now)
    setSaving(false)
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <div style={{ display: "flex", gap: "2px" }}>
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            disabled={saving || !modifiable}
            onClick={() => handleRate(star)}
            onMouseEnter={() => modifiable && setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            style={{
              background: "none", border: "none",
              cursor: modifiable ? "pointer" : "default",
              padding: "2px", fontSize: "16px", lineHeight: 1,
              color: star <= (hovered || note) ? "#FF9933" : "#E8E3D8",
              transition: "color 0.1s ease",
            }}
          >
            ★
          </button>
        ))}
      </div>
      {note > 0 && !modifiable && (
        <span style={{ fontSize: "10px", color: "#9B9B9B", fontStyle: "italic" }}>
          Non modifiable
        </span>
      )}
    </div>
  )
}

const PAGE_SIZE = 10

export default function HistoriquePage() {
  const supabase = createSupabaseBrowserClient()

  const [client, setClient] = useState<any>(null)
  const [commandes, setCommandes] = useState<Commande[]>([])
  const [ratings, setRatings] = useState<Rating[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [moisFiltre, setMoisFiltre] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  const today = new Date().toISOString().split('T')[0]

  const moisDisponibles = Array.from({ length: 12 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    return { val, label }
  })

  useEffect(() => {
    async function loadClient() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const { data } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', session.user.id)
        .single()
      if (data) setClient(data)
    }
    loadClient()
  }, [])

  useEffect(() => {
    if (!client) return
    loadCommandes()
  }, [client, moisFiltre, page])

  async function loadCommandes() {
    setLoading(true)

    const [annee, mois] = moisFiltre.split('-')
    const debutMois = `${annee}-${mois}-01`
    const finMois = new Date(parseInt(annee), parseInt(mois), 0).toISOString().split('T')[0]

    const from = page * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const { data, count } = await supabase
      .from('commandes')
      .select('*, menus(date_livraison, plat, plat_vege, dessert, photo)', { count: 'exact' })
      .eq('client_id', client.id)
      .lt('menus.date_livraison', today)
      .gte('menus.date_livraison', debutMois)
      .lte('menus.date_livraison', finMois)
      .order('created_at', { ascending: false })
      .range(from, to)

    setCommandes((data ?? []).filter((c: any) => c.menus))
    setTotal(count ?? 0)

    const ids = (data ?? []).map((c: any) => c.id)
    if (ids.length > 0) {
      const { data: ratingsData } = await supabase
        .from('ratings')
        .select('commande_id, note, updated_at')
        .eq('client_id', client.id)
        .in('commande_id', ids)
      setRatings(ratingsData ?? [])
    }

    setLoading(false)
  }

  function getRating(commandeId: string): Rating | null {
    return ratings.find(r => r.commande_id === commandeId) ?? null
  }

  function handleRated(commandeId: string, note: number, updatedAt: string) {
    setRatings(prev => {
      const existing = prev.find(r => r.commande_id === commandeId)
      if (existing) return prev.map(r => r.commande_id === commandeId ? { ...r, note, updated_at: updatedAt } : r)
      return [...prev, { commande_id: commandeId, note, updated_at: updatedAt }]
    })
  }

  const commandesGroupees = commandes.reduce((acc: Record<string, Commande[]>, cmd) => {
    const date = cmd.menus.date_livraison
    if (!acc[date]) acc[date] = []
    acc[date].push(cmd)
    return acc
  }, {})

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const totalMois = commandes
    .filter(c => c.statut === 'confirme')
    .reduce((acc, c) => acc + (c.prix_total ?? 0), 0)

  return (
    <div style={{ padding: "40px 48px", maxWidth: "800px" }}>

      <h1 style={{ fontSize: "28px", fontWeight: 600, color: "#1A1A1A", letterSpacing: "-0.02em", marginBottom: "24px" }}>
        Historique des commandes
      </h1>

      {/* Filtre mois + stats */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <select
          value={moisFiltre}
          onChange={e => { setMoisFiltre(e.target.value); setPage(0) }}
          style={{
            border: "1px solid #E8E3D8", borderRadius: "12px",
            padding: "10px 16px", fontSize: "14px", color: "#1A1A1A",
            background: "#fff", cursor: "pointer", outline: "none",
          }}
        >
          {moisDisponibles.map(m => (
            <option key={m.val} value={m.val}>{m.label}</option>
          ))}
        </select>

        {!loading && (
          <div style={{ display: "flex", gap: "16px" }}>
            <span style={{ fontSize: "13px", color: "#6B6B6B" }}>
              <strong style={{ color: "#1A1A1A" }}>{total}</strong> commande{total > 1 ? 's' : ''}
            </span>
            <span style={{ fontSize: "13px", color: "#6B6B6B" }}>
              <strong style={{ color: "#1A1A1A" }}>{formatPrice(totalMois)}</strong> dépensés
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px" }}>
          <p style={{ color: "#9B9B9B" }}>Chargement...</p>
        </div>
      ) : commandes.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid #E8E3D8", borderRadius: "16px", padding: "40px", textAlign: "center" }}>
          <p style={{ fontSize: "15px", color: "#9B9B9B" }}>Aucune commande ce mois-ci.</p>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {Object.entries(commandesGroupees)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([date, cmds]) => (
                <div key={date} style={{ background: "#fff", border: "1px solid #E8E3D8", borderRadius: "16px", overflow: "hidden" }}>
                  <div style={{ padding: "12px 20px", borderBottom: "1px solid #F0EDE6", background: "#FAFAF8" }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A1A" }}>
                      {formatDate(date)}
                    </p>
                  </div>

                  <div style={{ padding: "0 20px" }}>
                    {cmds.map((cmd, i) => {
                      const plat = cmd.variante === 'vegetarien' ? cmd.menus.plat_vege : cmd.menus.plat
                      const statut = statutConfig[cmd.statut] ?? statutConfig.en_attente
                      const rating = getRating(cmd.id)
                      const afficherNotation = cmd.statut === 'confirme' && peutNoter(cmd.menus.date_livraison)

                      return (
                        <div key={cmd.id} style={{
                          display: "flex", alignItems: "center", gap: "12px",
                          padding: "14px 0",
                          borderBottom: i < cmds.length - 1 ? "1px solid #F0EDE6" : "none",
                        }}>
                          <div style={{
                            width: 48, height: 48, borderRadius: "10px",
                            overflow: "hidden", flexShrink: 0, position: "relative",
                            background: "#F5F0E8",
                          }}>
                            {cmd.menus.photo ? (
                              <Image src={cmd.menus.photo} alt={plat} fill sizes="48px" style={{ objectFit: "cover" }} />
                            ) : (
                              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <i className="ti ti-soup" style={{ fontSize: 18, color: "#C4704F" }} />
                              </div>
                            )}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: "13px", fontWeight: 500, color: "#1A1A1A", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {plat}
                            </p>
                            <p style={{ fontSize: "11px", color: "#9B9B9B", marginBottom: "4px" }}>
                              + {cmd.menus.dessert} · {cmd.variante === 'vegetarien' ? 'Végétarien' : 'Standard'} × {cmd.quantite}
                            </p>
                            {afficherNotation && (
                              <StarRating
                                commandeId={cmd.id}
                                initialNote={rating?.note ?? null}
                                initialUpdatedAt={rating?.updated_at ?? null}
                                clientId={client.id}
                                onRated={handleRated}
                              />
                            )}
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", flexShrink: 0 }}>
                            <span style={{
                              fontSize: "11px", fontWeight: 600,
                              color: statut.color, background: statut.bg,
                              padding: "3px 10px", borderRadius: "999px",
                            }}>
                              {statut.label}
                            </span>
                            <p style={{ fontSize: "12px", color: "#9B9B9B" }}>{formatPrice(cmd.prix_total)}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
          </div>

          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", marginTop: "24px" }}>
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                style={{
                  padding: "8px 16px", borderRadius: "999px",
                  border: "1px solid #E8E3D8", background: "#fff",
                  fontSize: "13px", color: page === 0 ? "#9B9B9B" : "#1A1A1A",
                  cursor: page === 0 ? "not-allowed" : "pointer",
                }}
              >
                ← Précédent
              </button>
              <span style={{ fontSize: "13px", color: "#9B9B9B" }}>
                Page {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                style={{
                  padding: "8px 16px", borderRadius: "999px",
                  border: "1px solid #E8E3D8", background: "#fff",
                  fontSize: "13px", color: page >= totalPages - 1 ? "#9B9B9B" : "#1A1A1A",
                  cursor: page >= totalPages - 1 ? "not-allowed" : "pointer",
                }}
              >
                Suivant →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
