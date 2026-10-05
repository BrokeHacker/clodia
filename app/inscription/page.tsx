"use client";

import { useState, useEffect, useRef, Suspense } from "react"
import Link from "next/link"
import { formatTelephone, normaliserTelephone, validerMotDePasse } from "@/lib/utils"
import { createSupabaseBrowserClient } from "@/lib/supabase"
import { useRouter, useSearchParams } from "next/navigation"
import { fetchPointsLivraison, PointLivraisonDB } from "@/lib/menus"

const MSG_NUMERO_CONNU = "Ce numéro est déjà connu de Clodia. Pour créer votre compte, écrivez « compte » au bot WhatsApp : vous recevrez un lien personnel pour finaliser votre inscription."

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
  const [clientWhatsapp, setClientWhatsapp] = useState(false)
  const [emailEnvoye, setEmailEnvoye] = useState("")
  const [renvoiBloque, setRenvoiBloque] = useState(false)
  const [renvoiMessage, setRenvoiMessage] = useState("")
  const [points, setPoints] = useState<PointLivraisonDB[]>([])
  const [hopital, setHopital] = useState("")
  const [batiment, setBatiment] = useState("")
  const [service, setService] = useState("")
  const [pointSelectionne, setPointSelectionne] = useState<PointLivraisonDB | null>(null)
  const [clientNouveauSansPoint, setClientNouveauSansPoint] = useState(false)
  const derniereRecherche = useRef("")
  const tokenParam = searchParams.get('t')
  const [tokenInfo, setTokenInfo] = useState<{ prenom: string; nom: string; email: string; telephoneMasque: string } | null>(null)
  const [tokenMessage, setTokenMessage] = useState("")

  useEffect(() => {
    fetchPointsLivraison().then(list => {
      setPoints(list)

      // Pré-sélection : point de livraison choisi dans le panier avant l'inscription.
      // On ne réutilise que l'identifiant, retrouvé dans la liste officielle des points.
      try {
        let found: PointLivraisonDB | undefined
        const saved = sessionStorage.getItem('clodia-point')
        if (saved) {
          const id = (JSON.parse(saved) as { id?: string } | null)?.id
          found = id ? list.find(p => p.id === id) : undefined
        }

        // Repli : hôpital / bâtiment / service mémorisés séparément par la page de commande
        const h = sessionStorage.getItem('clodia-hopital') ?? ''
        const b = sessionStorage.getItem('clodia-batiment') ?? ''
        const s = sessionStorage.getItem('clodia-service') ?? ''
        if (!found && h && b && s) {
          found = list.find(p => p.hopital === h && p.batiment === b && p.service === s)
        }

        if (found) {
          setHopital(found.hopital)
          setBatiment(found.batiment)
          setService(found.service)
          setPointSelectionne(found)
        } else if (h && list.some(p => p.hopital === h)) {
          // Sélection partielle (hôpital, puis bâtiment) si le service n'a pas été choisi
          setHopital(h)
          if (b && list.some(p => p.hopital === h && p.batiment === b)) setBatiment(b)
        }
      } catch {}
    })
  }, [])

  // Lien d'inscription envoyé par le bot WhatsApp : il prouve que la personne détient le numéro
  useEffect(() => {
    if (!tokenParam) return
    let annule = false
    fetch(`/api/inscription/jeton?t=${encodeURIComponent(tokenParam)}`)
      .then(r => r.json().catch(() => ({})))
      .then(data => {
        if (annule) return
        if (data?.valide) {
          setTokenInfo({
            prenom: data.prenom ?? '',
            nom: data.nom ?? '',
            email: data.email ?? '',
            telephoneMasque: data.telephoneMasque ?? '',
          })
          setPrenom(data.prenom ?? '')
          setNom(data.nom ?? '')
          setEmail(data.email ?? '')
          setTelephoneVerifie(true)
          setClientNouveauSansPoint(false)
        } else if (data?.compteExistant) {
          setDejaInscrit(true)
          setTokenMessage("Un compte existe déjà pour ce numéro. Connectez-vous.")
        } else {
          setTokenMessage("Ce lien a expiré ou a déjà été utilisé. Envoyez « compte » au bot WhatsApp pour en recevoir un nouveau, ou créez votre compte ci-dessous.")
        }
      })
      .catch(() => {
        if (!annule) setTokenMessage("Impossible de vérifier le lien pour le moment. Vous pouvez créer votre compte ci-dessous.")
      })
    return () => { annule = true }
  }, [tokenParam])

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


  async function rechercherClient(telOverride?: string) {
    const telNormalise = normaliserTelephone(telOverride ?? telephone)
    if (!/^\+33[1-9]\d{8}$/.test(telNormalise)) {
      setErrors({ telephone: "Numéro de téléphone invalide" })
      return
    }
    // Sécurité : aucune lecture de "clients" depuis le navigateur, et jamais de rattachement
    // automatique à une fiche existante (numéro non vérifié). Le serveur indique seulement
    // si un COMPTE existe déjà pour ce numéro, pour proposer la connexion.
    setErrors({})
    setClientExistantId(null)
    setClientNouveauSansPoint(true)
    setDejaInscrit(false)
    setClientWhatsapp(false)
    derniereRecherche.current = telNormalise
    setRechercheEnCours(true)

    let compte = false
    let whatsapp = false
    try {
      const res = await fetch('/api/auth/telephone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telephone: telNormalise }),
      })
      if (res.ok) {
        const rep = await res.json()
        compte = Boolean(rep.compte)
        whatsapp = Boolean(rep.whatsapp)
      }
    } catch {
      // En cas d'échec on laisse continuer : la base ne rattache de toute façon jamais une fiche existante
    }

    // Réponse périmée (le numéro a été modifié entre-temps) : on l'ignore
    if (derniereRecherche.current !== telNormalise) return
    setRechercheEnCours(false)

    if (compte) {
      setErrors({ telephone: "Un compte existe déjà pour ce numéro. Connectez-vous." })
      setDejaInscrit(true)
      setTelephoneVerifie(false)
      return
    }
    if (whatsapp) {
      // Numéro déjà connu du bot : la seule voie est le lien envoyé sur WhatsApp
      setClientWhatsapp(true)
      setErrors({ telephone: MSG_NUMERO_CONNU })
      setTelephoneVerifie(false)
      return
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
    if (!tokenInfo) {
      const telNormalise = normaliserTelephone(telephone)
      if (!/^\+33[1-9]\d{8}$/.test(telNormalise)) {
        newErrors.telephone = "Numéro de téléphone invalide"
      }
      else if (clientWhatsapp) {
        newErrors.telephone = MSG_NUMERO_CONNU
      }
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

  // Adresse vers laquelle le lien de confirmation ramène le client (session ouverte automatiquement).
  // Si le lien est ouvert dans un autre navigateur, l'email est tout de même confirmé : le client
  // est alors renvoyé vers la connexion.
  function urlConfirmation() {
    const destination = redirect === 'checkout' ? '/checkout?auth=success' : '/espace-client'
    const echec = redirect === 'checkout' ? '/connexion?confirme=1&redirect=checkout' : '/connexion?confirme=1'
    return `${window.location.origin}/auth/callback?next=${encodeURIComponent(destination)}&echec=${encodeURIComponent(echec)}`
  }

  async function renvoyerConfirmation() {
    if (!emailEnvoye || renvoiBloque) return
    setRenvoiBloque(true)
    setRenvoiMessage("")
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: emailEnvoye,
      options: { emailRedirectTo: urlConfirmation() },
    })
    setRenvoiMessage(error ? "Impossible de renvoyer l'email pour le moment. Réessayez dans quelques minutes." : "Email renvoyé. Pensez à vérifier vos courriers indésirables.")
    setTimeout(() => setRenvoiBloque(false), 60000)
  }

  async function handleInscription() {
    if (!validate()) return
    setLoading(true)

    try {
      const telNormalise = normaliserTelephone(telephone)

      // La fiche client et le point de livraison sont créés côté base de données
      // (trigger handle_new_user) à partir de ces métadonnées : aucune écriture dans
      // "clients" depuis le navigateur.
      const { data: signUpData, error: authError } = await supabase.auth.signUp({
        email,
        password: motDePasse,
        options: {
          emailRedirectTo: urlConfirmation(),
          // Avec un lien du bot : la base rattache la fiche WhatsApp existante (jeton à usage unique).
          // Sinon : nouvelle fiche, sans rattachement automatique.
          data: tokenInfo && tokenParam
            ? { prenom, nom, signup_token: tokenParam }
            : {
                prenom,
                nom,
                telephone: telNormalise,
                point_livraison_id: pointSelectionne?.id ?? null,
              },
        },
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          setErrors({ email: "Un compte existe déjà avec cet email" })
        } else if (authError.message.includes('Database error')) {
          // Le trigger refuse un numéro déjà connu (inscription sans lien WhatsApp)
          setClientWhatsapp(true)
          setErrors({ telephone: MSG_NUMERO_CONNU })
        } else {
          setErrors({ global: authError.message })
        }
        return
      }

      // Confirmation d'email activée : pas de session tant que le lien n'a pas été ouvert
      if (!signUpData.session) {
        setEmailEnvoye(email)
        return
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

  if (emailEnvoye) {
    return (
      <div style={{ background: "#FAFAF8", minHeight: "100vh" }}>
        <section style={{ maxWidth: "520px", margin: "0 auto", padding: "64px 24px", textAlign: "center" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 600, color: "#1A1A1A", letterSpacing: "-0.02em", marginBottom: "12px" }}>
            Vérifiez votre boîte mail
          </h1>
          <p style={{ fontSize: "14px", color: "#6B6B6B", lineHeight: 1.6, marginBottom: "8px" }}>
            Nous venons d'envoyer un lien de confirmation à <strong>{emailEnvoye}</strong>.
            Cliquez dessus pour activer votre compte.
          </p>
          <p style={{ fontSize: "13px", color: "#9B9B9B", lineHeight: 1.6, marginBottom: "24px" }}>
            Pensez à regarder dans vos courriers indésirables. Une fois l'adresse confirmée, vous pourrez vous connecter.
          </p>
          {renvoiMessage && (
            <p style={{ fontSize: "13px", color: "#4D0F1F", background: "#FFF4E5", borderRadius: "12px", padding: "10px 14px", marginBottom: "16px" }}>
              {renvoiMessage}
            </p>
          )}
          <button
            onClick={renvoyerConfirmation}
            disabled={renvoiBloque}
            style={{
              background: "transparent", border: "1px solid #E8E3D8",
              color: renvoiBloque ? "#9B9B9B" : "#4D0F1F", fontSize: "13px", fontWeight: 600,
              padding: "12px 24px", borderRadius: "999px",
              cursor: renvoiBloque ? "not-allowed" : "pointer", marginBottom: "16px",
            }}
          >
            Renvoyer l'email
          </button>
          <p style={{ fontSize: "13px" }}>
            <Link href={redirect === 'checkout' ? '/connexion?redirect=checkout' : '/connexion'} style={{ color: "#4D0F1F", fontWeight: 600, textDecoration: "none" }}>
              → Aller à la connexion
            </Link>
          </p>
        </section>
      </div>
    )
  }

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

        {tokenMessage && (
          <div style={{ background: "#FFF4E5", borderRadius: "12px", padding: "12px 16px", marginBottom: "20px" }}>
            <p style={{ fontSize: "13px", color: "#4D0F1F" }}>{tokenMessage}</p>
          </div>
        )}

        {errors.global && (
          <div style={{ background: "#FDD5D9", borderRadius: "12px", padding: "12px 16px", marginBottom: "20px" }}>
            <p style={{ fontSize: "13px", color: "#4D0F1F" }}>{errors.global}</p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Téléphone en premier */}
          {tokenInfo ? (
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>Téléphone</label>
              <p style={{ fontSize: "14px", color: "#1A1A1A" }}>{tokenInfo.telephoneMasque}</p>
              <p style={{ fontSize: "12px", color: "#00CCCC", marginTop: "6px" }}>✓ Numéro vérifié via WhatsApp</p>
            </div>
          ) : (
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
                  setDejaInscrit(false)
                  setClientWhatsapp(false)
                  setErrors(prev => ({ ...prev, telephone: "" }))
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
            {clientWhatsapp && !tokenInfo && (
              <p style={{ fontSize: "12px", marginTop: "6px" }}>
                <Link href="/whatsapp" style={{ color: "#4D0F1F", fontWeight: 600, textDecoration: "none" }}>
                  → Accéder au bot WhatsApp
                </Link>
              </p>
            )}
            {telephoneVerifie && !clientExistantId && !clientWhatsapp && (
              <p style={{ fontSize: "12px", color: "#9B9B9B", marginTop: "6px" }}>
                Nouveau client — renseignez vos informations ci-dessous
              </p>
            )}
          </div>
          )}

          {/* Champs grisés jusqu'à vérification */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", opacity: telephoneVerifie ? 1 : 0.4, pointerEvents: telephoneVerifie ? "auto" : "none" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>Prénom</label>
              <input type="text" value={prenom} disabled={Boolean(tokenInfo?.prenom)} onChange={e => setPrenom(e.target.value)} placeholder="Votre prénom" className={inputClass} style={{ borderColor: errors.prenom ? "#ef4444" : undefined }} />
              {errors.prenom && <p className={errorClass}>{errors.prenom}</p>}
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>Nom</label>
              <input type="text" value={nom} disabled={Boolean(tokenInfo?.nom)} onChange={e => setNom(e.target.value)} placeholder="Votre nom" className={inputClass} style={{ borderColor: errors.nom ? "#ef4444" : undefined }} />
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

        <p style={{ fontSize: "11px", color: "#9B9B9B", textAlign: "center", marginTop: "12px", lineHeight: 1.5 }}>
          En créant un compte, vous acceptez que vos données soient traitées comme indiqué dans notre{" "}
          <a href="/confidentialite" target="_blank" rel="noopener noreferrer" style={{ color: "#4D0F1F", textDecoration: "underline" }}>politique de confidentialité</a>.
        </p>

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
