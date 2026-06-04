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
    description: "Le bot vous envoie un lien de paiement sécurisé. Confirmé en 30 secondes, livraison garantie avant midi.",
    icone: "💳",
  },
];

export default function WhatsAppPage() {
  return (
    <div className="bg-[#FAFAF8]">
      {/* Hero */}
      <section style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "88px 64px 72px",
      }}>
        <h1 style={{
          fontSize: "clamp(36px, 5vw, 64px)",
          fontWeight: 600, color: "#1A1A1A",
          lineHeight: 1.0, letterSpacing: "-0.025em",
          textTransform: "uppercase",
          margin: "0 0 32px",
          maxWidth: "800px",
        }}>
          Commandez<br />
          <span style={{ color: "#25D366" }}>sur WhatsApp</span>
        </h1>
        <p style={{
          fontSize: "18px", color: "#6B6B6B",
          lineHeight: 1.75, maxWidth: "520px",
        }}>
          Notre bot vous guide en quelques minutes : choix du menu, variante,
          quantité et paiement — directement dans WhatsApp.
        </p>
      </section>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 64px" }}>
        <div style={{ height: "1px", background: "#E8E3D8" }} />
      </div>

      {/* Étapes */}
      <section style={{ background: "#F5F0E8" }} className="py-8 md:py-20">
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 64px" }}>

          {/* Desktop — horizontal */}
          <div className="hidden md:grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: "0" }}>
            {etapes.map((e, i) => (
              <div key={e.titre + "-icon"} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ flex: 1, height: 1, background: "#C4704F", opacity: i === 0 ? 0 : 0.3 }} />
                <div style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: "#C4704F", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{e.numero}</span>
                </div>
                <div style={{ flex: 1, height: 1, background: "#C4704F", opacity: i === etapes.length - 1 ? 0 : 0.3 }} />
              </div>
            ))}
            {etapes.map((e, i) => (
              <div key={e.titre + "-text"} style={{
                paddingTop: "1.5rem",
                paddingRight: i < etapes.length - 1 ? 16 : 0,
                textAlign: "center",
              }}>
                <p style={{
                  fontSize: 12, fontWeight: 500, color: "#1A1A1A",
                  textTransform: "uppercase", letterSpacing: "0.05em",
                  marginBottom: 6, lineHeight: 1.3,
                }}>
                  {e.titre}
                </p>
                <p style={{ fontSize: 12, color: "#6B6B6B", lineHeight: 1.6 }}>
                  {e.description}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile — vertical */}
          <div className="md:hidden">
            <div style={{ position: "relative" }}>
              {etapes.map((etape, i) => (
                <div key={i} style={{ display: "flex", gap: "16px", position: "relative", paddingBottom: i < etapes.length - 1 ? "32px" : "0" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: "50%",
                      background: "#C4704F", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      flexShrink: 0, zIndex: 1,
                    }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{etape.numero}</span>
                    </div>
                    {i < etapes.length - 1 && (
                      <div style={{ width: 2, flex: 1, background: "#E8E3D8", marginTop: "4px" }} />
                    )}
                  </div>
                  <div style={{ paddingTop: "10px" }}>
                    <p style={{
                      fontSize: "13px", fontWeight: 700,
                      color: "#1A1A1A", textTransform: "uppercase",
                      letterSpacing: "0.06em", marginBottom: "6px",
                    }}>
                      {etape.titre}
                    </p>
                    <p style={{ fontSize: "13px", color: "#6B6B6B", lineHeight: 1.6 }}>
                      {etape.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
    </div>
  );
}
