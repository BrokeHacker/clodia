import type { Metadata } from "next";
import WhatsAppQR from "@/components/WhatsAppQR";

export const metadata: Metadata = {
  title: "Commander sur WhatsApp — Clodia",
  description:
    "Commandez vos repas gastronomiques Clodia directement via WhatsApp. Notre bot vous guide en quelques minutes.",
};

const etapes = [
  {
    numero: "1",
    titre: "Dites bonjour",
    description: "Envoyez un message à notre bot. Il vous répond instantanément et vous présente le menu du jour.",
    icone: "👋",
  },
  {
    numero: "2",
    titre: "Choisissez votre menu",
    description: "Sélectionnez le jour, la variante (plat traditionnel ou végétarien) et votre point de livraison.",
    icone: "🍽️",
  },
  {
    numero: "3",
    titre: "Payez en ligne",
    description: "Le bot vous envoie un lien de paiement sécurisé. Confirmé en 30 secondes, livraison garantie avant 12h.",
    icone: "💳",
  },
];

export default function WhatsAppPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-[#E8FFF8] flex items-center justify-center mx-auto mb-8">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#25D366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.886a.5.5 0 00.611.611l6.031-1.471A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.882 9.882 0 01-5.031-1.378l-.361-.214-3.736.911.929-3.736-.235-.374A9.859 9.859 0 012.106 12C2.106 6.525 6.525 2.106 12 2.106S21.894 6.525 21.894 12 17.475 21.894 12 21.894z" />
            </svg>
          </div>

          <h1 className="text-5xl font-semibold text-[#4D0F1F] leading-tight mb-5">
            Commandez sur WhatsApp
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Notre bot vous guide en quelques minutes : choix du menu, variante,
            quantité et paiement — directement dans WhatsApp.
          </p>
        </div>
      </section>

      {/* Étapes */}
      <section className="bg-[#E8FFF8] py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex flex-col gap-6">
            {etapes.map((e, i) => (
              <div key={e.numero} className="flex items-start gap-6 bg-white rounded-2xl p-6">
                <div className="shrink-0 w-12 h-12 rounded-full bg-[#EAFF33] flex items-center justify-center text-xl font-semibold text-[#4D0F1F]">
                  {e.numero}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{e.icone}</span>
                    <h2 className="font-semibold text-[#4D0F1F]">{e.titre}</h2>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{e.description}</p>
                </div>
                {i < etapes.length - 1 && (
                  <div className="absolute left-11 mt-14 w-px h-6 bg-gray-100 hidden" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20">
        <div className="max-w-2xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-10">
            {/* Bouton */}
            <div className="flex flex-col items-center gap-4">
              <a
                href="https://wa.me/33753791617"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white font-semibold text-base px-8 py-5 rounded-full hover:bg-[#1ebe57] transition-colors inline-flex items-center gap-3 whitespace-nowrap"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.886a.5.5 0 00.611.611l6.031-1.471A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.882 9.882 0 01-5.031-1.378l-.361-.214-3.736.911.929-3.736-.235-.374A9.859 9.859 0 012.106 12C2.106 6.525 6.525 2.106 12 2.106S21.894 6.525 21.894 12 17.475 21.894 12 21.894z" />
                </svg>
                Ouvrir WhatsApp
              </a>
              <p className="text-gray-400 text-sm text-center">
                Ouvert du lundi au vendredi · Commandes avant 10h
              </p>
            </div>

            {/* Séparateur */}
            <div className="flex md:flex-col items-center gap-3 text-gray-200">
              <div className="flex-1 md:flex-none h-px md:h-16 w-16 md:w-px bg-gray-200" />
              <span className="text-xs text-gray-300 font-medium uppercase tracking-widest">ou</span>
              <div className="flex-1 md:flex-none h-px md:h-16 w-16 md:w-px bg-gray-200" />
            </div>

            {/* QR code */}
            <WhatsAppQR />
          </div>
        </div>
      </section>
    </>
  );
}
