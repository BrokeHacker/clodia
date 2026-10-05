import type { Metadata } from "next";
import Link from "next/link";
import { faqItems } from "@/lib/data";
import FAQSection from "@/components/FAQSection";

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
    ids: [1, 2, 7, 9],
  },
  {
    titre: "Livraison",
    icone: "🚚",
    couleur: "#E8FFF8",
    ids: [3, 6, 10],
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
            Tout ce que vous devez savoir sur le service Clodia. Une question sans réponse ?{" "}
            <Link href="/nous-contacter" className="text-[#FD3D6B] font-semibold hover:underline">Contactez-nous</Link>.
          </p>
        </div>
      </section>

      <FAQSection items={faqItems} categories={categories} />

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
          <Link
            href="/nous-contacter"
            className="bg-[#EAFF33] text-[#4D0F1F] text-sm font-semibold px-8 py-4 rounded-full inline-block hover:bg-[#d4e82e] transition-colors"
          >
            Nous contacter →
          </Link>
        </div>
      </section>
    </>
  );
}
