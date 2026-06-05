"use client";

import { useEffect, useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase"
import { getSemainesDisponibles } from "@/lib/menus"
import Link from "next/link"
import Image from "next/image"

interface Commande {
  id: string
  menu_id: string
  variante: string
  quantite: number
  prix_unitaire: number
  prix_total: number
  statut: string
  type: string
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
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

function formatPrice(p: number): string {
  return p.toFixed(2).replace('.', ',') + ' €'
}

const joursOrdre = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi']
const variantesLabels: Record<string, string> = {
  standard: 'Plat standard',
  vegetarien: 'Végétarien',
  alternance: 'En alternance',
}

function StarRating({ commandeId, initialNote, clientId, onRated }: {
  commandeId: string
  initialNote: number | null
  clientId: string
  onRated: (commandeId: string, note: number) => void
}) {
  const supabase = createSupabaseBrowserClient()
  const [hovered, setHovered] = useState(0)
  const [note, setNote] = useState(initialNote ?? 0)
  const [saving, setSaving] = useState(false)

  async function handleRate(n: number) {
    setSaving(true)
    await supabase.from('ratings').upsert({
      commande_id: commandeId,
      client_id: clientId,
      note: n,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'commande_id,client_id' })
    setNote(n)
    onRated(commandeId, n)
    setSaving(false)
  }

  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          disabled={saving}
          onClick={() => handleRate(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          style={{
            background: "none", border: "none", cursor: saving ? "not-allowed" : "pointer",
            padding: "2px", fontSize: "18px", lineHeight: 1,
            color: star <= (hovered || note) ? "#EAFF33" : "rgba(255,255,255,0.4)",
            transition: "color 0.1s ease",
            filter: star <= (hovered || note) ? "drop-shadow(0 0 3px rgba(234,255,51,0.6))" : "none",
          }}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default function EspaceClientPage() {
  const supabase = createSupabaseBrowserClient()

  const [client, setClient] = useState<any>(null)
  const [pointLivraison, setPointLivraison] = useState<any>(null)
  const [derniersPlatsCmdIds, setDerniersPlatsCmdIds] = useState<Commande[]>([])
  const [ratings, setRatings] = useState<Rating[]>([])
  const [totalRepas, setTotalRepas] = useState(0)
  const [depensesMois, setDepensesMois] = useState(0)
  const [nbCommandesEnCours, setNbCommandesEnCours] = useState(0)
  const [programmation, setProgrammation] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const { deadlinePrecommande } = getSemainesDisponibles()
  const now = new Date()
  const diff = deadlinePrecommande.getTime() - now.getTime()
  const joursRestants = Math.ceil(diff / (1000 * 60 * 60 * 24))
  const deadlineDepassee = diff <= 0
  const deadlineLabel = deadlinePrecommande.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data: clientData } = await supabase
        .from('clients')
        .select('*, points_livraison(*)')
        .eq('user_id', session.user.id)
        .single()

      if (!clientData) return
      setClient(clientData)
      setPointLivraison(clientData.points_livraison)

      const today = new Date()
      const todayStr = today.toISOString().split('T')[0]
      const debutMois = new Date(today.getFullYear(), today.getMonth(), 1).toISOString()

      // 5 derniers plats confirmés
      const { data: derniersPlats } = await supabase
        .from('commandes')
        .select('*, menus(date_livraison, plat, plat_vege, dessert, photo)')
        .eq('client_id', clientData.id)
        .eq('statut', 'confirme')
        .lt('menus.date_livraison', todayStr)
        .order('created_at', { ascending: false })
        .limit(5)

      setDerniersPlatsCmdIds((derniersPlats ?? []).filter((c: any) => c.menus))

      // Total repas
      const { count } = await supabase
        .from('commandes')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', clientData.id)
        .eq('statut', 'confirme')

      setTotalRepas(count ?? 0)

      // Dépenses du mois
      const { data: cmdMois } = await supabase
        .from('commandes')
        .select('prix_total')
        .eq('client_id', clientData.id)
        .eq('statut', 'confirme')
        .gte('created_at', debutMois)

      const total = (cmdMois ?? []).reduce((acc: number, c: any) => acc + (c.prix_total ?? 0), 0)
      setDepensesMois(total)

      // Commandes en cours (count)
      const { count: nbEnCours } = await supabase
        .from('commandes')
        .select('id, menus(date_livraison)', { count: 'exact' })
        .eq('client_id', clientData.id)
        .neq('statut', 'annule')
        .gte('menus.date_livraison', todayStr)

      setNbCommandesEnCours(nbEnCours ?? 0)

      // Programmation
      const { data: progData } = await supabase
        .from('programmations')
        .select('*')
        .eq('client_id', clientData.id)
        .single()

      setProgrammation(progData ?? null)

      // Ratings existants
      const { data: ratingsData } = await supabase
        .from('ratings')
        .select('commande_id, note')
        .eq('client_id', clientData.id)

      setRatings(ratingsData ?? [])

      setLoading(false)
    }
    load()
  }, [])

  function getRating(commandeId: string): number | null {
    return ratings.find(r => r.commande_id === commandeId)?.note ?? null
  }

  function handleRated(commandeId: string, note: number) {
    setRatings(prev => {
      const existing = prev.find(r => r.commande_id === commandeId)
      if (existing) return prev.map(r => r.commande_id === commandeId ? { ...r, note } : r)
      return [...prev, { commande_id: commandeId, note }]
    })
  }

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px" }}>
      <p style={{ color: "#9B9B9B" }}>Chargement...</p>
    </div>
  )

  const joursLabel = programmation
    ? (programmation.jours ?? [])
        .sort((a: string, b: string) => joursOrdre.indexOf(a) - joursOrdre.indexOf(b))
        .map((j: string) => j.charAt(0).toUpperCase() + j.slice(1))
        .join(', ')
    : ''

  return (
    <div style={{ padding: "40px 48px", maxWidth: "900px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 600, color: "#1A1A1A", marginBottom: "6px" }}>
          Bonjour {client?.prenom} 👋
        </h1>
        {pointLivraison && (
          <p style={{ fontSize: "14px", color: "#9B9B9B" }}>
            <i className="ti ti-map-pin" style={{ fontSize: 14, marginRight: 4 }} />
            {pointLivraison.hopital} · {pointLivraison.service}
          </p>
        )}
      </div>

      {/* Alerte deadline */}
      {!deadlineDepassee && joursRestants <= 3 && (
        <div style={{
          background: "#FFF9D6", border: "1px solid #FF9933",
          borderRadius: "16px", padding: "16px 20px",
          marginBottom: "24px", display: "flex",
          alignItems: "center", justifyContent: "space-between", gap: "16px",
        }}>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#FF9933" }}>
              <i className="ti ti-clock" style={{ marginRight: 6 }} />
              Deadline dans {joursRestants} jour{joursRestants > 1 ? 's' : ''} !
            </p>
            <p style={{ fontSize: "12px", color: "#6B6B6B", marginTop: "2px" }}>
              Pré-commandez avant {deadlineLabel} à 23h59 pour la {getSemainesDisponibles().semaineSuivante.label}
            </p>
          </div>
          <Link href="/espace-client/programmation" style={{
            background: "#FF9933", color: "#fff",
            fontSize: "12px", fontWeight: 600,
            padding: "8px 16px", borderRadius: "999px",
            textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
          }}>
            Commander →
          </Link>
        </div>
      )}

      {/* ── SECTION 1 — KPI 3 colonnes ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "40px" }}>
        <Link href="/espace-client/commandes" style={{ textDecoration: "none" }}>
          <div style={{ background: "#fff", border: "1px solid #E8E3D8", borderRadius: "16px", padding: "20px", cursor: "pointer", height: "100%" }}>
            <p style={{ fontSize: "11px", color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
              Commandes en cours
            </p>
            <p style={{ fontSize: "32px", fontWeight: 600, color: "#1A1A1A", lineHeight: 1 }}>{nbCommandesEnCours}</p>
            <p style={{ fontSize: "12px", color: "#00CCCC", marginTop: "4px" }}>Voir le détail →</p>
          </div>
        </Link>
        <div style={{ background: "#fff", border: "1px solid #E8E3D8", borderRadius: "16px", padding: "20px" }}>
          <p style={{ fontSize: "11px", color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
            Dépenses ce mois
          </p>
          <p style={{ fontSize: "32px", fontWeight: 600, color: "#1A1A1A", lineHeight: 1 }}>{formatPrice(depensesMois)}</p>
          <p style={{ fontSize: "12px", color: "#9B9B9B", marginTop: "4px" }}>commandes confirmées</p>
        </div>
        <div style={{ background: "#fff", border: "1px solid #E8E3D8", borderRadius: "16px", padding: "20px" }}>
          <p style={{ fontSize: "11px", color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
            Total repas
          </p>
          <p style={{ fontSize: "32px", fontWeight: 600, color: "#1A1A1A", lineHeight: 1 }}>{totalRepas}</p>
          <p style={{ fontSize: "12px", color: "#9B9B9B", marginTop: "4px" }}>depuis votre inscription</p>
        </div>
      </div>

      {/* ── SECTION 2 — 5 DERNIERS PLATS ── */}
      {derniersPlatsCmdIds.length > 0 && (
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "#1A1A1A", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Mes derniers plats
            </p>
            <Link href="/espace-client/historique" style={{ fontSize: "12px", color: "#00CCCC", fontWeight: 600, textDecoration: "none" }}>
              Afficher le détail →
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" }}>
            {derniersPlatsCmdIds.map(cmd => {
              const plat = cmd.variante === 'vegetarien' ? cmd.menus.plat_vege : cmd.menus.plat
              const rating = getRating(cmd.id)
              return (
                <div key={cmd.id} style={{ position: "relative", borderRadius: "14px", overflow: "hidden", aspectRatio: "3/4" }}>
                  <Image
                    src={cmd.menus.photo || '/images/plats-clodia.jpg'}
                    alt={plat}
                    fill
                    sizes="(max-width: 900px) 50vw, 20vw"
                    style={{ objectFit: "cover" }}
                  />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)",
                  }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px" }}>
                    <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.7)", marginBottom: "3px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {formatDate(cmd.menus.date_livraison)}
                    </p>
                    <p style={{ fontSize: "11px", color: "#fff", fontWeight: 600, lineHeight: 1.3, marginBottom: "6px" }}>
                      {plat}
                    </p>
                    <StarRating
                      commandeId={cmd.id}
                      initialNote={rating}
                      clientId={client.id}
                      onRated={handleRated}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── SECTION 3 — MA PROGRAMMATION ── */}
      <div>
        <p style={{ fontSize: "13px", fontWeight: 700, color: "#1A1A1A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
          Ma programmation
        </p>
        {programmation && programmation.actif ? (
          <div style={{
            background: "#E8FFF8", border: "1px solid #00CCCC",
            borderRadius: "16px", padding: "20px 24px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px",
          }}>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#00CCCC", marginBottom: "4px" }}>
                ✓ Programmation active
              </p>
              <p style={{ fontSize: "12px", color: "#6B6B6B" }}>
                {joursLabel} · {variantesLabels[programmation.variante] ?? programmation.variante}
              </p>
            </div>
            <Link href="/espace-client/programmation" style={{
              background: "#fff", color: "#00CCCC",
              border: "1px solid #00CCCC",
              fontSize: "12px", fontWeight: 600,
              padding: "8px 16px", borderRadius: "999px",
              textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
            }}>
              Modifier →
            </Link>
          </div>
        ) : (
          <div style={{
            background: "#fff", border: "1px solid #E8E3D8",
            borderRadius: "16px", padding: "24px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px",
          }}>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#1A1A1A", marginBottom: "4px" }}>
                Automatisez vos commandes
              </p>
              <p style={{ fontSize: "12px", color: "#6B6B6B" }}>
                Définissez votre rythme et recevez un rappel chaque semaine
              </p>
            </div>
            <Link href="/espace-client/programmation" style={{
              background: "#4D0F1F", color: "#fff",
              fontSize: "12px", fontWeight: 600,
              padding: "8px 16px", borderRadius: "999px",
              textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
            }}>
              Configurer →
            </Link>
          </div>
        )}
      </div>

    </div>
  )
}
