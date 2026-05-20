import type { Metadata } from "next";
import Link from "next/link";
import { etapes } from "@/lib/data";

export const metadata: Metadata = {
  title: "Comment ça marche — Clodia",
  description:
    "Découvrez en 3 étapes comment commander vos repas gastronomiques Clodia et vous les faire livrer avant 12h à votre établissement.",
};

export default function CommentCaMarchePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#FFF9D6] py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#FD3D6B] block mb-4">
            Simple & rapide
          </span>
          <h1 className="text-5xl font-semibold text-[#4D0F1F] leading-tight mb-6">
            Comment ça marche ?
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Trois étapes suffisent pour profiter chaque midi d&apos;un repas gastronomique dans votre
            établissement de santé.
          </p>
        </div>
      </section>

      {/* Étapes détaillées */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col gap-20">
            {etapes.map((e, i) => (
              <div
                key={e.numero}
                className={`flex flex-col md:flex-row items-start gap-10 ${
                  i % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="shrink-0">
                  <div className="w-24 h-24 rounded-3xl bg-[#EAFF33] flex items-center justify-center text-4xl">
                    {e.icone}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#FD3D6B] uppercase tracking-widest mb-3">
                    Étape {e.numero}
                  </p>
                  <h2 className="text-3xl font-semibold text-[#4D0F1F] mb-4">{e.titre}</h2>
                  <p className="text-gray-500 leading-relaxed mb-6">{e.description}</p>

                  {e.numero === 1 && (
                    <div className="bg-[#E8F4FF] rounded-2xl p-5">
                      <p className="text-sm text-gray-600 font-medium mb-2">Chaque semaine vous trouverez :</p>
                      <ul className="text-sm text-gray-500 flex flex-col gap-1">
                        <li className="flex items-center gap-2"><span className="text-[#007FFF]">✓</span> Un plat principal viande ou poisson</li>
                        <li className="flex items-center gap-2"><span className="text-[#007FFF]">✓</span> Une alternative végétarienne élaborée</li>
                        <li className="flex items-center gap-2"><span className="text-[#007FFF]">✓</span> Un dessert fait maison</li>
                        <li className="flex items-center gap-2"><span className="text-[#007FFF]">✓</span> 5 menus différents du lundi au vendredi</li>
                      </ul>
                    </div>
                  )}

                  {e.numero === 2 && (
                    <div className="bg-[#FDD5D9] rounded-2xl p-5">
                      <p className="text-sm text-gray-600 font-medium mb-2">À savoir :</p>
                      <ul className="text-sm text-gray-500 flex flex-col gap-1">
                        <li className="flex items-center gap-2"><span className="text-[#FD3D6B]">✓</span> Commande jusqu'à 22h la veille</li>
                        <li className="flex items-center gap-2"><span className="text-[#FD3D6B]">✓</span> Paiement sécurisé par carte via Stripe</li>
                        <li className="flex items-center gap-2"><span className="text-[#FD3D6B]">✓</span> Confirmation immédiate par email</li>
                        <li className="flex items-center gap-2"><span className="text-[#FD3D6B]">✓</span> Annulation possible jusqu'à 22h la veille</li>
                      </ul>
                    </div>
                  )}

                  {e.numero === 3 && (
                    <div className="bg-[#E8FFF8] rounded-2xl p-5">
                      <p className="text-sm text-gray-600 font-medium mb-2">La livraison en pratique :</p>
                      <ul className="text-sm text-gray-500 flex flex-col gap-1">
                        <li className="flex items-center gap-2"><span className="text-[#00CCCC]">✓</span> Livraison avant 12h chaque jour ouvré</li>
                        <li className="flex items-center gap-2"><span className="text-[#00CCCC]">✓</span> Emballage isotherme compostable</li>
                        <li className="flex items-center gap-2"><span className="text-[#00CCCC]">✓</span> SMS de confirmation à la livraison</li>
                        <li className="flex items-center gap-2"><span className="text-[#00CCCC]">✓</span> Véhicule électrique 100%</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#4D0F1F] text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-white mb-4">
            Prêt à bien manger demain midi ?
          </h2>
          <p className="text-white/60 text-sm mb-8">
            Commandez avant 22h ce soir et récupérez votre plateau gastronomique demain avant 12h.
          </p>
          <Link href="/commander" className="btn-punch text-sm px-8 py-4 inline-block">
            Commander maintenant →
          </Link>
        </div>
      </section>
    </>
  );
}
