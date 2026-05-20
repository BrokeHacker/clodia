import type { Metadata } from "next";
import { faqItems } from "@/lib/data";
import FAQAccordion from "@/components/FAQAccordion";

export const metadata: Metadata = {
  title: "FAQ — Clodia",
  description:
    "Toutes les réponses à vos questions sur le service Clodia : commande, livraison, formules, paiement.",
};

const categories = [
  {
    titre: "Commander",
    icone: "📱",
    couleur: "#E8F4FF",
    ids: [1, 2, 7],
  },
  {
    titre: "Livraison",
    icone: "🚚",
    couleur: "#E8FFF8",
    ids: [3, 6],
  },
  {
    titre: "Les repas",
    icone: "🍽️",
    couleur: "#FFF9D6",
    ids: [4, 5],
  },
  {
    titre: "Paiement",
    icone: "💳",
    couleur: "#FDD5D9",
    ids: [8],
  },
];

export default function FAQPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#FFF9D6] py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#FF9933] block mb-4">
            Aide
          </span>
          <h1 className="text-5xl font-semibold text-[#4D0F1F] leading-tight mb-6">
            Questions fréquentes
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Tout ce que vous devez savoir sur le service Clodia. Une question sans réponse ?
            Contactez-nous à contact@clodia.fr.
          </p>
        </div>
      </section>

      {/* Catégories rapides */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.titre}
                className="rounded-2xl p-5 text-center cursor-pointer hover:opacity-80 transition-opacity"
                style={{ background: cat.couleur }}
              >
                <div className="text-3xl mb-2">{cat.icone}</div>
                <p className="text-sm font-semibold text-[#4D0F1F]">{cat.titre}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Toutes les questions */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <FAQAccordion items={faqItems} />
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-[#4D0F1F] text-center">
        <div className="max-w-xl mx-auto px-6">
          <div className="text-4xl mb-6">💬</div>
          <h2 className="text-3xl font-semibold text-white mb-4">
            Vous n&apos;avez pas trouvé la réponse ?
          </h2>
          <p className="text-white/60 text-sm mb-8">
            Notre équipe est disponible du lundi au vendredi, de 8h à 18h.
          </p>
          <a
            href="mailto:contact@clodia.fr"
            className="bg-[#EAFF33] text-[#4D0F1F] text-sm font-semibold px-8 py-4 rounded-full inline-block hover:bg-[#d4e82e] transition-colors"
          >
            Nous contacter →
          </a>
        </div>
      </section>
    </>
  );
}
