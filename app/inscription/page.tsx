"use client";

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { formatTelephone, normaliserTelephone } from "@/lib/utils"
import { createSupabaseBrowserClient } from "@/lib/supabase"
import { useRouter, useSearchParams } from "next/navigation"
import { fetchPointsLivraison, PointLivraisonDB } from "@/lib/menus"

function InscriptionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')
  const supabase = createSupabaseBrowserClient()

  const [prenom, setPrenom] = useState("")
  const [nom, setNom] = useState("")
  const [email, setEmail] = useState("")
  const [telephone, setTelephone] = useState("")
  const [motDePasse, setMotDePasse] = useState("")
  const [motDePasseConfirm, setMotDePasseConfirm] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [telephoneVerifie, setTelephoneVerifie] = useState(false)
  const [rechercheEnCours, setRechercheEnCours] = useState(false)
  const [clientExistantId, setClientExistantId] = useState<string | null>(null)
  const [mdpFocus, setMdpFocus] = useState(false)
  const [dejaInscrit, setDejaInscrit] = useState(false)
  const [points, setPoints] = useState<PointLivraisonDB[]>([])
  const [hopital, setHopital] = useState("")
  const [batiment, setBatiment] = useState("")
  const [service, setService] = useState("")
  const [pointSelectionne, setPointSelectionne] = useState<PointLivraisonDB | null>(null)
  const [clientNouveauSansPoint, setClientNouveauSansPoint] = useState(false)

  useEffect(() => {
    fetchPointsLivraison().then(setPoints)
  }, [])

  const hopitaux = [...new Set(points.map(p => p.hopital))]

  function getBatiments(h: string) {
    return [...new Set(points.filter(p => p.hopital === h).map(p => p.batiment))]
  }

  function getServices(h: string, b: string) {
    return points.filter(p => p.hopital === h && p.batiment === b)
  }

  function handleHopitalChange(val: string) {
    setHopital(val)
    setBatiment("")
    setService("")
    setPointSelectionne(null)
  }

  function handleBatimentChange(val: string) {
    setBatiment(val)
    setService("")
    setPointSelectionne(null)
  }

  function handleServiceChange(val: string) {
    setService(val)
    const found = points.find(p => p.hopital === hopital && p.batiment === batiment && p.service === val)
    setPointSelectionne(found ?? null)
  }

  function validerMotDePasse(mdp: string): { valide: boolean; force: 'faible' | 'moyen' | 'fort'; regles: { label: string; ok: boolean }[] } {
    const regles = [
      { label: "8 caractères minimum", ok: mdp.length >= 8 },
      { label: "1 majuscule", ok: /[A-Z]/.test(mdp) },
      { label: "1 chiffre", ok: /[0-9]/.test(mdp) },
      { label: "1 caractère spécial (!@#$%^&*...)", ok: /[^A-Za-z0-9]/.test(mdp) },
    ]
    const nbOk = regles.filter(r => r.ok).length
    const force = nbOk <= 1 ? 'faible' : nbOk <= 3 ? 'moyen' : 'fort'
    return { valide: nbOk === 4, force, regles }
  }


  async function rechercherClient(telOverride?: string) {
    const telNormalise = normaliserTelephone(telOverride ?? telephone)
    if (!/^\+33[1-9]\d{8}$/.test(telNormalise)) {
      setErrors({ telephone: "Numéro de téléphone invalide" })
      return
    }
    setRechercheEnCours(true)
    setErrors({})

    const { data } = await supabase
      .from('clients')
      .select('id, prenom, nom, email, telephone, user_id')
      .eq('telephone', telNormalise)
      .single()

    setRechercheEnCours(false)

    if (data) {
      if (data.user_id) {
        setErrors({ telephone: "Un compte existe déjà pour ce numéro. Connectez-vous." })
        setDejaInscrit(true)
        setTelephoneVerifie(false)
        return
      }
      setPrenom(data.prenom ?? '')
      setNom(data.nom ?? '')
      setEmail(data.email ?? '')
      setClientExistantId(data.id)
      setClientNouveauSansPoint(false)
      setDejaInscrit(false)
    } else {
      setPrenom('')
      setNom('')
      setEmail('')
      setClientExistantId(null)
      setClientNouveauSansPoint(true)
      setDejaInscrit(false)
    }

    setTelephoneVerifie(true)
  }

  function validate() {
    const newErrors: Record<string, string> = {}
    if (!prenom.trim()) newErrors.prenom = "Prénom requis"
    if (!nom.trim()) newErrors.nom = "Nom requis"
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email invalide"
    }
    const telNormalise = normaliserTelephone(telephone)
    if (!/^\+33[1-9]\d{8}$/.test(telNormalise)) {
      newErrors.telephone = "Numéro de téléphone invalide"
    }
    const { valide } = validerMotDePasse(motDePasse)
    if (!valide) newErrors.motDePasse = "Le mot de passe ne respecte pas les critères requis"
    if (motDePasse !== motDePasseConfirm) newErrors.motDePasseConfirm = "Les mots de passe ne correspondent pas"
    if (clientNouveauSansPoint && !pointSelectionne) {
      newErrors.point = "Veuillez sélectionner votre point de livraison"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleInscription() {
    if (!validate()) return
    setLoading(true)

    try {
      const telNormalise = normaliserTelephone(telephone)

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: motDePasse,
        options: {
          data: { prenom, nom }
        }
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          setErrors({ email: "Un compte existe déjà avec cet email" })
        } else {
          setErrors({ global: authError.message })
        }
        return
      }

      const userId = authData.user?.id

      if (clientExistantId) {
        await supabase
          .from('clients')
          .update({ user_id: userId, prenom, nom, email, telephone: telNormalise })
          .eq('id', clientExistantId)
      } else {
        await supabase
          .from('clients')
          .insert({ prenom, nom, email, telephone: telNormalise, user_id: userId })
      }

      if (pointSelectionne) {
        // Si client existant
        if (clientExistantId) {
          // Vérifier si ce point n'est pas déjà enregistré
          const { data: existing } = await supabase
            .from('client_points_livraison')
            .select('id')
            .eq('client_id', clientExistantId)
            .eq('point_livraison_id', pointSelectionne.id)
            .single()

          if (!existing) {
            // Vérifier s'il a déjà un défaut
            const { count } = await supabase
              .from('client_points_livraison')
              .select('id', { count: 'exact', head: true })
              .eq('client_id', clientExistantId)

            await supabase
              .from('client_points_livraison')
              .insert({
                client_id: clientExistantId,
                point_livraison_id: pointSelectionne.id,
                est_defaut: (count ?? 0) === 0,
              })
          }
        } else {
          // Nouveau client — premier point = défaut
          const { data: newClient } = await supabase
            .from('clients')
            .select('id')
            .eq('telephone', telNormalise)
            .single()

          if (newClient) {
            await supabase
              .from('client_points_livraison')
              .insert({
                client_id: newClient.id,
                point_livraison_id: pointSelectionne.id,
                est_defaut: true,
              })
          }
        }
      }

      if (redirect === 'checkout') {
        router.push('/checkout?auth=success')
      } else {
        router.push('/espace-client')
      }

    } catch (err) {
      console.error('[inscription] error:', err)
      setErrors({ global: "Une erreur est survenue. Veuillez réessayer." })
    } finally {
      setLoading(false)
    }
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
          Créer un compte
        </h1>
        <p style={{ fontSize: "14px", color: "#9B9B9B", marginBottom: "32px" }}>
          Déjà un compte ?{" "}
          <Link href="/connexion" style={{ color: "#4D0F1F", fontWeight: 600, textDecoration: "none" }}>
            Se connecter
          </Link>
        </p>

        {errors.global && (
          <div style={{ background: "#FDD5D9", borderRadius: "12px", padding: "12px 16px", marginBottom: "20px" }}>
            <p style={{ fontSize: "13px", color: "#4D0F1F" }}>{errors.global}</p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Téléphone en premier */}
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>Téléphone</label>
            <div style={{ position: "relative" }}>
              <input
                type="tel"
                value={telephone}
                onChange={e => {
                  const val = formatTelephone(e.target.value)
                  setTelephone(val)
                  setTelephoneVerifie(false)
                  setClientExistantId(null)
                  const normalise = normaliserTelephone(val)
                  if (/^\+33[1-9]\d{8}$/.test(normalise)) {
                    rechercherClient(val)
                  }
                }}
                placeholder="06 12 34 56 78"
                className={inputClass}
                style={{ borderColor: errors.telephone ? "#ef4444" : telephoneVerifie ? "#00CCCC" : undefined }}
              />
              {rechercheEnCours && (
                <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: "12px", color: "#9B9B9B" }}>
                  ...
                </span>
              )}
            </div>
            {errors.telephone && <p className={errorClass}>{errors.telephone}</p>}
            {dejaInscrit && (
              <p style={{ fontSize: "12px", marginTop: "6px" }}>
                <Link
                  href={redirect === 'checkout' ? '/connexion?redirect=checkout' : '/connexion'}
                  style={{ color: "#4D0F1F", fontWeight: 600, textDecoration: "none" }}
                >
                  → Se connecter
                </Link>
              </p>
            )}
            {telephoneVerifie && clientExistantId && (
              <p style={{ fontSize: "12px", color: "#00CCCC", marginTop: "6px" }}>
                ✓ Informations pré-remplies
              </p>
            )}
            {telephoneVerifie && !clientExistantId && (
              <p style={{ fontSize: "12px", color: "#9B9B9B", marginTop: "6px" }}>
                Nouveau client — renseignez vos informations ci-dessous
              </p>
            )}
          </div>

          {/* Champs grisés jusqu'à vérification */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", opacity: telephoneVerifie ? 1 : 0.4, pointerEvents: telephoneVerifie ? "auto" : "none" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>Prénom</label>
              <input type="text" value={prenom} onChange={e => setPrenom(e.target.value)} placeholder="Votre prénom" className={inputClass} style={{ borderColor: errors.prenom ? "#ef4444" : undefined }} />
              {errors.prenom && <p className={errorClass}>{errors.prenom}</p>}
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>Nom</label>
              <input type="text" value={nom} onChange={e => setNom(e.target.value)} placeholder="Votre nom" className={inputClass} style={{ borderColor: errors.nom ? "#ef4444" : undefined }} />
              {errors.nom && <p className={errorClass}>{errors.nom}</p>}
            </div>
          </div>

          <div style={{ opacity: telephoneVerifie ? 1 : 0.4, pointerEvents: telephoneVerifie ? "auto" : "none" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.fr" className={inputClass} style={{ borderColor: errors.email ? "#ef4444" : undefined }} />
            {errors.email && <p className={errorClass}>{errors.email}</p>}
          </div>

          {clientNouveauSansPoint && telephoneVerifie && (
            <div style={{ opacity: 1 }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>
                Votre frigidaire Clodia
              </label>
              <p style={{ fontSize: "12px", color: "#9B9B9B", marginBottom: "12px" }}>
                Sélectionnez votre point de livraison habituel
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
              </div>
              {pointSelectionne && (
                <p style={{ fontSize: "12px", color: "#00CCCC", marginTop: "8px" }}>
                  {pointSelectionne.service_desc}
                </p>
              )}
              {errors.point && <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px" }}>{errors.point}</p>}
            </div>
          )}

          <div style={{ opacity: telephoneVerifie ? 1 : 0.4, pointerEvents: telephoneVerifie ? "auto" : "none" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>Mot de passe</label>
            <input type="password" value={motDePasse} onChange={e => setMotDePasse(e.target.value)} onFocus={() => setMdpFocus(true)} placeholder="Minimum 8 caractères" className={inputClass} style={{ borderColor: errors.motDePasse ? "#ef4444" : undefined }} />
            {errors.motDePasse && <p className={errorClass}>{errors.motDePasse}</p>}
            {(mdpFocus || motDePasse.length > 0) && (() => {
              const { force, regles } = validerMotDePasse(motDePasse)
              return (
                <div style={{ marginTop: "8px" }}>
                  <div style={{ display: "flex", gap: "4px", marginBottom: "8px" }}>
                    {['faible', 'moyen', 'fort'].map((niveau, i) => (
                      <div key={niveau} style={{
                        flex: 1, height: "4px", borderRadius: "999px",
                        background: force === 'faible' && i === 0 ? "#ef4444"
                          : force === 'moyen' && i <= 1 ? "#FF9933"
                          : force === 'fort' ? "#00CCCC"
                          : "#E8E3D8",
                        transition: "background 0.2s ease",
                      }} />
                    ))}
                  </div>
                  <p style={{ fontSize: "11px", fontWeight: 600, color:
                    force === 'faible' ? "#ef4444" :
                    force === 'moyen' ? "#FF9933" : "#00CCCC",
                    marginBottom: "6px",
                  }}>
                    Force : {force === 'faible' ? 'Faible' : force === 'moyen' ? 'Moyen' : 'Fort'}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    {regles.map(r => (
                      <p key={r.label} style={{ fontSize: "11px", color: r.ok ? "#00CCCC" : "#9B9B9B", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>{r.ok ? "✓" : "○"}</span>
                        {r.label}
                      </p>
                    ))}
                  </div>
                </div>
              )
            })()}
          </div>

          <div style={{ opacity: telephoneVerifie ? 1 : 0.4, pointerEvents: telephoneVerifie ? "auto" : "none" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>Confirmer le mot de passe</label>
            <input type="password" value={motDePasseConfirm} onChange={e => setMotDePasseConfirm(e.target.value)} placeholder="Répétez votre mot de passe" className={inputClass} style={{ borderColor: errors.motDePasseConfirm ? "#ef4444" : undefined }} />
            {errors.motDePasseConfirm && <p className={errorClass}>{errors.motDePasseConfirm}</p>}
          </div>

        </div>

        <button
          onClick={handleInscription}
          disabled={loading || !telephoneVerifie}
          style={{
            marginTop: "24px", width: "100%",
            background: loading || !telephoneVerifie ? "#E8E3D8" : "#4D0F1F",
            color: loading || !telephoneVerifie ? "#9B9B9B" : "#fff",
            fontSize: "14px", fontWeight: 600,
            padding: "16px", borderRadius: "999px",
            border: "none", cursor: loading || !telephoneVerifie ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Création du compte..." : "Créer mon compte →"}
        </button>

      </section>
    </div>
  )
}

export default function InscriptionPage() {
  return (
    <Suspense fallback={null}>
      <InscriptionContent />
    </Suspense>
  )
}
