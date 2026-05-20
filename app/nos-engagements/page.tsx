import type { Metadata } from "next";
import Link from "next/link";
import { engagements } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nos engagements — Clodia",
  description:
    "Découvrez les engagements de Clodia : produits frais et locaux, chef Gault & Millau, livraison électrique, emballages éco-responsables.",
};

export default function NosEngagementsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#E8FFF8] py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#00CCCC] block mb-4">
            Ce qui nous définit
          </span>
          <h1 className="text-5xl font-semibold text-[#4D0F1F] leading-tight mb-6">
            Nos engagements
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Clodia est né d&apos;une conviction : le personnel soignant mérite de bien manger. Voici les
            engagements qui guident chacune de nos décisions.
          </p>
        </div>
      </section>

      {/* Engagements détaillés */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {engagements.map((e) => (
              <div
                key={e.id}
                className="rounded-3xl p-8"
                style={{ background: e.couleur }}
              >
                <div className="text-4xl mb-5">{e.icone}</div>
                <h2 className="text-xl font-semibold text-[#4D0F1F] mb-3">{e.titre}</h2>
                <p className="text-gray-500 text-sm leading-relaxed">{e.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section chef */}
      <section className="py-24 bg-[#4D0F1F]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="text-5xl mb-6">👨‍🍳</div>
          <span className="bg-[#EAFF33] text-[#4D0F1F] text-xs font-semibold px-4 py-1.5 rounded-full inline-block mb-6">
            Gault &amp; Millau
          </span>
          <h2 className="text-3xl font-semibold text-white mb-6">
            La gastronomie, accessible chaque jour
          </h2>
          <p className="text-white/60 leading-relaxed mb-6">
            Notre chef a été formé dans les meilleures maisons françaises et récompensé par le
            Guide Gault & Millau. Il consacre désormais son talent à une mission qui lui tient à
            cœur : apporter de la qualité et du plaisir au quotidien des soignants.
          </p>
          <p className="text-white/60 leading-relaxed">
            Chaque semaine, il compose cinq menus distincts — avec une alternative végétarienne
            élaborée — en utilisant exclusivement des produits frais, de saison et d&apos;origine locale
            ou régionale.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#FFF9D6] text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-[#4D0F1F] mb-4">
            Une gastronomie qui vous ressemble
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            Chaque repas Clodia est un acte de soin en retour — pour vous, pour la planète,
            pour les producteurs locaux.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/commander" className="btn-punch text-sm px-7 py-3 inline-block">
              Commander →
            </Link>
            <Link href="/formules" className="btn-outline-wine text-sm px-7 py-3 inline-block">
              Voir les formules
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
