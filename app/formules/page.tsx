import type { Metadata } from "next";
import Link from "next/link";
import { formules } from "@/lib/data";

export const metadata: Metadata = {
  title: "Formules & tarifs — Clodia",
  description:
    "Découvrez nos formules gastronomiques adaptées à votre rythme : pré-commande, semaine en cours. Livraison incluse.",
};

function formatPrix(prix: number) {
  if (prix === 0) return "00,00 €";
  return prix.toFixed(2).replace(".", ",") + " €";
}

function getNbJours(label: string): number | null {
  const match = /^(\d+) plat/.exec(label);
  if (!match) return null;
  const n = parseInt(match[1], 10);
  return n <= 5 ? n : null;
}

const featuresCommunes = [
  { icone: "ti-truck", texte: "Livraison incluse avant 12h" },
  { icone: "ti-leaf", texte: "Option végétarienne disponible" },
  { icone: "ti-credit-card", texte: "Paiement sécurisé Stripe" },
  { icone: "ti-refresh", texte: "Sans engagement ni abonnement" },
  { icone: "ti-snowflake", texte: "Chaîne du froid respectée" },
  { icone: "ti-bell", texte: "Notification de livraison" },
  { icone: "ti-mail", texte: "Reçu envoyé par email à chaque commande" },
  { icone: "ti-file-invoice", texte: "Facture disponible dans votre espace client" },
];

export default function FormulesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#E8F4FF] py-10">
        <div className="max-w-5xl mx-auto px-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#007FFF] block mb-4">
            Tarifs
          </span>
          <h1 className="text-4xl font-semibold text-[#4D0F1F] mb-3">
            Nos formules
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Des tarifs pensés pour s&apos;adapter à votre rythme et à vos besoins.
          </p>
          <p className="text-sm text-[#007FFF] font-medium mt-2">
            Pour les particuliers comme pour les services hospitaliers.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6">
            {formules.map((f) => {
              const showTotalColonne = f.id === 1;
              return (
                <div
                  key={f.id}
                  className={`rounded-3xl p-8 flex flex-col ${
                    f.highlight ? "ring-2 ring-[#00CCCC] shadow-xl" : ""
                  }`}
                  style={{ background: f.couleur }}
                >
                  {/* Badge recommandation */}
                  {f.highlight ? (
                    <span className="bg-[#00CCCC] text-white text-xs font-semibold px-3 py-1 rounded-full self-start mb-4">
                      Notre recommandation
                    </span>
                  ) : (
                    <div className="text-xs font-semibold uppercase invisible mb-4">Notre recommandation</div>
                  )}

                  {/* Nom + tagline */}
                  <h2 className="text-xl font-semibold text-[#4D0F1F]">{f.nom}</h2>
                  <p className="text-sm text-gray-500 mt-1 mb-4">{f.tagline}</p>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">{f.description}</p>

                  {/* Tableau des paliers */}
                  <div className="rounded-2xl overflow-hidden border border-black/5 mb-6">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-black/5">
                          <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">
                            Quantité
                          </th>
                          <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500">
                            Prix / plat TTC
                          </th>
                          {showTotalColonne && (
                            <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500">
                              Total semaine TTC
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {f.paliers.map((p, i) => {
                          const nbJours = showTotalColonne ? getNbJours(p.label) : null;
                          const totalSemaine =
                            showTotalColonne && nbJours !== null && p.prix !== 0
                              ? formatPrix(p.prix * nbJours)
                              : "—";
                          return (
                            <tr
                              key={i}
                              className={p.highlight ? "font-semibold" : ""}
                              style={
                                p.highlight
                                  ? { background: f.couleurAccent + "18" }
                                  : { background: i % 2 === 0 ? "rgba(255,255,255,0.6)" : "transparent" }
                              }
                            >
                              <td className="px-4 py-2.5 text-gray-700">{p.label}</td>
                              <td
                                className="px-4 py-2.5 text-right font-semibold"
                                style={{ color: "#FF9933" }}
                              >
                                {formatPrix(p.prix)}
                              </td>
                              {showTotalColonne && (
                                <td
                                  className="px-4 py-2.5 text-right font-semibold"
                                  style={{ color: totalSemaine !== "—" ? "#FF9933" : undefined }}
                                >
                                  {totalSemaine}
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Avantages */}
                  <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                    {f.avantages.map((a, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <i
                          className="ti ti-check shrink-0 mt-0.5"
                          style={{ fontSize: 16, color: f.couleurAccent }}
                        />
                        {a}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="mt-auto">
                    <Link
                      href={f.highlight ? "/commander?semaine=suivante" : "/commander"}
                      className={`block text-center text-sm font-semibold py-4 rounded-full transition-colors w-full ${
                        f.highlight
                          ? "bg-[#FD3D6B] hover:bg-[#e8345e] text-white"
                          : "btn-outline-wine"
                      }`}
                    >
                      Je commande
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features communes */}
      <section className="py-12 bg-[#FFF9D6]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-[#4D0F1F] text-center mb-10">
            Dans toutes les formules
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl mx-auto">
            {featuresCommunes.map(({ icone, texte }) => (
              <div key={icone} className="flex items-start gap-3 text-sm text-gray-700 min-h-[48px]">
                <i
                  className={`ti ${icone} shrink-0`}
                  style={{ fontSize: 20, color: "#4D0F1F" }}
                />
                {texte}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA finale */}
      <section className="py-12 bg-[#4D0F1F] text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-white mb-3">
            Une question sur nos tarifs ?
          </h2>
          <p className="text-white/60 text-sm mb-8">
            Contactez-nous, on vous répond sous 24h.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/commander" className="btn-punch text-sm px-8 py-4 inline-block">
              Commander maintenant →
            </Link>
            <a
              href="mailto:contact@clodia.fr"
              className="btn-outline-white text-sm px-8 py-4 inline-block"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
