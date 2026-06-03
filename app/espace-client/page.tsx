"use client";

import { useEffect, useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase"
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
  point_livraison: string
  menus: {
    date_livraison: string
    plat: string
    plat_vege: string
    dessert: string
    photo: string
  }
}

function getDeadlineSemaineSuivante(): { jours: number; date: string } {
  const now = new Date()
  const jourSemaine = now.getDay() // 0=dim, 1=lun...
  const mercredi = new Date(now)
  const diffMercredi = (3 - jourSemaine + 7) % 7
  mercredi.setDate(now.getDate() + diffMercredi)
  mercredi.setHours(22, 0, 0, 0)
  const diff = mercredi.getTime() - now.getTime()
  const jours = Math.ceil(diff / (1000 * 60 * 60 * 24))
  const dateStr = mercredi.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  return { jours, date: dateStr }
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

function formatPrice(p: number): string {
  return p.toFixed(2).replace('.', ',') + ' €'
}

const statutConfig: Record<string, { label: string; color: string; bg: string }> = {
  en_attente: { label: 'Réservé', color: '#FF9933', bg: '#FFF9D6' },
  confirme:   { label: 'Confirmé', color: '#00CCCC', bg: '#E8FFF8' },
  annule:     { label: 'Annulé', color: '#FD3D6B', bg: '#FDD5D9' },
}

export default function EspaceClientPage() {
  const supabase = createSupabaseBrowserClient()

  const [client, setClient] = useState<any>(null)
  const [pointLivraison, setPointLivraison] = useState<any>(null)
  const [commandesSemaineCourante, setCommandesSemaineCourante] = useState<Commande[]>([])
  const [commandesSemaineSuivante, setCommandesSemaineSuivante] = useState<Commande[]>([])
  const [totalRepas, setTotalRepas] = useState(0)
  const [depensesMois, setDepensesMois] = useState(0)
  const [loading, setLoading] = useState(true)

  const deadline = getDeadlineSemaineSuivante()
  const deadlineDepassee = deadline.jours <= 0

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Charger le client + point de livraison
      const { data: clientData } = await supabase
        .from('clients')
        .select('*, points_livraison(*)')
        .eq('user_id', session.user.id)
        .single()

      if (clientData) {
        setClient(clientData)
        setPointLivraison(clientData.points_livraison)
      }

      // Dates utiles
      const today = new Date()
      const todayStr = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, '0'),
        String(today.getDate()).padStart(2, '0'),
      ].join('-')

      const lundiCourant = new Date(today)
      lundiCourant.setDate(today.getDate() - ((today.getDay() + 6) % 7))
      const lundiSuivant = new Date(lundiCourant)
      lundiSuivant.setDate(lundiCourant.getDate() + 7)
      const vendrediSuivant = new Date(lundiSuivant)
      vendrediSuivant.setDate(lundiSuivant.getDate() + 4)

      const vendrediCourantStr = new Date(lundiCourant.getTime() + 4 * 86400000).toISOString().split('T')[0]
      const lundiSuivantStr = lundiSuivant.toISOString().split('T')[0]
      const vendrediSuivantStr = vendrediSuivant.toISOString().split('T')[0]

      // Commandes semaine en cours
      const { data: cmdCourante } = await supabase
        .from('commandes')
        .select('*, menus(date_livraison, plat, plat_vege, dessert, photo)')
        .eq('client_id', clientData.id)
        .gte('menus.date_livraison', todayStr)
        .lte('menus.date_livraison', vendrediCourantStr)
        .neq('statut', 'annule')
        .order('menus(date_livraison)', { ascending: true })

      setCommandesSemaineCourante((cmdCourante ?? []).filter((c: any) => c.menus))

      // Commandes semaine suivante
      const { data: cmdSuivante } = await supabase
        .from('commandes')
        .select('*, menus(date_livraison, plat, plat_vege, dessert, photo)')
        .eq('client_id', clientData.id)
        .gte('menus.date_livraison', lundiSuivantStr)
        .lte('menus.date_livraison', vendrediSuivantStr)
        .neq('statut', 'annule')
        .order('menus(date_livraison)', { ascending: true })

      setCommandesSemaineSuivante((cmdSuivante ?? []).filter((c: any) => c.menus))

      // Total repas commandés
      const { count } = await supabase
        .from('commandes')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', clientData.id)
        .eq('statut', 'confirme')

      setTotalRepas(count ?? 0)

      // Dépenses du mois
      const debutMois = new Date(today.getFullYear(), today.getMonth(), 1).toISOString()
      const { data: cmdMois } = await supabase
        .from('commandes')
        .select('prix_total')
        .eq('client_id', clientData.id)
        .eq('statut', 'confirme')
        .gte('created_at', debutMois)

      const total = (cmdMois ?? []).reduce((acc: number, c: any) => acc + (c.prix_total ?? 0), 0)
      setDepensesMois(total)

      setLoading(false)
    }
    load()
  }, [])

  function grouperCommandes(commandes: Commande[]) {
    const map = new Map<string, Commande & { quantiteTotale: number }>()
    for (const cmd of commandes) {
      const key = `${cmd.menus.date_livraison}-${cmd.variante}`
      if (map.has(key)) {
        map.get(key)!.quantiteTotale += cmd.quantite
      } else {
        map.set(key, { ...cmd, quantiteTotale: cmd.quantite })
      }
    }
    return Array.from(map.values())
  }

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px" }}>
      <p style={{ color: "#9B9B9B" }}>Chargement...</p>
    </div>
  )

  return (
    <div style={{ padding: "40px 48px", maxWidth: "800px" }}>

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
      {!deadlineDepassee && deadline.jours <= 3 && (
        <div style={{
          background: "#FFF9D6", border: "1px solid #FF9933",
          borderRadius: "16px", padding: "16px 20px",
          marginBottom: "20px", display: "flex",
          alignItems: "center", justifyContent: "space-between", gap: "16px",
        }}>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#FF9933" }}>
              <i className="ti ti-clock" style={{ marginRight: 6 }} />
              Deadline dans {deadline.jours} jour{deadline.jours > 1 ? 's' : ''} !
            </p>
            <p style={{ fontSize: "12px", color: "#6B6B6B", marginTop: "2px" }}>
              Pré-commandez avant {deadline.date} à 22h pour la semaine suivante
            </p>
          </div>
          <Link href="/espace-client/commander" style={{
            background: "#FF9933", color: "#fff",
            fontSize: "12px", fontWeight: 600,
            padding: "8px 16px", borderRadius: "999px",
            textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
          }}>
            Commander →
          </Link>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
        <div style={{ background: "#fff", border: "1px solid #E8E3D8", borderRadius: "16px", padding: "20px" }}>
          <p style={{ fontSize: "11px", color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
            Repas commandés
          </p>
          <p style={{ fontSize: "32px", fontWeight: 600, color: "#1A1A1A", lineHeight: 1 }}>{totalRepas}</p>
          <p style={{ fontSize: "12px", color: "#9B9B9B", marginTop: "4px" }}>depuis votre inscription</p>
        </div>
        <div style={{ background: "#fff", border: "1px solid #E8E3D8", borderRadius: "16px", padding: "20px" }}>
          <p style={{ fontSize: "11px", color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
            Dépenses ce mois
          </p>
          <p style={{ fontSize: "32px", fontWeight: 600, color: "#1A1A1A", lineHeight: 1 }}>{formatPrice(depensesMois)}</p>
          <p style={{ fontSize: "12px", color: "#9B9B9B", marginTop: "4px" }}>commandes confirmées</p>
        </div>
      </div>

      {/* Commandes semaine en cours */}
      {commandesSemaineCourante.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid #E8E3D8", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
            Cette semaine
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {grouperCommandes(commandesSemaineCourante).map(cmd => {
              const statut = statutConfig[cmd.statut] ?? statutConfig.en_attente
              return (
                <div key={cmd.id} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: "10px",
                    overflow: "hidden", flexShrink: 0, position: "relative",
                    background: "#F5F0E8",
                  }}>
                    {cmd.menus.photo ? (
                      <Image
                        src={cmd.menus.photo}
                        alt={cmd.variante === 'vegetarien' ? cmd.menus.plat_vege : cmd.menus.plat}
                        fill
                        sizes="56px"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <i className="ti ti-soup" style={{ fontSize: 20, color: "#C4704F" }} />
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                      <p style={{ fontSize: "13px", fontWeight: 500, color: "#1A1A1A" }}>
                        {formatDate(cmd.menus.date_livraison)}
                      </p>
                      {cmd.quantiteTotale > 1 && (
                        <span style={{ fontSize: "11px", color: "#9B9B9B", fontWeight: 400 }}>
                          × {cmd.quantiteTotale}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: "12px", color: "#6B6B6B", marginBottom: "1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {cmd.variante === 'vegetarien' ? cmd.menus.plat_vege : cmd.menus.plat}
                    </p>
                    <p style={{ fontSize: "11px", color: "#9B9B9B" }}>+ {cmd.menus.dessert}</p>
                  </div>
                  <span style={{
                    fontSize: "11px", fontWeight: 600,
                    color: statut.color, background: statut.bg,
                    padding: "4px 10px", borderRadius: "999px", flexShrink: 0,
                  }}>
                    {statut.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Commandes semaine suivante ou CTA */}
      {commandesSemaineSuivante.length > 0 ? (
        <div style={{ background: "#fff", border: "1px solid #E8E3D8", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
            Semaine prochaine
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {grouperCommandes(commandesSemaineSuivante).map(cmd => {
              const statut = statutConfig[cmd.statut] ?? statutConfig.en_attente
              return (
                <div key={cmd.id} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: "10px",
                    overflow: "hidden", flexShrink: 0, position: "relative",
                    background: "#F5F0E8",
                  }}>
                    {cmd.menus.photo ? (
                      <Image
                        src={cmd.menus.photo}
                        alt={cmd.variante === 'vegetarien' ? cmd.menus.plat_vege : cmd.menus.plat}
                        fill
                        sizes="56px"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <i className="ti ti-soup" style={{ fontSize: 20, color: "#C4704F" }} />
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                      <p style={{ fontSize: "13px", fontWeight: 500, color: "#1A1A1A" }}>
                        {formatDate(cmd.menus.date_livraison)}
                      </p>
                      {cmd.quantiteTotale > 1 && (
                        <span style={{ fontSize: "11px", color: "#9B9B9B", fontWeight: 400 }}>
                          × {cmd.quantiteTotale}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: "12px", color: "#6B6B6B", marginBottom: "1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {cmd.variante === 'vegetarien' ? cmd.menus.plat_vege : cmd.menus.plat}
                    </p>
                    <p style={{ fontSize: "11px", color: "#9B9B9B" }}>+ {cmd.menus.dessert}</p>
                  </div>
                  <span style={{
                    fontSize: "11px", fontWeight: 600,
                    color: statut.color, background: statut.bg,
                    padding: "4px 10px", borderRadius: "999px", flexShrink: 0,
                  }}>
                    {statut.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      ) : !deadlineDepassee ? (
        <div style={{
          background: "#E8FFF8", border: "2px solid #00CCCC",
          borderRadius: "16px", padding: "24px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: "16px",
        }}>
          <div>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A1A", marginBottom: "4px" }}>
              Vous n'avez pas encore commandé la semaine prochaine
            </p>
            <p style={{ fontSize: "12px", color: "#6B6B6B" }}>
              Deadline : {deadline.date} à 22h · Tarifs préférentiels
            </p>
          </div>
          <Link href="/espace-client/commander" style={{
            background: "#00CCCC", color: "#fff",
            fontSize: "13px", fontWeight: 600,
            padding: "12px 20px", borderRadius: "999px",
            textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
          }}>
            Pré-commander →
          </Link>
        </div>
      ) : null}

    </div>
  )
}
