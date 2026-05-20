import type { Metadata } from "next";
import Link from "next/link";
import { formules } from "@/lib/data";

export const metadata: Metadata = {
  title: "Formules & tarifs — Clodia",
  description:
    "Découvrez nos formules gastronomiques : Découverte à partir de 17,50 €, Semaine à 15,50 €, Prestige à 14,50 €. Livraison incluse.",
};

const comparatif = [
  { critere: "Plat du jour + dessert", decouverte: true, semaine: true, prestige: true },
  { critere: "Option végétarienne", decouverte: true, semaine: true, prestige: true },
  { critere: "Livraison incluse", decouverte: true, semaine: true, prestige: true },
  { critere: "Sans abonnement", decouverte: true, semaine: false, prestige: false },
  { critere: "Livraison prioritaire", decouverte: false, semaine: true, prestige: true },
  { critere: "Économies sur le repas", decouverte: false, semaine: true, prestige: true },
  { critere: "Amuse-bouche inclus", decouverte: false, semaine: false, prestige: true },
  { critere: "Menu exclusif vendredi", decouverte: false, semaine: false, prestige: true },
];

export default function FormulesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#E8F4FF] py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#007FFF] block mb-4">
            Tarifs
          </span>
          <h1 className="text-5xl font-semibold text-[#4D0F1F] leading-tight mb-6">
            Formules &amp; tarifs
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            De la commande ponctuelle à l&apos;abonnement mensuel, choisissez la formule
            adaptée à vos habitudes.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {formules.map((f) => (
              <div
                key={f.id}
                className={`rounded-3xl p-8 flex flex-col ${
                  f.highlight ? "ring-2 ring-[#FD3D6B] shadow-xl" : ""
                }`}
                style={{ background: f.couleur }}
              >
                {f.highlight && (
                  <span className="bg-[#FD3D6B] text-white text-xs font-semibold px-3 py-1 rounded-full self-start mb-4">
                    Le plus populaire
                  </span>
                )}
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-4"
                  style={{ color: f.couleurBadge }}
                >
                  {f.nom}
                </p>
                <p className="text-5xl font-semibold text-[#4D0F1F] mb-1">
                  {f.prix.toFixed(2).replace(".", ",")} €
                </p>
                <p className="text-xs text-gray-400 mb-4">{f.unite}</p>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">{f.tagline}</p>
                <ul className="flex flex-col gap-3 mb-10 flex-1">
                  {f.avantages.map((a, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span style={{ color: f.couleurBadge }} className="shrink-0 font-bold mt-0.5">✓</span>
                      {a}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/commander"
                  className={`block text-center text-sm font-semibold py-3.5 rounded-full transition-colors ${
                    f.highlight
                      ? "bg-[#FD3D6B] text-white hover:bg-[#e8345e]"
                      : "border border-[#4D0F1F]/30 text-[#4D0F1F] hover:bg-[#4D0F1F] hover:text-white"
                  }`}
                >
                  Choisir cette formule
                </Link>
              </div>
            ))}
          </div>

          {/* Tableau comparatif */}
          <div>
            <h2 className="text-2xl font-semibold text-[#4D0F1F] mb-8 text-center">
              Tableau comparatif
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-6 py-4 text-gray-500 font-medium">Caractéristiques</th>
                    {formules.map((f) => (
                      <th key={f.id} className="px-6 py-4 text-center">
                        <span
                          className="text-xs font-semibold uppercase tracking-widest"
                          style={{ color: f.couleurBadge }}
                        >
                          {f.nom}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparatif.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                      <td className="px-6 py-4 text-gray-600">{row.critere}</td>
                      <td className="px-6 py-4 text-center">
                        {row.decouverte ? (
                          <span className="text-[#00CCCC] font-bold">✓</span>
                        ) : (
                          <span className="text-gray-200">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {row.semaine ? (
                          <span className="text-[#FD3D6B] font-bold">✓</span>
                        ) : (
                          <span className="text-gray-200">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {row.prestige ? (
                          <span className="text-[#00CCCC] font-bold">✓</span>
                        ) : (
                          <span className="text-gray-200">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-semibold">
                    <td className="px-6 py-4 text-[#4D0F1F]">Prix par repas</td>
                    {formules.map((f) => (
                      <td key={f.id} className="px-6 py-4 text-center text-[#FF9933]">
                        {f.prix.toFixed(2).replace(".", ",")} €
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ rapide */}
      <section className="py-20 bg-[#FFF9D6]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-[#4D0F1F] text-center mb-10">
            Questions sur les formules
          </h2>
          <div className="flex flex-col gap-6">
            {[
              {
                q: "Puis-je changer de formule ?",
                r: "Oui, vous pouvez changer de formule à tout moment. Le changement prend effet la semaine suivante.",
              },
              {
                q: "Y a-t-il un engagement minimum ?",
                r: "La formule Découverte est sans engagement. Les formules Semaine et Prestige sont renouvelables chaque semaine ou mois.",
              },
              {
                q: "Le prix inclut-il la livraison ?",
                r: "Oui, la livraison est incluse dans tous les prix affichés. Aucun frais supplémentaire.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6">
                <p className="font-semibold text-[#4D0F1F] mb-2">{item.q}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{item.r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#4D0F1F] text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-white mb-4">Commencez dès demain</h2>
          <p className="text-white/60 text-sm mb-8">
            Commandez avant 22h ce soir. Livraison avant 12h demain.
          </p>
          <Link href="/commander" className="btn-punch text-sm px-8 py-4 inline-block">
            Commander maintenant →
          </Link>
        </div>
      </section>
    </>
  );
}
