import Link from "next/link";
import { WhatsAppButton } from "./WhatsAppCTA";

export default function Hero() {
  return (
    <section
      className="relative flex items-center overflow-hidden"
      style={{ minHeight: "100svh" }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.52)" }} />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 py-24 md:py-32 w-full">
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest mb-8"
          style={{ background: "rgba(255,255,255,.15)", color: "#fff", border: "1px solid rgba(255,255,255,.25)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
          Livraison hospitalière · Limoges
        </div>

        <h1
          className="font-bold text-white leading-tight mb-6"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(40px, 6vw, 72px)", maxWidth: 720, letterSpacing: "-0.02em" }}
        >
          Des repas gastronomiques{" "}
          <em className="not-italic" style={{ fontStyle: "italic" }}>livrés à l&apos;hôpital</em>
        </h1>

        <p className="text-lg leading-relaxed mb-10" style={{ color: "rgba(255,255,255,.80)", maxWidth: 520 }}>
          Un chef Gault &amp; Millau cuisine chaque jour pour le personnel soignant.
          Livraison avant 12h directement dans votre service.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/commander"
            className="px-8 py-3.5 rounded-lg text-sm font-semibold transition-all duration-200"
            style={{ background: "#fff", color: "var(--green)" }}
          >
            Commander en ligne →
          </Link>
          <WhatsAppButton label="Commander sur WhatsApp" size="lg" />
        </div>
        <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,.50)" }}>
          Paiement sécurisé Stripe · Livraison avant 12h · Sans engagement
        </p>

        <div className="flex flex-wrap gap-6 mt-14">
          {[
            { icon: "⭐", text: "Chef Gault & Millau" },
            { icon: "🕐", text: "Livraison avant 12h" },
            { icon: "🏥", text: "CHU Limoges & cliniques" },
            { icon: "🥗", text: "Option végétarienne" },
          ].map((p) => (
            <div key={p.text} className="flex items-center gap-2">
              <span>{p.icon}</span>
              <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,.75)" }}>{p.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
