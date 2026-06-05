"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { formatTelephone, displayTelephone } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { supabase, createSupabaseBrowserClient } from '@/lib/supabase';
import { PointLivraisonDB, getTarifUnitaire, getTarifPrecommande, fetchTarifs, Tarif, fetchMenusSemaineCourante, fetchMenusSemaineSuivante, getDisponible } from "@/lib/menus";
import { Menu } from "@/lib/data";

interface CartItem {
  menuId: string;
  variante: "plat" | "plat_vege";
  quantite: number;
}

type Etape = "auth" | "infos" | "recap";

function formatPrice(p: number) {
  return p.toFixed(2).replace(".", ",") + " €";
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [etape, setEtape] = useState<Etape>("auth");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [point, setPoint] = useState<PointLivraisonDB | null>(null);
  const [tarifs, setTarifs] = useState<Tarif[]>([]);
  const [menusCurrentWeek, setMenusCurrentWeek] = useState<Menu[]>([]);
  const [menusNextWeek, setMenusNextWeek] = useState<Menu[]>([]);

  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [telephoneVerifie, setTelephoneVerifie] = useState(false);
  const [rechercheEnCours, setRechercheEnCours] = useState(false);
  const [clientTrouve, setClientTrouve] = useState(false);
  const [commandeEnCours, setCommandeEnCours] = useState(false);
  const [erreurSlots, setErreurSlots] = useState<{date: string, variante: string, dispo: number, demande: number}[]>([]);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const supabaseBrowser = createSupabaseBrowserClient();
      const { data: { session } } = await supabaseBrowser.auth.getSession();

      if (session) {
        const { data: clientData } = await supabaseBrowser
          .from('clients')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (clientData) {
          setPrenom(clientData.prenom ?? '');
          setNom(clientData.nom ?? '');
          setEmail(clientData.email ?? '');
          setTelephone(clientData.telephone ?? '');
          setTelephoneVerifie(true);
          setEtape('recap');
        }
      }

      try {
        const savedCart = sessionStorage.getItem('clodia-cart');
        if (savedCart) setCart(JSON.parse(savedCart));
        const savedPoint = sessionStorage.getItem('clodia-point');
        if (savedPoint) setPoint(JSON.parse(savedPoint));
      } catch {}
      fetchTarifs().then(setTarifs);
      fetchMenusSemaineCourante().then(setMenusCurrentWeek);
      fetchMenusSemaineSuivante().then(setMenusNextWeek);

      const authSuccess = searchParams.get('auth');
      if (authSuccess === 'success') {
        const supabaseBrowser = createSupabaseBrowserClient();
        const { data: { session } } = await supabaseBrowser.auth.getSession();

        if (session) {
          const { data: clientData } = await supabaseBrowser
            .from('clients')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (clientData) {
            setPrenom(clientData.prenom ?? '');
            setNom(clientData.nom ?? '');
            setEmail(clientData.email ?? '');
            setTelephone(clientData.telephone ?? '');
            setTelephoneVerifie(true);
            setEtape('recap');
          }
        }
      }
      setAuthLoading(false);
    }
    init();
  }, []);

  const allMenus = [...menusCurrentWeek, ...menusNextWeek];

  const cartWithMenus = cart
    .map(item => ({ ...item, menu: allMenus.find(m => m.id === item.menuId)! }))
    .filter(item => item.menu);

  const itemsPrecommande = cartWithMenus.filter(item => menusNextWeek.some(m => m.id === item.menuId));
  const itemsCourante = cartWithMenus.filter(item => menusCurrentWeek.some(m => m.id === item.menuId));
  const qtePrecommande = itemsPrecommande.reduce((a, c) => a + c.quantite, 0);
  const prixUnite = getTarifUnitaire(tarifs);

  const total = cartWithMenus.reduce((acc, item) => {
    const isPrecommande = menusNextWeek.some(m => m.id === item.menuId);
    const prix = isPrecommande
      ? getTarifPrecommande(tarifs, qtePrecommande)
      : prixUnite;
    return acc + prix * item.quantite;
  }, 0);

  function normaliserTelephone(tel: string): string {
    const cleaned = tel.replace(/\s/g, '').replace(/-/g, '');
    if (cleaned.startsWith('0')) return '+33' + cleaned.slice(1);
    if (cleaned.startsWith('+33')) return cleaned;
    return cleaned;
  }

  async function rechercherClient(telOverride?: string) {
    const telNormalise = normaliserTelephone(telOverride ?? telephone);
    if (!/^\+33[1-9]\d{8}$/.test(telNormalise)) {
      setErrors({ telephone: "Numéro de téléphone invalide" });
      return;
    }
    setRechercheEnCours(true);
    setErrors({});

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('telephone', telNormalise)
      .single();

    setRechercheEnCours(false);
    setTelephoneVerifie(true);

    if (data && !error) {
      setPrenom(data.prenom ?? '');
      setNom(data.nom ?? '');
      setEmail(data.email ?? '');
      setClientTrouve(true);
    } else {
      setClientTrouve(false);
      setPrenom('');
      setNom('');
      setEmail('');
    }
  }

  function validateInfos() {
    const newErrors: Record<string, string> = {};
    if (!prenom.trim()) newErrors.prenom = "Prénom requis";
    if (!nom.trim()) newErrors.nom = "Nom requis";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email invalide";
    }
    if (!telephone.trim() || !/^(\+33|0)[1-9](\d{8})$/.test(telephone.replace(/\s/g, ''))) {
      newErrors.telephone = "Numéro de téléphone invalide";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handlePaiement() {
    setCommandeEnCours(true)
    setErreurSlots([])

    try {
      // ── ÉTAPE 1 : Vérifier les slots pour la semaine en cours ──
      if (itemsCourante.length > 0) {
        const dates = [...new Set(itemsCourante.map(i => i.menu.date_livraison))]
        const { data: slotsData, error: slotsError } = await supabase
          .from('slots_unite')
          .select('*')
          .in('date_livraison', dates)

        if (slotsError) throw new Error('Erreur vérification disponibilités')

        const conflits: {date: string, variante: string, dispo: number, demande: number}[] = []

        for (const item of itemsCourante) {
          const varianteSlot = item.variante === 'plat_vege' ? 'vegetarien' : 'standard'
          const slot = slotsData?.find(s =>
            s.date_livraison === item.menu.date_livraison && s.variante === varianteSlot
          )
          if (slot) {
            const dispo = getDisponible(slot)
            if (item.quantite > dispo) {
              conflits.push({
                date: `${item.menu.jourSemaine} ${item.menu.date}`,
                variante: item.variante === 'plat_vege' ? 'végétarien' : 'standard',
                dispo,
                demande: item.quantite,
              })
            }
          }
        }

        if (conflits.length > 0) {
          setErreurSlots(conflits)
          setCommandeEnCours(false)
          return
        }
      }

      // ── ÉTAPE 2 : Upsert client ──
      const telNormalise = normaliserTelephone(telephone)

      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .upsert({
          telephone: telNormalise,
          prenom,
          nom,
          email,
          point_livraison: point?.id ?? null,
        }, { onConflict: 'telephone' })
        .select('id')
        .single()

      if (clientError || !clientData) throw new Error('Erreur création client')
      const clientId = clientData.id

      // ── ÉTAPE 3 : Créer les lignes commandes ──
      const lignesCommandes = cartWithMenus.map(item => {
        const isPrecommande = menusNextWeek.some(m => m.id === item.menuId)
        const prixUnit = isPrecommande
          ? getTarifPrecommande(tarifs, qtePrecommande)
          : prixUnite
        return {
          client_id: clientId,
          menu_id: item.menuId,
          type: isPrecommande ? 'pre-commande' : 'unite',
          variante: item.variante === 'plat_vege' ? 'vegetarien' : 'standard',
          quantite: item.quantite,
          prix_unitaire: prixUnit,
          statut: 'en_attente',
          point_livraison: point?.id ?? null,
        }
      })

      const { error: commandeError } = await supabase
        .from('commandes')
        .insert(lignesCommandes)

      if (commandeError) {
        console.error('Détail erreur commandes:', JSON.stringify(commandeError))
        throw new Error('Erreur création commandes')
      }

      // ── ÉTAPE 4 : Mettre à jour slots_unite pour la semaine en cours ──
      for (const item of itemsCourante) {
        const varianteSlot = item.variante === 'plat_vege' ? 'vegetarien' : 'standard'
        const { data: slotActuel } = await supabase
          .from('slots_unite')
          .select('id, reserves')
          .eq('date_livraison', item.menu.date_livraison)
          .eq('variante', varianteSlot)
          .single()

        if (slotActuel) {
          await supabase
            .from('slots_unite')
            .update({ reserves: (slotActuel.reserves ?? 0) + item.quantite })
            .eq('id', slotActuel.id)
        }
      }

      // ── ÉTAPE 5 : Stripe ──
      const { data: commandesCreees } = await supabase
        .from('commandes')
        .select('id')
        .eq('client_id', clientId)
        .eq('statut', 'en_attente')
        .order('created_at', { ascending: false })
        .limit(lignesCommandes.length)

      const commandeIds = commandesCreees?.map(c => c.id) ?? []

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commandeIds,
          email,
          total,
          prenom,
          nom,
        }),
      })

      const { url, error } = await response.json()
      if (error || !url) throw new Error('Erreur création session Stripe')

      window.location.href = url

    } catch (err) {
      console.error(err)
      alert('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setCommandeEnCours(false)
    }
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#FD3D6B] bg-white";
  const errorClass = "text-xs text-red-500 mt-1";

  if (authLoading) return (
    <div style={{ background: "#FAFAF8", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#9B9B9B", fontSize: "14px" }}>Chargement...</p>
    </div>
  )

  return (
    <div style={{ background: "#FAFAF8", minHeight: "100vh" }}>
      <section style={{ maxWidth: "680px", margin: "0 auto", padding: "64px 24px" }}>

        {/* Titre */}
        <div style={{ marginBottom: "40px" }}>
          <Link href="/commander" style={{ fontSize: "13px", color: "#9B9B9B", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
            ← Retour au panier
          </Link>
          <h1 style={{ fontSize: "28px", fontWeight: 600, color: "#1A1A1A", letterSpacing: "-0.02em" }}>
            Finaliser la commande
          </h1>
        </div>

        {/* ÉTAPE 1 — AUTH */}
        {etape === "auth" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

            <Link href="/connexion?redirect=checkout" style={{
              display: "block", background: "#fff",
              border: "2px solid #E8E3D8", borderRadius: "16px",
              padding: "24px", textDecoration: "none",
              cursor: "pointer", transition: "all 0.2s ease",
            }}>
              <p style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A1A", marginBottom: "4px" }}>
                J&apos;ai déjà un compte
              </p>
              <p style={{ fontSize: "13px", color: "#9B9B9B" }}>
                Connectez-vous pour accéder à vos informations sauvegardées
              </p>
            </Link>

            <Link href="/inscription?redirect=checkout" style={{
              display: "block", background: "#fff",
              border: "2px solid #E8E3D8", borderRadius: "16px",
              padding: "24px", textDecoration: "none",
              cursor: "pointer", transition: "all 0.2s ease",
            }}>
              <p style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A1A", marginBottom: "4px" }}>
                Créer un compte
              </p>
              <p style={{ fontSize: "13px", color: "#9B9B9B" }}>
                Sauvegardez vos informations pour vos prochaines commandes
              </p>
            </Link>

            <button
              onClick={() => setEtape("infos")}
              style={{
                background: "#fff", border: "1px solid #E8E3D8",
                borderRadius: "16px", padding: "24px",
                textAlign: "left", cursor: "pointer",
                transition: "all 0.2s ease",
                width: "100%",
              }}
            >
              <p style={{ fontSize: "15px", fontWeight: 600, color: "#4D0F1F", marginBottom: "4px" }}>
                Continuer sans compte
              </p>
              <p style={{ fontSize: "13px", color: "#9B9B9B" }}>
                Commandez rapidement en renseignant vos coordonnées
              </p>
            </button>

          </div>
        )}

        {/* ÉTAPE 2 — INFOS */}
        {etape === "infos" && (
          <div>
            <p style={{ fontSize: "13px", color: "#9B9B9B", marginBottom: "24px" }}>
              Ces informations nous permettent de vous envoyer la confirmation de commande et de vous notifier de la livraison.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Champ téléphone en premier */}
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>
                  Téléphone
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="tel"
                    value={telephone}
                    onChange={e => {
                      const val = formatTelephone(e.target.value);
                      setTelephone(val);
                      setTelephoneVerifie(false);
                      setClientTrouve(false);
                      const normalise = normaliserTelephone(val);
                      if (/^\+33[1-9]\d{8}$/.test(normalise)) {
                        rechercherClient(val);
                      }
                    }}
                    placeholder="06 12 34 56 78"
                    className={inputClass}
                    style={{ borderColor: errors.telephone ? "#ef4444" : telephoneVerifie ? "#00CCCC" : undefined }}
                  />
                  {rechercheEnCours && (
                    <span style={{
                      position: "absolute", right: 12, top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "12px", color: "#9B9B9B",
                    }}>
                      ...
                    </span>
                  )}
                </div>
                {errors.telephone && <p className={errorClass}>{errors.telephone}</p>}
                {telephoneVerifie && clientTrouve && (
                  <p style={{ fontSize: "12px", color: "#00CCCC", marginTop: "6px" }}>
                    ✓ Compte trouvé — informations pré-remplies
                  </p>
                )}
                {telephoneVerifie && !clientTrouve && (
                  <p style={{ fontSize: "12px", color: "#9B9B9B", marginTop: "6px" }}>
                    Numéro non reconnu — renseignez vos informations ci-dessous
                  </p>
                )}
              </div>

              {/* Champs pré-remplis ou grisés selon telephoneVerifie */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", opacity: telephoneVerifie ? 1 : 0.4, pointerEvents: telephoneVerifie ? "auto" : "none" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={prenom}
                    onChange={e => setPrenom(e.target.value)}
                    placeholder="Votre prénom"
                    className={inputClass}
                    style={{ borderColor: errors.prenom ? "#ef4444" : undefined }}
                  />
                  {errors.prenom && <p className={errorClass}>{errors.prenom}</p>}
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>
                    Nom
                  </label>
                  <input
                    type="text"
                    value={nom}
                    onChange={e => setNom(e.target.value)}
                    placeholder="Votre nom"
                    className={inputClass}
                    style={{ borderColor: errors.nom ? "#ef4444" : undefined }}
                  />
                  {errors.nom && <p className={errorClass}>{errors.nom}</p>}
                </div>
              </div>

              <div style={{ opacity: telephoneVerifie ? 1 : 0.4, pointerEvents: telephoneVerifie ? "auto" : "none" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.fr"
                  className={inputClass}
                  style={{ borderColor: errors.email ? "#ef4444" : undefined }}
                />
                {errors.email && <p className={errorClass}>{errors.email}</p>}
              </div>

            </div>

            <button
              onClick={() => { if (validateInfos()) setEtape("recap"); }}
              disabled={!telephoneVerifie}
              style={{
                marginTop: "24px",
                width: "100%",
                background: telephoneVerifie ? "#4D0F1F" : "#E8E3D8",
                color: telephoneVerifie ? "#fff" : "#9B9B9B",
                fontSize: "14px", fontWeight: 600,
                padding: "16px", borderRadius: "999px",
                border: "none",
                cursor: telephoneVerifie ? "pointer" : "not-allowed",
              }}
            >
              Continuer vers le récapitulatif →
            </button>
          </div>
        )}

        {/* ÉTAPE 3 — RÉCAPITULATIF */}
        {etape === "recap" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Infos client */}
            <div style={{ background: "#fff", border: "1px solid #E8E3D8", borderRadius: "16px", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <p style={{ fontSize: "12px", fontWeight: 700, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Vos coordonnées
                </p>
                <button onClick={() => setEtape("infos")} style={{ fontSize: "12px", color: "#007FFF", background: "none", border: "none", cursor: "pointer" }}>
                  Modifier
                </button>
              </div>
              <p style={{ fontSize: "14px", color: "#1A1A1A", fontWeight: 500 }}>{prenom} {nom}</p>
              <p style={{ fontSize: "13px", color: "#6B6B6B", marginTop: "2px" }}>{email}</p>
              <p style={{ fontSize: "13px", color: "#6B6B6B", marginTop: "2px" }}>{displayTelephone(telephone)}</p>
            </div>

            {/* Point de livraison */}
            {point && (
              <div style={{ background: "#fff", border: "1px solid #E8E3D8", borderRadius: "16px", padding: "20px" }}>
                <p style={{ fontSize: "12px", fontWeight: 700, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
                  Point de livraison
                </p>
                <p style={{ fontSize: "14px", color: "#1A1A1A", fontWeight: 500 }}>{point.hopital}</p>
                <p style={{ fontSize: "13px", color: "#6B6B6B", marginTop: "2px" }}>{point.batiment} — {point.service}</p>
                <p style={{ fontSize: "12px", color: "#00CCCC", marginTop: "4px" }}>{point.service_desc}</p>
              </div>
            )}

            {/* Récap commande */}
            <div style={{ background: "#fff", border: "1px solid #E8E3D8", borderRadius: "16px", padding: "20px" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
                Votre commande
              </p>

              {itemsPrecommande.length > 0 && (
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "#00CCCC", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                    Pré-commande
                  </p>
                  {itemsPrecommande.map(item => (
                    <div key={item.menuId + item.variante} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#1A1A1A", marginBottom: "6px" }}>
                      <span>{item.menu.jourSemaine} {item.menu.date} — {item.variante === "plat" ? "Plat standard" : "Plat végétarien"} × {item.quantite}</span>
                      <span style={{ fontWeight: 600 }}>{formatPrice(getTarifPrecommande(tarifs, qtePrecommande) * item.quantite)}</span>
                    </div>
                  ))}
                </div>
              )}

              {itemsCourante.length > 0 && (
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "#C4704F", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                    Semaine en cours
                  </p>
                  {itemsCourante.map(item => (
                    <div key={item.menuId + item.variante} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#1A1A1A", marginBottom: "6px" }}>
                      <span>{item.menu.jourSemaine} {item.menu.date} — {item.variante === "plat" ? "Plat standard" : "Plat végétarien"} × {item.quantite}</span>
                      <span style={{ fontWeight: 600 }}>{formatPrice(prixUnite * item.quantite)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ borderTop: "1px solid #E8E3D8", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A1A" }}>Total</span>
                <span style={{ fontSize: "18px", fontWeight: 600, color: "#FF9933" }}>{formatPrice(total)}</span>
              </div>
              <p style={{ fontSize: "11px", color: "#9B9B9B", marginTop: "4px" }}>Livraison incluse</p>
            </div>

            {/* Erreurs de disponibilité */}
            {erreurSlots.length > 0 && (
              <div style={{
                background: "#FDD5D9", borderRadius: "12px",
                padding: "16px", marginBottom: "16px",
              }}>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#4D0F1F", marginBottom: "8px" }}>
                  Certains plats ne sont plus disponibles en quantité suffisante :
                </p>
                {erreurSlots.map((e, i) => (
                  <p key={i} style={{ fontSize: "12px", color: "#4D0F1F", marginBottom: "4px" }}>
                    • {e.date} — {e.variante} : {e.dispo} disponible{e.dispo > 1 ? 's' : ''} (vous en avez {e.demande})
                  </p>
                ))}
                <p style={{ fontSize: "12px", color: "#6B6B6B", marginTop: "8px" }}>
                  Veuillez ajuster les quantités dans votre panier.
                </p>
                <a href="/commander?semaine=courante" style={{
                  display: "inline-block", marginTop: "10px",
                  fontSize: "13px", fontWeight: 600, color: "#4D0F1F",
                  textDecoration: "underline",
                }}>
                  ← Retour au panier
                </a>
              </div>
            )}

            {/* Bouton paiement */}
            <button
              onClick={handlePaiement}
              disabled={commandeEnCours}
              style={{
                width: "100%",
                background: commandeEnCours ? "#E8E3D8" : "#FD3D6B",
                color: commandeEnCours ? "#9B9B9B" : "#fff",
                fontSize: "14px", fontWeight: 600,
                padding: "18px", borderRadius: "999px",
                border: "none",
                cursor: commandeEnCours ? "not-allowed" : "pointer",
                transition: "background 0.2s ease",
              }}
            >
              {commandeEnCours ? "Enregistrement en cours..." : "Procéder au paiement →"}
            </button>

            <p style={{ fontSize: "11px", color: "#9B9B9B", textAlign: "center" }}>
              Paiement sécurisé Stripe · Livraison incluse · Sans engagement
            </p>

          </div>
        )}

      </section>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  )
}
