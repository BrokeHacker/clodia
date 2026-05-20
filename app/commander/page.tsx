"use client";

import { useState } from "react";
import Image from "next/image";
import { menusCurrentWeek, menusNextWeek, pointsLivraison } from "@/lib/data";

type Variante = "plat" | "plat_vege";

interface CartItem {
  menuId: number;
  variante: Variante;
  quantite: number;
}

const SEMAINES = [
  { key: "courante", label: "Semaine du 26 mai", menus: menusCurrentWeek },
  { key: "suivante", label: "Semaine du 2 juin", menus: menusNextWeek },
] as const;

function formatPrice(p: number) {
  return p.toFixed(2).replace(".", ",") + " €";
}

export default function CommanderPage() {
  const [semaineKey, setSemaineKey] = useState<"courante" | "suivante">("courante");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [pointId, setPointId] = useState<number>(pointsLivraison[0].id);

  const currentMenus = SEMAINES.find((s) => s.key === semaineKey)!.menus;

  function getCartItem(menuId: number) {
    return cart.find((c) => c.menuId === menuId) ?? null;
  }

  function updateCart(menuId: number, variante: Variante, delta: number) {
    setCart((prev) => {
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

  function setVariante(menuId: number, variante: Variante) {
    setCart((prev) =>
      prev.map((c) => (c.menuId === menuId ? { ...c, variante } : c))
    );
  }

  const allMenus = [...menusCurrentWeek, ...menusNextWeek];
  const total = cart.reduce((acc, item) => {
    const menu = allMenus.find((m) => m.id === item.menuId);
    return acc + (menu ? menu.prix * item.quantite : 0);
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
              } × ${i.quantite} = ${formatPrice(i.menu.prix * i.quantite)}`
          )
          .join("\n") +
        `\n\nTotal : ${formatPrice(total)}`
    );
  }

  return (
    <>
      {/* Header de page */}
      <section className="bg-[#FDD5D9] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#FD3D6B] block mb-3">
            Réservez votre repas
          </span>
          <h1 className="text-4xl font-semibold text-[#4D0F1F]">Commander</h1>
          <p className="text-gray-500 mt-3 text-sm max-w-lg">
            Choisissez vos menus, sélectionnez votre variante et votre point de livraison.
            Commandez avant 22h pour une livraison le lendemain avant 12h.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Colonne principale */}
          <div className="flex-1">
            {/* Onglets semaines */}
            <div className="flex gap-2 mb-8">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    <div className="relative aspect-[16/9]">
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

                    <div className="p-5">
                      {/* Variante selector */}
                      <div className="flex gap-2 mb-4">
                        <button
                          onClick={() => {
                            if (inCart) {
                              setVariante(menu.id, "plat");
                            } else {
                              updateCart(menu.id, "plat", 1);
                            }
                          }}
                          className={`flex-1 text-xs font-medium py-2 rounded-xl border transition-colors ${
                            !inCart || item?.variante === "plat"
                              ? "border-[#4D0F1F] bg-[#4D0F1F] text-white"
                              : "border-gray-200 text-gray-400 hover:border-gray-300"
                          }`}
                        >
                          🍖 Plat
                        </button>
                        <button
                          onClick={() => {
                            if (inCart) {
                              setVariante(menu.id, "plat_vege");
                            } else {
                              updateCart(menu.id, "plat_vege", 1);
                            }
                          }}
                          className={`flex-1 text-xs font-medium py-2 rounded-xl border transition-colors ${
                            inCart && item?.variante === "plat_vege"
                              ? "border-[#00CCCC] bg-[#00CCCC] text-white"
                              : "border-gray-200 text-gray-400 hover:border-gray-300"
                          }`}
                        >
                          🌿 Végé
                        </button>
                      </div>

                      <h3 className="font-semibold text-[#4D0F1F] text-sm mb-1">
                        {inCart && item?.variante === "plat_vege"
                          ? menu.platVege
                          : menu.plat}
                      </h3>
                      <p className="text-xs text-gray-400 mb-4">+ {menu.dessert}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-[#FF9933] font-semibold">
                          {formatPrice(menu.prix)}
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
                <div className="bg-[#4D0F1F] px-6 py-5">
                  <h2 className="text-white font-semibold">Votre panier</h2>
                  {cart.length > 0 && (
                    <p className="text-white/60 text-xs mt-1">
                      {cart.reduce((a, c) => a + c.quantite, 0)} repas sélectionné
                      {cart.reduce((a, c) => a + c.quantite, 0) > 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                <div className="p-6">
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
                              {formatPrice(item.menu.prix * item.quantite)}
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
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-2">
                      Point de livraison
                    </label>
                    <select
                      value={pointId}
                      onChange={(e) => setPointId(Number(e.target.value))}
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 text-[#4D0F1F] focus:outline-none focus:border-[#FD3D6B]"
                    >
                      {pointsLivraison.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.hopital} — {p.batiment}
                        </option>
                      ))}
                    </select>
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
    </>
  );
}
