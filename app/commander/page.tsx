"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Menu } from "@/lib/data";
import { fetchMenusSemaineCourante, fetchMenusSemaineSuivante, fetchTarifs, Tarif, getTarifUnitaire, getTarifPrecommande, fetchPointsLivraison, PointLivraisonDB, fetchSlotsUnite, SlotUnite, getDisponible } from "@/lib/menus";

type Variante = "plat" | "plat_vege";

interface CartItem {
  menuId: string;
  variante: Variante;
  quantite: number;
}

function formatPrice(p: number) {
  return p.toFixed(2).replace(".", ",") + " €";
}

function CommanderContent() {
  const searchParams = useSearchParams();

  const [semaineKey, setSemaineKey] = useState<"courante" | "suivante">("courante");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [menusCurrentWeek, setMenusCurrentWeek] = useState<Menu[]>([]);
  const [menusNextWeek, setMenusNextWeek] = useState<Menu[]>([]);
  const [tarifs, setTarifs] = useState<Tarif[]>([]);
  const [points, setPoints] = useState<PointLivraisonDB[]>([]);
  const [slots, setSlots] = useState<SlotUnite[]>([]);

  const [hopital, setHopital] = useState("");
  const [batiment, setBatiment] = useState("");
  const [service, setService] = useState("");

  useEffect(() => {
    fetchMenusSemaineCourante().then(setMenusCurrentWeek);
    fetchMenusSemaineSuivante().then(setMenusNextWeek);
    fetchTarifs().then(setTarifs);
    fetchPointsLivraison().then(setPoints);
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

  function handleHopitalChange(val: string) {
    setHopital(val);
    setBatiment("");
    setService("");
  }

  function handleBatimentChange(val: string) {
    setBatiment(val);
    setService("");
  }

  const currentMenus = SEMAINES.find((s) => s.key === semaineKey)!.menus;

  function getSlotDispo(date_livraison: string, variante: string): number | null {
    if (semaineKey !== 'courante') return null;
    const slotVariante = variante === 'plat_vege' ? 'vegetarien' : 'standard';
    const slot = slots.find(s => s.date_livraison === date_livraison && s.variante === slotVariante);
    if (!slot) return null;
    return getDisponible(slot);
  }

  function getCartItem(menuId: string) {
    return cart.find((c) => c.menuId === menuId) ?? null;
  }

  function updateCart(menuId: string, variante: Variante, delta: number) {
    const menu = [...menusCurrentWeek, ...menusNextWeek].find(m => m.id === menuId);
    setCart((prev) => {
      if (delta > 0 && menu) {
        const dispo = getSlotDispo(menu.date_livraison, variante);
        if (dispo !== null) {
          const currentQty = prev.find(c => c.menuId === menuId)?.quantite ?? 0;
          if (currentQty + delta > dispo) return prev;
        }
      }
      const existing = prev.find((c) => c.menuId === menuId);
      if (!existing) {
        if (delta <= 0) return prev;
        return [...prev, { menuId, variante, quantite: delta }];
      }
      const newQty = existing.quantite + delta;
      if (newQty <= 0) return prev.filter((c) => c.menuId !== menuId);
      return prev.map((c) =>
        c.menuId === menuId ? { ...c, variante, quantite: newQty } : c
      );
    });
  }

  function setVariante(menuId: string, variante: Variante) {
    setCart((prev) =>
      prev.map((c) => (c.menuId === menuId ? { ...c, variante } : c))
    );
  }

  const quantiteTotale = cart.reduce((a, c) => a + c.quantite, 0);

  function getPrixUnitaire(semaine: string, qte: number): number {
    if (semaine === 'suivante') return getTarifPrecommande(tarifs, qte);
    return getTarifUnitaire(tarifs);
  }

  const allMenus = [...menusCurrentWeek, ...menusNextWeek];
  const total = cart.reduce((acc, item) => {
    const menu = allMenus.find((m) => m.id === item.menuId);
    return acc + (menu ? getPrixUnitaire(semaineKey, quantiteTotale) * item.quantite : 0);
  }, 0);

  const cartWithMenus = cart
    .map((item) => ({
      ...item,
      menu: allMenus.find((m) => m.id === item.menuId)!,
    }))
    .filter((item) => item.menu);

  function handlePay() {
    alert(
      "Paiement Stripe bientôt disponible ! Votre panier :\n" +
        cartWithMenus
          .map(
            (i) =>
              `• ${i.menu.jourSemaine} ${i.menu.date} — ${
                i.variante === "plat" ? "Plat traditionnel" : "Végétarien"
              } × ${i.quantite} = ${formatPrice(getPrixUnitaire(semaineKey, quantiteTotale) * i.quantite)}`
          )
          .join("\n") +
        `\n\nTotal : ${formatPrice(total)}`
    );
  }

  return (
    <div style={{ background: "#FAFAF8", minHeight: "100vh" }}>
      {/* Header de page */}
      <section style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "72px 48px 56px",
      }}>
        <p style={{
          fontSize: "11px", fontWeight: 600, letterSpacing: "0.14em",
          textTransform: "uppercase", color: "#FD3D6B", marginBottom: "16px",
        }}>
          Réservez votre repas
        </p>
        <h1 style={{
          fontSize: "clamp(36px, 5vw, 64px)",
          fontWeight: 600, color: "#1A1A1A",
          lineHeight: 1.1, letterSpacing: "-0.025em",
          textTransform: "uppercase", margin: "0 0 16px",
        }}>
          Commander<br />
          <span style={{ color: "#FD3D6B" }}>Vos Menus.</span>
        </h1>
        <p style={{
          fontSize: "16px", color: "#6B6B6B",
          lineHeight: 1.75, maxWidth: "520px", margin: 0,
        }}>
          Choisissez vos menus, sélectionnez votre variante et votre point de livraison.
          Commandez avant 22h pour une livraison le lendemain avant 12h.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Colonne principale */}
          <div className="flex-1">
            {/* Onglets semaines */}
            <div className="flex gap-2 mb-5">
              {SEMAINES.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSemaineKey(s.key)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                    semaineKey === s.key
                      ? "bg-[#4D0F1F] text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Grille menus */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentMenus.map((menu) => {
                const item = getCartItem(menu.id);
                const inCart = item !== null;

                return (
                  <div
                    key={menu.id}
                    className={`bg-white rounded-2xl overflow-hidden border transition-all ${
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
                        <span className="bg-[#EAFF33] text-[#4D0F1F] text-xs font-semibold px-3 py-1 rounded-full">
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
                      {/* Variante selector */}
                      {(() => {
                        const dispoPlat = getSlotDispo(menu.date_livraison, 'plat');
                        const dispoVege = getSlotDispo(menu.date_livraison, 'plat_vege');
                        const platComplet = dispoPlat !== null && dispoPlat === 0;
                        const vegeComplet = dispoVege !== null && dispoVege === 0;
                        return (
                          <div className="flex gap-2 mb-3">
                            <button
                              disabled={platComplet}
                              onClick={() => {
                                if (platComplet) return;
                                if (inCart) setVariante(menu.id, "plat");
                                else updateCart(menu.id, "plat", 1);
                              }}
                              className={`flex-1 text-xs font-medium py-2 rounded-xl border transition-colors ${
                                platComplet
                                  ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                                  : !inCart || item?.variante === "plat"
                                  ? "border-[#4D0F1F] bg-[#4D0F1F] text-white"
                                  : "border-gray-200 text-gray-400 hover:border-gray-300"
                              }`}
                            >
                              {dispoPlat !== null ? `🍖 Plat (${dispoPlat} dispo)` : "🍖 Plat"}
                            </button>
                            <button
                              disabled={vegeComplet}
                              onClick={() => {
                                if (vegeComplet) return;
                                if (inCart) setVariante(menu.id, "plat_vege");
                                else updateCart(menu.id, "plat_vege", 1);
                              }}
                              className={`flex-1 text-xs font-medium py-2 rounded-xl border transition-colors ${
                                vegeComplet
                                  ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                                  : inCart && item?.variante === "plat_vege"
                                  ? "border-[#00CCCC] bg-[#00CCCC] text-white"
                                  : "border-gray-200 text-gray-400 hover:border-gray-300"
                              }`}
                            >
                              {dispoVege !== null ? `🌿 Végé (${dispoVege} dispo)` : "🌿 Végé"}
                            </button>
                          </div>
                        );
                      })()}

                      <h3 className="font-semibold text-[#4D0F1F] text-sm mb-1">
                        {inCart && item?.variante === "plat_vege"
                          ? menu.plat_vege
                          : menu.plat}
                      </h3>
                      <p className="text-xs text-gray-400 mb-4">+ {menu.dessert}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-[#FF9933] font-semibold">
                          {formatPrice(getPrixUnitaire(semaineKey, quantiteTotale))}
                        </span>

                        {!inCart ? (
                          <button
                            onClick={() => updateCart(menu.id, "plat", 1)}
                            className="bg-[#FD3D6B] text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#e8345e] transition-colors"
                          >
                            + Ajouter
                          </button>
                        ) : (
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateCart(menu.id, item.variante, -1)}
                              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                            >
                              −
                            </button>
                            <span className="font-semibold text-[#4D0F1F] w-4 text-center">
                              {item.quantite}
                            </span>
                            <button
                              onClick={() => updateCart(menu.id, item.variante, 1)}
                              className="w-8 h-8 rounded-full bg-[#4D0F1F] flex items-center justify-center text-white hover:bg-[#3a0b17] transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Récapitulatif */}
          <div className="lg:w-80 shrink-0">
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
                      <div className="flex flex-col gap-3 mb-5">
                        {cartWithMenus.map((item) => (
                          <div key={item.menuId} className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-[#4D0F1F] leading-snug">
                                {item.menu.jourSemaine}{" "}
                                <span className="text-gray-400">{item.menu.date}</span>
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {item.variante === "plat" ? "Plat" : "Végé"} × {item.quantite}
                              </p>
                            </div>
                            <span className="text-xs font-semibold text-[#4D0F1F] shrink-0">
                              {formatPrice(getPrixUnitaire(semaineKey, quantiteTotale) * item.quantite)}
                            </span>
                          </div>
                        ))}
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
                  </div>

                  <button
                    onClick={handlePay}
                    disabled={cart.length === 0}
                    className={`w-full py-4 rounded-full text-sm font-semibold transition-colors ${
                      cart.length > 0
                        ? "bg-[#FD3D6B] text-white hover:bg-[#e8345e]"
                        : "bg-gray-100 text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    {cart.length > 0 ? "Procéder au paiement →" : "Sélectionnez un repas"}
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
