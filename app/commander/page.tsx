"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Menu } from "@/lib/data";
import { fetchMenusSemaineCourante, fetchMenusSemaineSuivante, fetchTarifs, Tarif, getTarifUnitaire, getTarifPrecommande, fetchPointsLivraison, PointLivraisonDB, fetchSlotsUnite, SlotUnite, getDisponible, getSemainesDisponibles, fetchPointsLivraisonClient } from "@/lib/menus";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { ClientPoint } from "@/types";
import { formatPrice } from "@/lib/utils";

type Variante = "plat" | "plat_vege";

interface CartItem {
  menuId: string;
  variante: Variante;
  quantite: number;
}


function CommanderContent() {
  const searchParams = useSearchParams();
  const [semaines, setSemaines] = useState<ReturnType<typeof getSemainesDisponibles> | null>(null);

  useEffect(() => {
    setSemaines(getSemainesDisponibles());
  }, []);

  const semaineCourante = semaines?.semaineCourante;
  const semaineSuivante = semaines?.semaineSuivante;
  const deadlinePrecommande = semaines?.deadlinePrecommande;

  const [semaineKey, setSemaineKey] = useState<"courante" | "suivante" | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [menusCurrentWeek, setMenusCurrentWeek] = useState<Menu[]>([]);
  const [menusNextWeek, setMenusNextWeek] = useState<Menu[]>([]);
  const [tarifs, setTarifs] = useState<Tarif[]>([]);
  const [points, setPoints] = useState<PointLivraisonDB[]>([]);
  const [slots, setSlots] = useState<SlotUnite[]>([]);
  const [mesPoints, setMesPoints] = useState<ClientPoint[]>([]);
  const [pointMode, setPointMode] = useState<'saved' | 'new'>('saved');

  const [hopital, setHopital] = useState("");
  const [batiment, setBatiment] = useState("");
  const [service, setService] = useState("");
  const [sessionLoaded, setSessionLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedCart = sessionStorage.getItem('clodia-cart');
      if (savedCart) setCart(JSON.parse(savedCart));
      setHopital(sessionStorage.getItem('clodia-hopital') ?? '');
      setBatiment(sessionStorage.getItem('clodia-batiment') ?? '');
      setService(sessionStorage.getItem('clodia-service') ?? '');
    } catch {}
    setSessionLoaded(true);
  }, []);

  useEffect(() => {
    if (!sessionLoaded) return
    try {
      sessionStorage.setItem('clodia-cart', JSON.stringify(cart));
    } catch {
      // sessionStorage indisponible
    }
  }, [cart, sessionLoaded]);

  useEffect(() => {
    if (!sessionLoaded) return
    try {
      sessionStorage.setItem('clodia-hopital', hopital);
      sessionStorage.setItem('clodia-batiment', batiment);
      sessionStorage.setItem('clodia-service', service);
    } catch {}
  }, [hopital, batiment, service, sessionLoaded]);

  useEffect(() => {
    async function init() {
      fetchMenusSemaineCourante().then(setMenusCurrentWeek);
      fetchMenusSemaineSuivante().then(setMenusNextWeek);
      fetchTarifs().then(setTarifs);
      await fetchPointsLivraison().then(setPoints);

      const supabaseBrowser = createSupabaseBrowserClient()
      const { data: { session } } = await supabaseBrowser.auth.getSession()

      if (session) {
        const { data: clientData } = await supabaseBrowser
          .from('clients')
          .select('id, prenom, nom, email, telephone')
          .eq('user_id', session.user.id)
          .single()

        if (clientData) {
          const clientPoints = await fetchPointsLivraisonClient(clientData.id, supabaseBrowser)
          setMesPoints(clientPoints)

          // Pré-remplir avec le point par défaut si rien dans sessionStorage
          if (clientPoints.length > 0) {
            const defaut = clientPoints.find((p: ClientPoint) => p.est_defaut)
            if (defaut?.points_livraison) {
              const pl = defaut.points_livraison
              setHopital(pl.hopital ?? '')
              setBatiment(pl.batiment ?? '')
              setService(pl.service ?? '')
              sessionStorage.setItem('clodia-hopital', pl.hopital ?? '')
              sessionStorage.setItem('clodia-batiment', pl.batiment ?? '')
              sessionStorage.setItem('clodia-service', pl.service ?? '')
              sessionStorage.setItem('clodia-point', JSON.stringify(pl))
            }
          }
        }
      }
    }
    init()
  }, []);

  useEffect(() => {
    if (menusCurrentWeek.length === 0) return;
    const dates = menusCurrentWeek.map(m => m.date_livraison);
    fetchSlotsUnite(dates).then(setSlots);
  }, [menusCurrentWeek]);

  useEffect(() => {
    const semaineParam = searchParams.get("semaine");
    if (semaineParam === "courante" || semaineParam === "suivante") {
      setSemaineKey(semaineParam);
    }

    const pointParam = searchParams.get("point");
    if (pointParam) {
      const found = points.find((p) => p.id === pointParam);
      if (found) {
        setHopital(found.hopital);
        setBatiment(found.batiment);
        setService(found.service);
      }
    }
  }, [searchParams, points]);

  const hopitaux = [...new Set(points.map((p) => p.hopital))];

  function getBatiments(h: string) {
    return [...new Set(points.filter((p) => p.hopital === h).map((p) => p.batiment))];
  }

  function getServices(h: string, b: string) {
    return points.filter((p) => p.hopital === h && p.batiment === b);
  }

  const SEMAINES = [
    { key: "courante" as const, label: "Semaine en cours", menus: menusCurrentWeek },
    { key: "suivante" as const, label: "Semaine suivante", menus: menusNextWeek },
  ];

  const selectedPoint = points.find(
    (p) => p.hopital === hopital && p.batiment === batiment && p.service === service
  );

  useEffect(() => {
    try {
      if (selectedPoint) {
        sessionStorage.setItem('clodia-point', JSON.stringify(selectedPoint));
      } else {
        sessionStorage.removeItem('clodia-point');
      }
    } catch {}
  }, [selectedPoint]);

  function handleHopitalChange(val: string) {
    setHopital(val);
    setBatiment("");
    setService("");
  }

  function handleBatimentChange(val: string) {
    setBatiment(val);
    setService("");
  }

  const currentMenus = semaineKey ? SEMAINES.find((s) => s.key === semaineKey)?.menus ?? [] : [];

  function getSlotDispo(date_livraison: string, variante: string): number | null {
    if (semaineKey !== 'courante') return null;
    const slotVariante = variante === 'plat_vege' ? 'vegetarien' : 'standard';
    const slot = slots.find(s => s.date_livraison === date_livraison && s.variante === slotVariante);
    if (!slot) return null;
    return getDisponible(slot);
  }

  function getCartItem(menuId: string, variante?: Variante) {
    if (variante) return cart.find((c) => c.menuId === menuId && c.variante === variante) ?? null;
    return cart.find((c) => c.menuId === menuId) ?? null;
  }

  function updateCart(menuId: string, variante: Variante, delta: number) {
    const menu = [...menusCurrentWeek, ...menusNextWeek].find(m => m.id === menuId);
    setCart((prev) => {
      if (delta > 0 && menu) {
        const dispo = getSlotDispo(menu.date_livraison, variante);
        if (dispo !== null) {
          const currentQty = prev.find(c => c.menuId === menuId && c.variante === variante)?.quantite ?? 0;
          if (currentQty + delta > dispo) return prev;
        }
      }
      const existing = prev.find((c) => c.menuId === menuId && c.variante === variante);
      if (!existing) {
        if (delta <= 0) return prev;
        return [...prev, { menuId, variante, quantite: delta }];
      }
      const newQty = existing.quantite + delta;
      if (newQty <= 0) return prev.filter((c) => !(c.menuId === menuId && c.variante === variante));
      return prev.map((c) =>
        c.menuId === menuId && c.variante === variante ? { ...c, quantite: newQty } : c
      );
    });
  }

  const allMenus = [...menusCurrentWeek, ...menusNextWeek];

  const qtePrecommande = cart
    .filter(item => menusNextWeek.some(m => m.id === item.menuId))
    .reduce((a, c) => a + c.quantite, 0)

  const prixUnite = getTarifUnitaire(tarifs)

  const total = cart.reduce((acc, item) => {
    const menu = allMenus.find((m) => m.id === item.menuId)
    if (!menu) return acc
    const isPrecommande = menusNextWeek.some(m => m.id === item.menuId)
    const prix = isPrecommande
      ? getTarifPrecommande(tarifs, qtePrecommande)
      : prixUnite
    return acc + prix * item.quantite
  }, 0)

  // Garder quantiteTotale pour l'affichage du compteur de repas
  const quantiteTotale = cart.reduce((a, c) => a + c.quantite, 0)

  // Adapter getPrixUnitaire pour l'affichage sur les cards
  function getPrixUnitaire(semaine: string | null): number {
    if (semaine === 'suivante') return getTarifPrecommande(tarifs, qtePrecommande)
    return prixUnite
  }

  const cartWithMenus = cart
    .map((item) => ({
      ...item,
      menu: allMenus.find((m) => m.id === item.menuId)!,
    }))
    .filter((item) => item.menu);


  return (
    <div style={{ background: "#FAFAF8", minHeight: "100vh" }}>
      <style>{`
        .semaine-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }
        .semaine-btn:active {
          transform: translateY(0px);
        }
      `}</style>
      {/* Header de page */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px 32px" }}
        className="grid grid-cols-1 md:grid-cols-2 md:gap-16 items-center">
        {/* Colonne gauche — titre */}
        <h1 style={{
          fontSize: "clamp(36px, 5vw, 64px)",
          fontWeight: 600, color: "#1A1A1A",
          lineHeight: 1.1, letterSpacing: "-0.025em",
          textTransform: "uppercase", margin: 0,
        }}>
          Commander<br />
          <span style={{ color: "#FD3D6B" }}>Vos Menus</span>
        </h1>

        {/* Colonne droite — texte + bouton */}
        <div>
          <p style={{
            fontSize: "15px", color: "#6B6B6B",
            lineHeight: 1.75, margin: "0 0 20px",
          }}>
            Première visite ? Avant de commander, découvrez nos formules pour comprendre
            la différence entre la pré-commande pour la semaine suivante et la commande
            pour la semaine en cours — tarifs, disponibilités et avantages.
          </p>
          <Link href="/formules" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "transparent", color: "#1A1A1A",
            fontSize: "14px", fontWeight: 600,
            padding: "12px 24px", borderRadius: "999px",
            textDecoration: "none", border: "1px solid #E8E3D8",
          }}>
            Découvrir les formules →
          </Link>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Colonne principale */}
          <div className="flex-1">
            {/* Sélecteur de mode — 2 grands boutons côte à côte */}
            <div className="grid grid-cols-2 gap-4 mb-8">

              {/* Bouton Pré-commande */}
              <button
                onClick={() => setSemaineKey("suivante")}
                className="semaine-btn text-left rounded-2xl p-4 md:p-6 border-2 transition-all"
                style={{
                  borderColor: semaineKey === "suivante" ? "#00CCCC" : "#E8E3D8",
                  background: semaineKey === "suivante" ? "#E8FFF8" : "#fff",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <p style={{
                  fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em",
                  textTransform: "uppercase", color: "#00CCCC", marginBottom: "8px",
                }}>
                  Avant le {deadlinePrecommande?.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) ?? ''} à 23h59
                </p>
                <p style={{
                  fontSize: "18px", fontWeight: 600, color: "#1A1A1A",
                  marginBottom: "16px", lineHeight: 1.2,
                }}>
                  Pré-commander du {new Date(semaineSuivante?.lundi ?? '').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} au {new Date(semaineSuivante?.vendredi ?? '').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                </p>
                <div className="flex flex-col gap-2">
                  <span className="flex items-center gap-2 text-sm text-gray-600">
                    <i className="ti ti-check" style={{ color: "#00CCCC", fontSize: 16 }} />
                    Disponibilité garantie
                  </span>
                  <span className="flex items-center gap-2 text-sm text-gray-600">
                    <i className="ti ti-tag" style={{ color: "#00CCCC", fontSize: 16 }} />
                    Tarifs préférentiels
                  </span>
                </div>
              </button>

              {/* Bouton Semaine en cours */}
              <button
                onClick={() => setSemaineKey("courante")}
                className="semaine-btn text-left rounded-2xl p-4 md:p-6 border-2 transition-all"
                style={{
                  borderColor: semaineKey === "courante" ? "#C4704F" : "#E8E3D8",
                  background: semaineKey === "courante" ? "#F5F0E8" : "#fff",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <p style={{
                  fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em",
                  textTransform: "uppercase", color: "#C4704F", marginBottom: "8px",
                }}>
                  Avant minuit la veille
                </p>
                <p style={{
                  fontSize: "18px", fontWeight: 600, color: "#1A1A1A",
                  marginBottom: "16px", lineHeight: 1.2,
                }}>
                  Commander du {new Date(semaineCourante?.lundi ?? '').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} au {new Date(semaineCourante?.vendredi ?? '').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                </p>
                <div className="flex flex-col gap-2">
                  <span className="flex items-center gap-2 text-sm text-gray-600">
                    <i className="ti ti-alert-triangle" style={{ color: "#FF9933", fontSize: 16 }} />
                    Selon disponibilités
                  </span>
                  <span className="flex items-center gap-2 text-sm text-gray-600">
                    <i className="ti ti-coin" style={{ color: "#C4704F", fontSize: 16 }} />
                    Tarif unique {formatPrice(getTarifUnitaire(tarifs))}
                  </span>
                </div>
              </button>

            </div>

            {/* Menus — affichés seulement si une semaine est sélectionnée */}
            {semaineKey && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentMenus.map((menu) => {
                const itemPlat = getCartItem(menu.id, "plat");
                const itemVege = getCartItem(menu.id, "plat_vege");
                const inCart = itemPlat !== null || itemVege !== null;
                const dispoPlat = getSlotDispo(menu.date_livraison, 'plat');
                const dispoVege = getSlotDispo(menu.date_livraison, 'plat_vege');
                const platComplet = dispoPlat !== null && dispoPlat === 0;
                const vegeComplet = dispoVege !== null && dispoVege === 0;
                const aPlatStandard = !!menu.plat && menu.plat.trim() !== '';
                const aPlatVege = !!menu.plat_vege && menu.plat_vege.trim() !== '';

                return (
                  <div
                    key={menu.id}
                    className={`bg-white rounded-2xl overflow-hidden border transition-all flex flex-col ${
                      inCart
                        ? "border-[#FD3D6B] shadow-md"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={menu.photo}
                        alt={menu.plat}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute top-3 left-3">
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          backgroundColor: "rgba(255,255,255,0.95)",
                          color: "#1A1A1A",
                          fontSize: "12px",
                          fontWeight: 600,
                          padding: "4px 12px",
                          borderRadius: "999px",
                          whiteSpace: "nowrap",
                          letterSpacing: "0.01em",
                        }}>
                          {menu.jourSemaine} {menu.date}
                        </span>
                      </div>
                      {inCart && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-[#FD3D6B] text-white text-xs font-semibold px-3 py-1 rounded-full">
                            Dans le panier
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      {/* Boutons variante */}
                      <div className="flex gap-2 mb-3">
                        {aPlatStandard && (
                          <button
                            disabled={platComplet}
                            onClick={() => {
                              if (platComplet) return;
                              if (!itemPlat) updateCart(menu.id, "plat", 1);
                            }}
                            className={`flex-1 text-xs font-medium py-2 rounded-xl border transition-colors ${
                              platComplet
                                ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                                : itemPlat !== null
                                ? "border-[#4D0F1F] bg-[#4D0F1F] text-white"
                                : "border-gray-200 text-gray-400 hover:border-gray-300"
                            }`}
                          >
                            {dispoPlat !== null ? `🍖 Plat (${dispoPlat} dispo)` : "🍖 Plat"}
                          </button>
                        )}
                        {aPlatVege && (
                          <button
                            disabled={vegeComplet}
                            onClick={() => {
                              if (vegeComplet) return;
                              if (!itemVege) updateCart(menu.id, "plat_vege", 1);
                            }}
                            className={`flex-1 text-xs font-medium py-2 rounded-xl border transition-colors ${
                              vegeComplet
                                ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                                : itemVege !== null
                                ? "border-[#00CCCC] bg-[#00CCCC] text-white"
                                : "border-gray-200 text-gray-400 hover:border-gray-300"
                            }`}
                          >
                            {dispoVege !== null ? `🌿 Végé (${dispoVege} dispo)` : "🌿 Végé"}
                          </button>
                        )}
                      </div>

                      {/* Descriptif — hauteur fixe 3 lignes */}
                      <div style={{ height: "72px", overflow: "hidden", marginBottom: "12px" }}>
                        <h3 className="font-semibold text-[#4D0F1F] text-sm mb-1 line-clamp-2">
                          {aPlatStandard ? menu.plat : menu.plat_vege}
                        </h3>
                        <p className="text-xs text-gray-400">+ {menu.dessert}</p>
                      </div>

                      {/* Prix + bouton — toujours alignés */}
                      <div className="flex items-center justify-between">
                        <span className="text-[#FF9933] font-semibold">
                          {formatPrice(getPrixUnitaire(semaineKey))}
                        </span>
                        {!inCart ? (
                          <button
                            onClick={() => updateCart(menu.id, aPlatStandard ? "plat" : "plat_vege", 1)}
                            className="bg-[#FD3D6B] text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#e8345e] transition-colors"
                          >
                            + Ajouter
                          </button>
                        ) : (
                          <div className="flex flex-col gap-1.5">
                            {itemPlat && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400 w-8">Plat</span>
                                <button onClick={() => updateCart(menu.id, "plat", -1)} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-xs">−</button>
                                <span className="font-semibold text-[#4D0F1F] w-4 text-center text-sm">{itemPlat.quantite}</span>
                                <button onClick={() => updateCart(menu.id, "plat", 1)} className="w-7 h-7 rounded-full bg-[#4D0F1F] flex items-center justify-center text-white hover:bg-[#3a0b17] transition-colors text-xs">+</button>
                              </div>
                            )}
                            {itemVege && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400 w-8">Végé</span>
                                <button onClick={() => updateCart(menu.id, "plat_vege", -1)} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-xs">−</button>
                                <span className="font-semibold text-[#4D0F1F] w-4 text-center text-sm">{itemVege.quantite}</span>
                                <button onClick={() => updateCart(menu.id, "plat_vege", 1)} className="w-7 h-7 rounded-full bg-[#00CCCC] flex items-center justify-center text-white hover:bg-[#00aaaa] transition-colors text-xs">+</button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    </div>
                );
              })}
            </div>
            )}
          </div>

          {/* Récapitulatif */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="sticky top-24">
              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                <div className="bg-[#4D0F1F] px-5 py-4">
                  <h2 className="text-white font-semibold">Votre panier</h2>
                  {cart.length > 0 && (
                    <p className="text-white/60 text-xs mt-1">
                      {cart.reduce((a, c) => a + c.quantite, 0)} repas sélectionné
                      {cart.reduce((a, c) => a + c.quantite, 0) > 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                <div className="p-5">
                  {cart.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-6">
                      Aucun repas sélectionné
                    </p>
                  ) : (
                    <>
                      <div className="flex flex-col mb-5">
                        {(() => {
                          const itemsPrecommande = cartWithMenus.filter(item =>
                            menusNextWeek.some(m => m.id === item.menuId)
                          )
                          const itemsCourante = cartWithMenus.filter(item =>
                            menusCurrentWeek.some(m => m.id === item.menuId)
                          )
                          const prixUnite = getTarifUnitaire(tarifs)
                          const qtePrecommande = itemsPrecommande.reduce((a, c) => a + c.quantite, 0)

                          return (
                            <>
                              {/* Section pré-commande */}
                              {itemsPrecommande.length > 0 && (
                                <div className="mb-4">
                                  <p className="text-xs font-semibold uppercase tracking-widest text-[#00CCCC] mb-3">
                                    Pré-commande
                                  </p>
                                  <div className="flex flex-col gap-3">
                                    {itemsPrecommande.map((item) => {
                                      const prixPlat = getTarifPrecommande(tarifs, qtePrecommande)
                                      return (
                                        <div key={item.menuId} className="flex items-start justify-between gap-2">
                                          <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-[#4D0F1F] leading-snug">
                                              {item.menu.jourSemaine}{" "}
                                              <span className="text-gray-400">{item.menu.date}</span>
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                              {item.variante === "plat" ? "Plat standard" : "Plat végétarien"}
                                            </p>
                                          </div>
                                          <div className="flex items-center gap-1.5 shrink-0">
                                            <button
                                              onClick={() => updateCart(item.menuId, item.variante, -1)}
                                              className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-xs"
                                            >
                                              {item.quantite === 1 ? "×" : "−"}
                                            </button>
                                            <span className="text-xs font-semibold text-[#4D0F1F] w-4 text-center">
                                              {item.quantite}
                                            </span>
                                            <button
                                              onClick={() => {
                                                const dispo = getSlotDispo(item.menu.date_livraison, item.variante)
                                                if (dispo !== null && item.quantite >= dispo) return
                                                updateCart(item.menuId, item.variante, 1)
                                              }}
                                              className="w-6 h-6 rounded-full bg-[#4D0F1F] flex items-center justify-center text-white hover:bg-[#3a0b17] transition-colors text-xs"
                                            >
                                              +
                                            </button>
                                            <span className="text-xs font-semibold text-[#4D0F1F] ml-1">
                                              {formatPrice(prixPlat * item.quantite)}
                                            </span>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                  <div className="mt-3 pt-3 border-t border-[#00CCCC]/20 flex flex-col gap-1">
                                    <div className="flex justify-between text-xs text-gray-500">
                                      <span>Prix unitaire</span>
                                      <span>{formatPrice(getTarifPrecommande(tarifs, qtePrecommande))}</span>
                                    </div>
                                    {(prixUnite - getTarifPrecommande(tarifs, qtePrecommande)) * qtePrecommande > 0 && (
                                      <div className="flex justify-between text-xs text-[#00CCCC] font-medium">
                                        <span>Économie réalisée</span>
                                        <span>- {formatPrice((prixUnite - getTarifPrecommande(tarifs, qtePrecommande)) * qtePrecommande)}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Séparateur si les deux sections sont présentes */}
                              {itemsPrecommande.length > 0 && itemsCourante.length > 0 && (
                                <div className="border-t border-gray-100 my-3" />
                              )}

                              {/* Section semaine en cours */}
                              {itemsCourante.length > 0 && (
                                <div className="mb-4">
                                  <p className="text-xs font-semibold uppercase tracking-widest text-[#C4704F] mb-3">
                                    Semaine en cours
                                  </p>
                                  <div className="flex flex-col gap-3">
                                    {itemsCourante.map((item) => (
                                      <div key={item.menuId} className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs font-medium text-[#4D0F1F] leading-snug">
                                            {item.menu.jourSemaine}{" "}
                                            <span className="text-gray-400">{item.menu.date}</span>
                                          </p>
                                          <p className="text-xs text-gray-400 mt-0.5">
                                            {item.variante === "plat" ? "Plat standard" : "Plat végétarien"}
                                          </p>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                          <button
                                            onClick={() => updateCart(item.menuId, item.variante, -1)}
                                            className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-xs"
                                          >
                                            {item.quantite === 1 ? "×" : "−"}
                                          </button>
                                          <span className="text-xs font-semibold text-[#4D0F1F] w-4 text-center">
                                            {item.quantite}
                                          </span>
                                          <button
                                            onClick={() => {
                                              const dispo = getSlotDispo(item.menu.date_livraison, item.variante)
                                              if (dispo !== null && item.quantite >= dispo) return
                                              updateCart(item.menuId, item.variante, 1)
                                            }}
                                            className="w-6 h-6 rounded-full bg-[#4D0F1F] flex items-center justify-center text-white hover:bg-[#3a0b17] transition-colors text-xs"
                                          >
                                            +
                                          </button>
                                          <span className="text-xs font-semibold text-[#4D0F1F] ml-1">
                                            {formatPrice(prixUnite * item.quantite)}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="mt-3 pt-3 border-t border-[#C4704F]/20">
                                    <div className="flex justify-between text-xs text-gray-500">
                                      <span>Prix unitaire</span>
                                      <span>{formatPrice(prixUnite)}</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </>
                          )
                        })()}
                      </div>

                      <div className="border-t border-gray-100 pt-4 mb-5">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-[#4D0F1F]">Total</span>
                          <span className="text-[#FF9933] font-semibold text-lg">
                            {formatPrice(total)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Livraison incluse</p>
                      </div>
                    </>
                  )}

                  {/* Point de livraison */}
                  <div className="mb-5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-3">
                      Point de livraison
                    </label>

                    {/* Frigidaires enregistrés */}
                    {mesPoints.length > 0 && pointMode === 'saved' && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "8px" }}>
                        {mesPoints.filter((cp: ClientPoint) => cp.est_defaut).map(cp => (
                          <button
                            key={cp.id}
                            style={{
                              display: "flex", alignItems: "center", gap: "8px",
                              padding: "8px 12px", borderRadius: "10px", textAlign: "left",
                              border: `2px solid #FD3D6B`,
                              background: "#FFF0F3",
                              cursor: "default", width: "100%",
                            }}
                          >
                            <div style={{
                              width: 14, height: 14, borderRadius: "50%", flexShrink: 0,
                              border: `2px solid #FD3D6B`,
                              background: "#FD3D6B",
                            }} />
                            <div>
                              <p style={{ fontSize: "12px", fontWeight: 600, color: "#1A1A1A" }}>
                                {cp.points_livraison.service}
                                <span style={{ fontSize: "10px", color: "#00CCCC", marginLeft: "6px" }}>Par défaut</span>
                              </p>
                              <p style={{ fontSize: "11px", color: "#6B6B6B" }}>{cp.points_livraison.hopital} · {cp.points_livraison.batiment}</p>
                              {cp.points_livraison.service_desc && (
                                <p style={{ fontSize: "11px", color: "#00CCCC", marginTop: "2px" }}>{cp.points_livraison.service_desc}</p>
                              )}
                            </div>
                          </button>
                        ))}
                        <button
                          onClick={() => setPointMode('new')}
                          className="text-xs text-[#007FFF] font-semibold text-left mt-1"
                          style={{ background: "none", border: "none", cursor: "pointer" }}
                        >
                          + Choisir un autre frigidaire
                        </button>
                      </div>
                    )}

                    {/* Cascade classique */}
                    {(mesPoints.length === 0 || pointMode === 'new') && (
                      <>
                        {pointMode === 'new' && mesPoints.length > 0 && (
                          <>
                            <button
                              onClick={() => {
                                setPointMode('saved')
                                const defaut = mesPoints.find((p: ClientPoint) => p.est_defaut)
                                if (defaut?.points_livraison) {
                                  const pl = defaut.points_livraison
                                  setHopital(pl.hopital)
                                  setBatiment(pl.batiment)
                                  setService(pl.service)
                                }
                              }}
                              className="text-xs text-[#007FFF] font-semibold mb-3 block"
                              style={{ background: "none", border: "none", cursor: "pointer" }}
                            >
                              ← Retour au frigidaire par défaut
                            </button>

                            {mesPoints.filter((cp: ClientPoint) => !cp.est_defaut).length > 0 && (
                              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
                                <p style={{ fontSize: "11px", color: "#9B9B9B", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
                                  Mes autres frigidaires
                                </p>
                                {mesPoints.filter((cp: ClientPoint) => !cp.est_defaut).map(cp => (
                                  <button
                                    key={cp.id}
                                    onClick={() => {
                                      const pl = cp.points_livraison
                                      setHopital(pl.hopital)
                                      setBatiment(pl.batiment)
                                      setService(pl.service)
                                    }}
                                    style={{
                                      display: "flex", alignItems: "center", gap: "8px",
                                      padding: "8px 12px", borderRadius: "10px", textAlign: "left",
                                      border: `2px solid ${selectedPoint?.id === cp.points_livraison.id ? "#FD3D6B" : "#E8E3D8"}`,
                                      background: selectedPoint?.id === cp.points_livraison.id ? "#FFF0F3" : "#fff",
                                      cursor: "pointer", width: "100%",
                                    }}
                                  >
                                    <div style={{
                                      width: 14, height: 14, borderRadius: "50%", flexShrink: 0,
                                      border: `2px solid ${selectedPoint?.id === cp.points_livraison.id ? "#FD3D6B" : "#E8E3D8"}`,
                                      background: selectedPoint?.id === cp.points_livraison.id ? "#FD3D6B" : "#fff",
                                    }} />
                                    <div>
                                      <p style={{ fontSize: "12px", fontWeight: 600, color: "#1A1A1A" }}>{cp.points_livraison.service}</p>
                                      <p style={{ fontSize: "11px", color: "#6B6B6B" }}>{cp.points_livraison.hopital} · {cp.points_livraison.batiment}</p>
                                      {cp.points_livraison.service_desc && (
                                        <p style={{ fontSize: "11px", color: "#00CCCC", marginTop: "2px" }}>{cp.points_livraison.service_desc}</p>
                                      )}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                        <div className="flex flex-col gap-2">
                          <select
                            value={hopital}
                            onChange={(e) => handleHopitalChange(e.target.value)}
                            className="w-full text-sm bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-[#4D0F1F] focus:outline-none focus:border-[#FD3D6B]"
                          >
                            <option value="">Hôpital…</option>
                            {hopitaux.map((h) => (
                              <option key={h} value={h}>{h}</option>
                            ))}
                          </select>
                          <select
                            value={batiment}
                            onChange={(e) => handleBatimentChange(e.target.value)}
                            disabled={!hopital}
                            className="w-full text-sm bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-[#4D0F1F] focus:outline-none focus:border-[#FD3D6B] disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <option value="">Bâtiment…</option>
                            {getBatiments(hopital).map((b) => (
                              <option key={b} value={b}>{b}</option>
                            ))}
                          </select>
                          <select
                            value={service}
                            onChange={(e) => setService(e.target.value)}
                            disabled={!batiment}
                            className="w-full text-sm bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-[#4D0F1F] focus:outline-none focus:border-[#FD3D6B] disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <option value="">Service…</option>
                            {getServices(hopital, batiment).map((p) => (
                              <option key={p.service} value={p.service}>{p.service}</option>
                            ))}
                          </select>
                        </div>
                        {selectedPoint && (
                          <p className="text-xs text-[#00CCCC] mt-2 leading-relaxed">
                            {selectedPoint.service_desc}
                          </p>
                        )}
                      </>
                    )}

                  </div>

                  <button
                    onClick={() => window.location.href = '/checkout'}
                    disabled={cart.length === 0 || !selectedPoint}
                    className={`w-full py-4 rounded-full text-sm font-semibold transition-colors ${
                      cart.length > 0 && selectedPoint
                        ? "bg-[#FD3D6B] text-white hover:bg-[#e8345e] cursor-pointer"
                        : "bg-gray-100 text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    {cart.length === 0
                      ? "Sélectionnez un repas"
                      : !selectedPoint
                      ? "Sélectionnez un point de livraison"
                      : "Procéder au paiement →"}
                  </button>

                  <p className="text-xs text-gray-400 text-center mt-3">
                    Paiement sécurisé Stripe · Commande avant 22h
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CommanderPage() {
  return (
    <Suspense fallback={null}>
      <CommanderContent />
    </Suspense>
  );
}
