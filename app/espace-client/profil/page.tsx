"use client";

import { useEffect, useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase"
import { fetchPointsLivraison, PointLivraisonDB } from "@/lib/menus"
import { useRouter } from "next/navigation"

export default function ProfilPage() {
  const supabase = createSupabaseBrowserClient()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [client, setClient] = useState<any>(null)
  const [points, setPoints] = useState<PointLivraisonDB[]>([])
  const [hopital, setHopital] = useState("")
  const [batiment, setBatiment] = useState("")
  const [service, setService] = useState("")
  const [pointSelectionne, setPointSelectionne] = useState<PointLivraisonDB | null>(null)
  const [editPoint, setEditPoint] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data: clientData } = await supabase
        .from('clients')
        .select('*, points_livraison(*)')
        .eq('user_id', session.user.id)
        .single()

      if (clientData) {
        setClient(clientData)
        if (clientData.points_livraison) {
          setHopital(clientData.points_livraison.hopital ?? '')
          setBatiment(clientData.points_livraison.batiment ?? '')
          setService(clientData.points_livraison.service ?? '')
          setPointSelectionne(clientData.points_livraison)
        }
      }

      fetchPointsLivraison().then(setPoints)
      setLoading(false)
    }
    load()
  }, [])

  const hopitaux = [...new Set(points.map(p => p.hopital))]
  function getBatiments(h: string) { return [...new Set(points.filter(p => p.hopital === h).map(p => p.batiment))] }
  function getServices(h: string, b: string) { return points.filter(p => p.hopital === h && p.batiment === b) }

  function handleHopitalChange(val: string) { setHopital(val); setBatiment(""); setService(""); setPointSelectionne(null) }
  function handleBatimentChange(val: string) { setBatiment(val); setService(""); setPointSelectionne(null) }
  function handleServiceChange(val: string) {
    setService(val)
    const found = points.find(p => p.hopital === hopital && p.batiment === batiment && p.service === val)
    setPointSelectionne(found ?? null)
  }

  async function savePoint() {
    if (!pointSelectionne) return
    setSaving(true)
    await supabase
      .from('clients')
      .update({ point_livraison: pointSelectionne.id })
      .eq('id', client.id)
    setSaving(false)
    setSaveSuccess(true)
    setEditPoint(false)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  async function handleSupprimerCompte() {
    if (deleteConfirmText !== 'SUPPRIMER') return
    await supabase.from('clients').update({ user_id: null }).eq('id', client.id)
    await supabase.auth.signOut()
    router.push('/')
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#FD3D6B] bg-white"

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAFAF8" }}>
      <p style={{ color: "#9B9B9B" }}>Chargement...</p>
    </div>
  )

  return (
    <div style={{ background: "#FAFAF8", minHeight: "100vh" }}>
      <section style={{ maxWidth: "680px", margin: "0 auto", padding: "64px 24px" }}>

        <h1 style={{ fontSize: "28px", fontWeight: 600, color: "#1A1A1A", letterSpacing: "-0.02em", marginBottom: "32px" }}>
          Mon profil
        </h1>

        {saveSuccess && (
          <div style={{ background: "#E8FFF8", borderRadius: "12px", padding: "12px 16px", marginBottom: "20px" }}>
            <p style={{ fontSize: "13px", color: "#00CCCC", fontWeight: 600 }}>✓ Point de livraison mis à jour</p>
          </div>
        )}

        {/* Infos personnelles — lecture seule */}
        <div style={{ background: "#fff", border: "1px solid #E8E3D8", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
            Informations personnelles
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <p style={{ fontSize: "11px", color: "#9B9B9B", marginBottom: "4px" }}>Prénom</p>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "#1A1A1A" }}>{client?.prenom}</p>
            </div>
            <div>
              <p style={{ fontSize: "11px", color: "#9B9B9B", marginBottom: "4px" }}>Nom</p>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "#1A1A1A" }}>{client?.nom}</p>
            </div>
          </div>
          <div style={{ marginBottom: "16px" }}>
            <p style={{ fontSize: "11px", color: "#9B9B9B", marginBottom: "4px" }}>Email</p>
            <p style={{ fontSize: "14px", fontWeight: 500, color: "#1A1A1A" }}>{client?.email}</p>
          </div>
          <div>
            <p style={{ fontSize: "11px", color: "#9B9B9B", marginBottom: "4px" }}>Téléphone</p>
            <p style={{ fontSize: "14px", fontWeight: 500, color: "#1A1A1A" }}>{client?.telephone}</p>
          </div>
          <p style={{ fontSize: "11px", color: "#9B9B9B", marginTop: "16px", fontStyle: "italic" }}>
            Pour modifier ces informations, contactez-nous à contact@clodia.fr
          </p>
        </div>

        {/* Point de livraison */}
        <div style={{ background: "#fff", border: "1px solid #E8E3D8", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Mon frigidaire
            </p>
            {!editPoint && (
              <button onClick={() => setEditPoint(true)} style={{ fontSize: "12px", color: "#007FFF", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                Modifier
              </button>
            )}
          </div>

          {!editPoint ? (
            pointSelectionne ? (
              <div>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#1A1A1A" }}>{pointSelectionne.hopital}</p>
                <p style={{ fontSize: "13px", color: "#6B6B6B", marginTop: "2px" }}>{pointSelectionne.batiment} — {pointSelectionne.service}</p>
                <p style={{ fontSize: "12px", color: "#00CCCC", marginTop: "4px" }}>{pointSelectionne.service_desc}</p>
              </div>
            ) : (
              <p style={{ fontSize: "13px", color: "#9B9B9B" }}>Aucun point de livraison défini</p>
            )
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <select value={hopital} onChange={e => handleHopitalChange(e.target.value)} className={inputClass}>
                <option value="">Choisissez votre hôpital</option>
                {hopitaux.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
              <select value={batiment} onChange={e => handleBatimentChange(e.target.value)} disabled={!hopital} className={inputClass} style={{ opacity: !hopital ? 0.4 : 1 }}>
                <option value="">Choisissez votre bâtiment</option>
                {getBatiments(hopital).map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <select value={service} onChange={e => handleServiceChange(e.target.value)} disabled={!batiment} className={inputClass} style={{ opacity: !batiment ? 0.4 : 1 }}>
                <option value="">Choisissez votre service</option>
                {getServices(hopital, batiment).map(p => <option key={p.service} value={p.service}>{p.service}</option>)}
              </select>
              {pointSelectionne && (
                <p style={{ fontSize: "12px", color: "#00CCCC" }}>{pointSelectionne.service_desc}</p>
              )}
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <button onClick={savePoint} disabled={!pointSelectionne || saving} style={{
                  flex: 1, background: pointSelectionne ? "#4D0F1F" : "#E8E3D8",
                  color: pointSelectionne ? "#fff" : "#9B9B9B",
                  fontSize: "13px", fontWeight: 600, padding: "12px",
                  borderRadius: "999px", border: "none", cursor: pointSelectionne ? "pointer" : "not-allowed",
                }}>
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
                <button onClick={() => setEditPoint(false)} style={{
                  flex: 1, background: "#F5F0E8", color: "#1A1A1A",
                  fontSize: "13px", fontWeight: 600, padding: "12px",
                  borderRadius: "999px", border: "none", cursor: "pointer",
                }}>
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Suggérer un nouveau point */}
        <div style={{ background: "#fff", border: "1px solid #E8E3D8", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
            Votre frigidaire n'est pas dans la liste ?
          </p>
          <p style={{ fontSize: "13px", color: "#6B6B6B", marginBottom: "12px" }}>
            Suggérez un nouveau point de livraison et nous ferons notre possible pour l'ouvrir.
          </p>
          <a href="mailto:contact@clodia.fr?subject=Suggestion nouveau point de livraison" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "transparent", color: "#4D0F1F",
            fontSize: "13px", fontWeight: 600,
            padding: "10px 20px", borderRadius: "999px",
            textDecoration: "none", border: "1px solid #E8E3D8",
          }}>
            Suggérer un point →
          </a>
        </div>

        {/* Suppression compte */}
        <div style={{ background: "#fff", border: "1px solid #FDD5D9", borderRadius: "16px", padding: "24px" }}>
{!showDeleteConfirm ? (
            <button onClick={() => setShowDeleteConfirm(true)} style={{
              background: "transparent", border: "1px solid #FDD5D9",
              color: "#FD3D6B", fontSize: "13px", fontWeight: 600,
              padding: "10px 20px", borderRadius: "999px", cursor: "pointer",
            }}>
              Supprimer mon compte
            </button>
          ) : (
            <div>
              <p style={{ fontSize: "13px", color: "#6B6B6B", marginBottom: "12px" }}>
                Tapez <strong>SUPPRIMER</strong> pour confirmer la suppression définitive de votre compte.
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={e => setDeleteConfirmText(e.target.value)}
                placeholder="SUPPRIMER"
                className={inputClass}
                style={{ marginBottom: "12px" }}
              />
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={handleSupprimerCompte}
                  disabled={deleteConfirmText !== 'SUPPRIMER'}
                  style={{
                    flex: 1, background: deleteConfirmText === 'SUPPRIMER' ? "#FD3D6B" : "#E8E3D8",
                    color: deleteConfirmText === 'SUPPRIMER' ? "#fff" : "#9B9B9B",
                    fontSize: "13px", fontWeight: 600, padding: "12px",
                    borderRadius: "999px", border: "none",
                    cursor: deleteConfirmText === 'SUPPRIMER' ? "pointer" : "not-allowed",
                  }}
                >
                  Confirmer la suppression
                </button>
                <button onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText("") }} style={{
                  flex: 1, background: "#F5F0E8", color: "#1A1A1A",
                  fontSize: "13px", fontWeight: 600, padding: "12px",
                  borderRadius: "999px", border: "none", cursor: "pointer",
                }}>
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>

      </section>
    </div>
  )
}
