"use client";

import { useEffect, useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase"
import { formatTelephone, displayTelephone, normaliserTelephone } from "@/lib/utils"
import { fetchPointsLivraison, PointLivraisonDB, fetchPointsLivraisonClient } from "@/lib/menus"
import { Client, ClientPoint } from "@/types"
import { useRouter } from "next/navigation"

export default function ProfilPage() {
  const supabase = createSupabaseBrowserClient()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [client, setClient] = useState<Client | null>(null)
  const [editInfos, setEditInfos] = useState(false)
  const [prenomEdit, setPrenomEdit] = useState("")
  const [nomEdit, setNomEdit] = useState("")
  const [telephoneEdit, setTelephoneEdit] = useState("")
  const [savingInfos, setSavingInfos] = useState(false)
  const [saveInfosSuccess, setSaveInfosSuccess] = useState(false)
  const [errorsInfos, setErrorsInfos] = useState<Record<string, string>>({})
  const [points, setPoints] = useState<PointLivraisonDB[]>([])
  const [hopital, setHopital] = useState("")
  const [batiment, setBatiment] = useState("")
  const [service, setService] = useState("")
  const [mesPoints, setMesPoints] = useState<ClientPoint[]>([])
  const [ajouterMode, setAjouterMode] = useState(false)
  const [pointSelectionne, setPointSelectionne] = useState<PointLivraisonDB | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [savingPoint, setSavingPoint] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data: clientData } = await supabase
        .from('clients')
        .select('id, prenom, nom, email, telephone, user_id')
        .eq('user_id', session.user.id)
        .single()

      if (clientData) {
        setClient(clientData)
        setPrenomEdit(clientData.prenom ?? '')
        setNomEdit(clientData.nom ?? '')
        setTelephoneEdit(clientData.telephone ?? '')
        const points = await fetchPointsLivraisonClient(clientData.id, supabase)
        setMesPoints(points)
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


  async function saveInfos() {
    if (savingInfos) return
    const newErrors: Record<string, string> = {}
    if (!prenomEdit.trim()) newErrors.prenom = "Prénom requis"
    if (!nomEdit.trim()) newErrors.nom = "Nom requis"
    const telNormalise = normaliserTelephone(telephoneEdit)
    if (!/^\+33[1-9]\d{8}$/.test(telNormalise)) newErrors.telephone = "Numéro invalide"
    setErrorsInfos(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setSavingInfos(true)
    try {
      await supabase
        .from('clients')
        .update({ prenom: prenomEdit, nom: nomEdit, telephone: telNormalise })
        .eq('id', client!.id)

      setClient(prev => prev ? { ...prev, prenom: prenomEdit, nom: nomEdit, telephone: telNormalise } : prev)
      setSaveInfosSuccess(true)
      setEditInfos(false)
      setTimeout(() => setSaveInfosSuccess(false), 3000)
    } catch (err) {
      console.error('[profil] saveInfos error:', err)
    } finally {
      setSavingInfos(false)
    }
  }

  async function setDefaut(clientPointId: string) {
    if (savingPoint) return
    setSavingPoint(true)
    try {
      await supabase
        .from('client_points_livraison')
        .update({ est_defaut: false })
        .eq('client_id', client!.id)

      await supabase
        .from('client_points_livraison')
        .update({ est_defaut: true })
        .eq('id', clientPointId)

      const points = await fetchPointsLivraisonClient(client!.id, supabase)
      setMesPoints(points)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('[profil] setDefaut error:', err)
    } finally {
      setSavingPoint(false)
    }
  }

  async function supprimerPoint(clientPointId: string) {
    if (mesPoints.length <= 1) return
    if (savingPoint) return
    setSavingPoint(true)
    try {
      await supabase
        .from('client_points_livraison')
        .delete()
        .eq('id', clientPointId)

      const points = await fetchPointsLivraisonClient(client!.id, supabase)
      setMesPoints(points)
    } catch (err) {
      console.error('[profil] supprimerPoint error:', err)
    } finally {
      setSavingPoint(false)
    }
  }

  async function ajouterPoint() {
    if (!pointSelectionne) return

    try {
      await supabase
        .from('client_points_livraison')
        .insert({
          client_id: client!.id,
          point_livraison_id: pointSelectionne.id,
          est_defaut: mesPoints.length === 0,
        })

      const points = await fetchPointsLivraisonClient(client!.id, supabase)
      setMesPoints(points)
      setAjouterMode(false)
      setHopital('')
      setBatiment('')
      setService('')
      setPointSelectionne(null)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch {
      // Limite de 3 atteinte ou doublon
      alert('Vous avez déjà ce frigidaire ou avez atteint la limite de 3 frigidaires.')
    }
  }

  async function handleSupprimerCompte() {
    if (deleteConfirmText !== 'SUPPRIMER') return
    try {
      await supabase.from('clients').update({ user_id: null }).eq('id', client!.id)
      await supabase.auth.signOut()
      router.push('/')
    } catch (err) {
      console.error('[profil] handleSupprimerCompte error:', err)
    }
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

        {/* Infos personnelles — éditable */}
        <div style={{ background: "#fff", border: "1px solid #E8E3D8", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Informations personnelles
            </p>
            {!editInfos && (
              <button onClick={() => setEditInfos(true)} style={{ fontSize: "12px", color: "#007FFF", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                Modifier
              </button>
            )}
          </div>

          {saveInfosSuccess && (
            <div style={{ background: "#E8FFF8", borderRadius: "10px", padding: "10px 14px", marginBottom: "16px" }}>
              <p style={{ fontSize: "12px", color: "#00CCCC", fontWeight: 600 }}>✓ Informations mises à jour</p>
            </div>
          )}

          {!editInfos ? (
            <div>
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
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#1A1A1A" }}>{displayTelephone(client?.telephone ?? '')}</p>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>Prénom</label>
                  <input type="text" value={prenomEdit} onChange={e => setPrenomEdit(e.target.value)} className={inputClass} style={{ borderColor: errorsInfos.prenom ? "#ef4444" : undefined }} />
                  {errorsInfos.prenom && <p style={{ fontSize: "11px", color: "#ef4444", marginTop: "4px" }}>{errorsInfos.prenom}</p>}
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>Nom</label>
                  <input type="text" value={nomEdit} onChange={e => setNomEdit(e.target.value)} className={inputClass} style={{ borderColor: errorsInfos.nom ? "#ef4444" : undefined }} />
                  {errorsInfos.nom && <p style={{ fontSize: "11px", color: "#ef4444", marginTop: "4px" }}>{errorsInfos.nom}</p>}
                </div>
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>Téléphone</label>
                <input type="tel" value={telephoneEdit} onChange={e => setTelephoneEdit(formatTelephone(e.target.value))} placeholder="06 12 34 56 78" className={inputClass} style={{ borderColor: errorsInfos.telephone ? "#ef4444" : undefined }} />
                {errorsInfos.telephone && <p style={{ fontSize: "11px", color: "#ef4444", marginTop: "4px" }}>{errorsInfos.telephone}</p>}
              </div>
              <div>
                <p style={{ fontSize: "11px", color: "#9B9B9B", marginBottom: "4px" }}>Email</p>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#6B6B6B" }}>{client?.email}</p>
                <p style={{ fontSize: "11px", color: "#9B9B9B", marginTop: "2px", fontStyle: "italic" }}>L'email ne peut pas être modifié</p>
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <button onClick={saveInfos} disabled={savingInfos} style={{
                  flex: 1, background: "#4D0F1F", color: "#fff",
                  fontSize: "13px", fontWeight: 600, padding: "12px",
                  borderRadius: "999px", border: "none", cursor: "pointer",
                }}>
                  {savingInfos ? "Enregistrement..." : "Enregistrer"}
                </button>
                <button onClick={() => { setEditInfos(false); setErrorsInfos({}) }} style={{
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

        {/* Mes frigidaires */}
        <div style={{ background: "#fff", border: "1px solid #E8E3D8", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Mes frigidaires ({mesPoints.length}/3)
            </p>
            {mesPoints.length < 3 && !ajouterMode && (
              <button onClick={() => setAjouterMode(true)} style={{ fontSize: "12px", color: "#007FFF", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                + Ajouter
              </button>
            )}
          </div>

          {saveSuccess && (
            <div style={{ background: "#E8FFF8", borderRadius: "10px", padding: "10px 14px", marginBottom: "16px" }}>
              <p style={{ fontSize: "12px", color: "#00CCCC", fontWeight: 600 }}>✓ Frigidaires mis à jour</p>
            </div>
          )}

          {/* Liste des frigidaires enregistrés */}
          {mesPoints.length === 0 && !ajouterMode && (
            <p style={{ fontSize: "13px", color: "#9B9B9B" }}>Aucun frigidaire enregistré</p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {mesPoints.map(cp => (
              <div key={cp.id} style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 14px", borderRadius: "12px",
                background: cp.est_defaut ? "#E8FFF8" : "#FAFAF8",
                border: `1px solid ${cp.est_defaut ? "#00CCCC" : "#E8E3D8"}`,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A1A" }}>
                      {cp.points_livraison.service}
                    </p>
                    {cp.est_defaut && (
                      <span style={{ fontSize: "10px", fontWeight: 700, color: "#00CCCC", background: "#E8FFF8", padding: "2px 8px", borderRadius: "999px", border: "1px solid #00CCCC" }}>
                        Par défaut
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: "12px", color: "#6B6B6B" }}>
                    {cp.points_livraison.hopital} · {cp.points_livraison.batiment}
                  </p>
                  <p style={{ fontSize: "11px", color: "#00CCCC", marginTop: "2px" }}>
                    {cp.points_livraison.service_desc}
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-end" }}>
                  {!cp.est_defaut && (
                    <button onClick={() => setDefaut(cp.id)} disabled={savingPoint} style={{ fontSize: "11px", color: "#007FFF", background: "none", border: "none", cursor: savingPoint ? "not-allowed" : "pointer", fontWeight: 600, whiteSpace: "nowrap" }}>
                      Définir par défaut
                    </button>
                  )}
                  {mesPoints.length > 1 && (
                    <button onClick={() => supprimerPoint(cp.id)} disabled={savingPoint} style={{ fontSize: "11px", color: "#FD3D6B", background: "none", border: "none", cursor: savingPoint ? "not-allowed" : "pointer", fontWeight: 600 }}>
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Formulaire ajout */}
          {ajouterMode && (
            <div style={{ marginTop: mesPoints.length > 0 ? "16px" : "0", paddingTop: mesPoints.length > 0 ? "16px" : "0", borderTop: mesPoints.length > 0 ? "1px solid #E8E3D8" : "none" }}>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#6B6B6B", marginBottom: "10px" }}>
                Ajouter un frigidaire
              </p>
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
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                <button onClick={ajouterPoint} disabled={!pointSelectionne} style={{
                  flex: 1, background: pointSelectionne ? "#4D0F1F" : "#E8E3D8",
                  color: pointSelectionne ? "#fff" : "#9B9B9B",
                  fontSize: "13px", fontWeight: 600, padding: "10px",
                  borderRadius: "999px", border: "none", cursor: pointSelectionne ? "pointer" : "not-allowed",
                }}>
                  Ajouter
                </button>
                <button onClick={() => { setAjouterMode(false); setHopital(''); setBatiment(''); setService(''); setPointSelectionne(null) }} style={{
                  flex: 1, background: "#F5F0E8", color: "#1A1A1A",
                  fontSize: "13px", fontWeight: 600, padding: "10px",
                  borderRadius: "999px", border: "none", cursor: "pointer",
                }}>
                  Annuler
                </button>
              </div>
            </div>
          )}
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
