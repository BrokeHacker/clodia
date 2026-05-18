"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Client, CommandeAvecMenu, PointLivraison } from "@/lib/types";

interface Props {
  client: Client;
  commandes: CommandeAvecMenu[];
  pointLivraison: PointLivraison | null;
  favoris: { plat: string; count: number }[];
  isAbonne: boolean;
  userEmail: string;
}

const STATUT: Record<string, { label: string; color: string; bg: string }> = {
  reserve:  { label: "Réservé",  color: "#B45309", bg: "#FEF3C7" },
  confirme: { label: "Confirmé", color: "#065F46", bg: "#D1FAE5" },
  livre:    { label: "Livré",    color: "#374151", bg: "#F3F4F6" },
  annule:   { label: "Annulé",   color: "#9F1239", bg: "#FFE4E6" },
};

export default function MonCompteClient({ client, commandes, pointLivraison, favoris, isAbonne, userEmail }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<"commandes" | "profil">("commandes");

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  const initials = `${client.prenom?.[0] ?? ""}${client.nom?.[0] ?? ""}`.toUpperCase();
  const totalDepense = commandes.filter((c) => c.statut !== "annule").reduce((s, c) => s + c.prix_total, 0);

  return (
    <div className="min-h-screen" style={{ background: "var(--gray-50)" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b flex items-center justify-between px-5 md:px-10 h-14" style={{ borderColor: "var(--gray-200)" }}>
        <Link href="/" className="text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "var(--dark)" }}>
          clodia
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs hidden sm:block" style={{ color: "var(--gray-400)" }}>{userEmail}</span>
          <button onClick={handleLogout} className="px-4 py-2 rounded-lg text-xs font-semibold border transition-all duration-200" style={{ color: "var(--gray-600)", borderColor: "var(--gray-200)" }}>
            Déconnexion
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Profil card */}
        <div className="bg-white rounded-xl p-6 border mb-4" style={{ borderColor: "var(--gray-200)", boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold shrink-0" style={{ background: "var(--green)", color: "#fff" }}>
              {initials || "?"}
            </div>
            <div className="flex-1">
              <h1 className="font-semibold text-base" style={{ color: "var(--dark)" }}>
                {client.prenom} {client.nom}
              </h1>
              <p className="text-xs mt-0.5" style={{ color: "var(--gray-400)" }}>{client.telephone}</p>
              {isAbonne && (
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: "#D1FAE5", color: "#065F46" }}>
                  Client fidèle
                </span>
              )}
            </div>
            <div className="flex gap-5 shrink-0">
              <div className="text-center">
                <div className="text-xl font-bold" style={{ color: "var(--dark)" }}>{commandes.length}</div>
                <div className="text-xs" style={{ color: "var(--gray-400)" }}>repas</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold" style={{ color: "var(--dark)" }}>{totalDepense.toFixed(0)}€</div>
                <div className="text-xs" style={{ color: "var(--gray-400)" }}>total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Point livraison */}
        {pointLivraison && (
          <div className="bg-white rounded-xl px-5 py-4 border mb-4 flex items-center gap-3" style={{ borderColor: "var(--gray-200)" }}>
            <span>📍</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: "var(--gray-400)" }}>Point de livraison</p>
              <p className="text-sm font-medium" style={{ color: "var(--dark)" }}>
                {pointLivraison.hopital} — {pointLivraison.service}
              </p>
            </div>
          </div>
        )}

        {/* Favoris */}
        {favoris.length > 0 && (
          <div className="bg-white rounded-xl p-5 border mb-4" style={{ borderColor: "var(--gray-200)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--gray-400)" }}>Vos plats favoris</p>
            <div className="flex flex-col gap-2">
              {favoris.map((f, i) => (
                <div key={f.plat} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: i === 0 ? "var(--green)" : "var(--gray-100)", color: i === 0 ? "#fff" : "var(--gray-600)" }}>
                    {i + 1}
                  </span>
                  <span className="text-sm flex-1 truncate" style={{ color: "var(--dark)" }}>{f.plat}</span>
                  <span className="text-xs" style={{ color: "var(--gray-400)" }}>{f.count}×</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex rounded-lg p-1 mb-4 border" style={{ background: "var(--gray-50)", borderColor: "var(--gray-200)" }}>
          {(["commandes", "profil"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className="flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200"
              style={tab === t ? { background: "#fff", color: "var(--dark)", boxShadow: "0 1px 4px rgba(0,0,0,.08)" } : { color: "var(--gray-400)" }}>
              {t === "commandes" ? "Mes commandes" : "Mon profil"}
            </button>
          ))}
        </div>

        {/* Commandes */}
        {tab === "commandes" && (
          <div className="flex flex-col gap-3">
            {commandes.length === 0 ? (
              <div className="bg-white rounded-xl p-10 border text-center" style={{ borderColor: "var(--gray-200)" }}>
                <span className="text-4xl block mb-3">🍽️</span>
                <p className="text-sm" style={{ color: "var(--gray-400)" }}>Aucune commande pour l&apos;instant.</p>
              </div>
            ) : (
              commandes.map((c) => {
                const st = STATUT[c.statut] ?? { label: c.statut, color: "#374151", bg: "#F3F4F6" };
                const dateCommande = new Date(c.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
                const dateLivraison = c.menus?.date_livraison
                  ? new Date(c.menus.date_livraison + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
                  : null;

                return (
                  <div key={c.id} className="bg-white rounded-xl p-5 border" style={{ borderColor: "var(--gray-200)" }}>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <p className="text-xs" style={{ color: "var(--gray-400)" }}>{dateCommande}</p>
                        <p className="text-xs font-mono mt-0.5" style={{ color: "var(--gray-200)" }}>#{c.ref_commande}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold shrink-0" style={{ background: st.bg, color: st.color }}>
                        {st.label}
                      </span>
                    </div>
                    {c.menus && (
                      <div className="flex flex-col gap-1 mb-3">
                        <p className="text-sm font-medium" style={{ color: "var(--dark)" }}>
                          {c.variante === "plat_vege" ? "🥗" : "🍽️"}{" "}
                          {c.variante === "plat_vege" ? c.menus.plat_vege : c.menus.plat}
                        </p>
                        {c.menus.dessert && (
                          <p className="text-sm" style={{ color: "var(--gray-400)" }}>🍮 {c.menus.dessert}</p>
                        )}
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "var(--gray-100)" }}>
                      <span className="text-xs" style={{ color: "var(--gray-400)" }}>
                        {dateLivraison ? `Livraison ${dateLivraison}` : `${c.quantite} × ${c.prix_unitaire.toFixed(2)}€`}
                      </span>
                      <span className="text-base font-bold" style={{ color: "var(--dark)" }}>{c.prix_total.toFixed(2)}€</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Profil */}
        {tab === "profil" && (
          <div className="bg-white rounded-xl p-6 border" style={{ borderColor: "var(--gray-200)" }}>
            {[
              { label: "Prénom", value: client.prenom },
              { label: "Nom", value: client.nom },
              { label: "Email", value: client.email ?? "—" },
              { label: "Téléphone", value: client.telephone },
              { label: "Membre depuis", value: new Date(client.created_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" }) },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: "var(--gray-100)" }}>
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--gray-400)" }}>{item.label}</span>
                <span className="text-sm font-medium" style={{ color: "var(--dark)" }}>{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
