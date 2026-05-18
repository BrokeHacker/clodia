import Link from "next/link";
import { WhatsAppButton, WhatsAppQR } from "./WhatsAppCTA";

export default function CtaWhatsApp() {
  return (
    <section className="py-24 px-6 md:px-10" style={{ background: "var(--sand)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-14">

          {/* Texte + boutons */}
          <div className="max-w-lg text-center md:text-left">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--green)" }}>
              Disponible dès maintenant
            </p>
            <h2
              className="font-bold mb-4 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 42px)", color: "var(--dark)" }}
            >
              Prêt à commander ?
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: "var(--gray-600)" }}>
              Choisissez votre formule en ligne en 2 minutes, ou passez commande directement
              via WhatsApp — sans application à installer.
            </p>

            {/* Double CTA */}
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-3 mb-4">
              <Link
                href="/commander"
                className="btn-primary px-7 py-3.5 text-sm font-semibold text-center rounded-lg"
              >
                Commander en ligne →
              </Link>
              <WhatsAppButton label="Commander sur WhatsApp" size="lg" />
            </div>

            {/* Réassurance */}
            <p className="text-xs" style={{ color: "var(--gray-400)" }}>
              Paiement sécurisé Stripe · Livraison avant 12h · Sans engagement
            </p>
          </div>

          {/* QR code */}
          <div className="flex-shrink-0 flex flex-col items-center gap-3">
            <WhatsAppQR />
            <p className="text-xs font-medium" style={{ color: "var(--gray-400)" }}>
              Scanner pour WhatsApp
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
