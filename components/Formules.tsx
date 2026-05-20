import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Tarif } from "@/lib/types";
import Link from "next/link";

const TYPE_ORDER = ["precommande", "abonnement", "carte", "alacarte", "groupe", "pack"];

function typeLabel(type: string) {
  const map: Record<string, string> = {
    abonnement:  "Pré-commande semaine",
    precommande: "Pré-commande semaine",
    carte:       "À la carte",
    alacarte:    "À la carte",
    pack:        "Commande groupée",
    groupe:      "Commande groupée",
  };
  return map[type.toLowerCase()] ?? type;
}

function typeIcon(type: string) {
  const map: Record<string, string> = {
    abonnement:  "📅",
    precommande: "📅",
    carte:       "🍽️",
    alacarte:    "🍽️",
    pack:        "👥",
    groupe:      "👥",
  };
  return map[type.toLowerCase()] ?? "✨";
}

function typeDesc(type: string) {
  const map: Record<string, string> = {
    abonnement:  "Je choisis mes jours pour la semaine à venir et je règle en une fois. Livraison avant 12h, sans engagement.",
    precommande: "Je choisis mes jours pour la semaine à venir et je règle en une fois. Livraison avant 12h, sans engagement.",
    carte:       "Commandez à l'unité, sans engagement. Prix fixe par repas, plat + dessert inclus.",
    alacarte:    "Commandez à l'unité, sans engagement. Prix fixe par repas, plat + dessert inclus.",
    pack:        "Commandez pour plusieurs collègues en une seule transaction. Tarif dégressif selon le volume.",
    groupe:      "Commandez pour plusieurs collègues en une seule transaction. Tarif dégressif selon le volume.",
  };
  return map[type.toLowerCase()] ?? "";
}

function typeSlug(type: string): string {
  const map: Record<string, string> = {
    abonnement:  "precommande",
    precommande: "precommande",
    carte:       "carte",
    alacarte:    "carte",
    pack:        "groupe",
    groupe:      "groupe",
  };
  return map[type.toLowerCase()] ?? type.toLowerCase();
}

function typeCta(type: string): string {
  const map: Record<string, string> = {
    abonnement:  "Choisir mes jours →",
    precommande: "Choisir mes jours →",
    carte:       "Commander à la carte →",
    alacarte:    "Commander à la carte →",
    pack:        "Choisir cette formule",
    groupe:      "Choisir cette formule",
  };
  return map[type.toLowerCase()] ?? "Choisir cette formule";
}

function isFlat(items: Tarif[]): boolean {
  return items.length === 1 && items[0].repas_de === 1 && items[0].repas_a >= 999;
}

export default async function Formules() {
  const supabase = await createServerSupabaseClient();
  const { data: tarifs } = await supabase.from("tarifs").select("*").order("repas_de", { ascending: true });

  const grouped = ((tarifs as Tarif[]) ?? []).reduce(
    (acc, t) => { if (!acc[t.type]) acc[t.type] = []; acc[t.type].push(t); return acc; },
    {} as Record<string, Tarif[]>
  );

  const sortedEntries = Object.entries(grouped).sort(([a], [b]) => {
    const ia = TYPE_ORDER.indexOf(a.toLowerCase());
    const ib = TYPE_ORDER.indexOf(b.toLowerCase());
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  return (
    <section id="formules" className="py-24 px-6 md:px-10" style={{ background: "var(--gray-50)" }}>
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--green)" }}>Nos formules</p>
        <h2 className="font-bold mb-4 tracking-tight" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 42px)", color: "var(--dark)" }}>
          Un tarif juste, des repas vrais
        </h2>
        <p className="text-base leading-relaxed mb-14" style={{ color: "var(--gray-600)", maxWidth: 460 }}>
          Plus vous commandez, moins ça coûte. Choisissez la formule qui correspond à votre rythme.
        </p>

        {sortedEntries.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--gray-400)" }}>Tarifs bientôt disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedEntries.map(([type, items]) => {
              const popular = ["abonnement", "precommande"].includes(type.toLowerCase());
              const flat = isFlat(items);
              const slug = typeSlug(type);
              return (
                <div
                  key={type}
                  className="relative rounded-xl bg-white p-7 flex flex-col card-hover"
                  style={{
                    border: popular ? "2px solid var(--green)" : "1px solid var(--gray-200)",
                    boxShadow: popular ? "0 4px 24px rgba(74,103,65,.10)" : "0 1px 4px rgba(0,0,0,.05)",
                  }}
                >
                  {popular && (
                    <div className="absolute -top-px left-8 px-3 py-1 rounded-b-lg text-xs font-bold" style={{ background: "var(--green)", color: "#fff" }}>
                      Le plus choisi
                    </div>
                  )}
                  <div className="text-3xl mb-4">{typeIcon(type)}</div>
                  <h3 className="text-lg font-bold mb-1" style={{ color: "var(--dark)" }}>{typeLabel(type)}</h3>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--gray-600)" }}>{typeDesc(type)}</p>

                  <div className="flex flex-col gap-2 mb-8 flex-1">
                    {flat ? (
                      <div className="flex items-center justify-between rounded-lg px-4 py-3" style={{ background: "var(--gray-50)", border: "1px solid var(--gray-100)" }}>
                        <span className="text-sm" style={{ color: "var(--gray-600)" }}>Prix fixe</span>
                        <span className="text-base font-bold" style={{ color: "var(--dark)" }}>
                          {items[0].prix_unitaire.toFixed(2).replace(".", ",")} €
                          <span className="text-xs font-normal ml-0.5" style={{ color: "var(--gray-400)" }}>/repas</span>
                        </span>
                      </div>
                    ) : (
                      items.map((t) => (
                        <div key={t.id} className="flex items-center justify-between rounded-lg px-4 py-3" style={{ background: "var(--gray-50)", border: "1px solid var(--gray-100)" }}>
                          <span className="text-sm" style={{ color: "var(--gray-600)" }}>
                            {t.repas_de === t.repas_a
                              ? `${t.repas_de} jour${t.repas_de > 1 ? "s" : ""}`
                              : t.repas_a >= 999
                                ? `${t.repas_de} repas et +`
                                : `${t.repas_de}–${t.repas_a} repas`}
                          </span>
                          <span className="text-base font-bold" style={{ color: "var(--dark)" }}>
                            {t.prix_unitaire.toFixed(2).replace(".", ",")} €
                            <span className="text-xs font-normal ml-0.5" style={{ color: "var(--gray-400)" }}>/repas</span>
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  <Link
                    href={`/commander?formule=${slug}`}
                    className={`block w-full text-center py-3 text-sm ${popular ? "btn-primary" : "btn-secondary"}`}
                  >
                    {typeCta(type)}
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
