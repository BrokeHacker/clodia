import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  faqItems,
  etapes,
} from "@/lib/data";
import { fetchMenusCarrousel } from "@/lib/menus";
import MenuCarousel from "@/components/MenuCarousel";
import FAQAccordion from "@/components/FAQAccordion";
import PointLivraisonSelector from "@/components/PointLivraisonSelector";

const marqueeItems = [
  "Déclinaison végétarienne",
  "1 menu du jour — plat + dessert",
  "Livraison avant 12h dans le frigo de votre service",
  "Approche nutritive adaptée au personnel soignant et hospitalier",
];

export default async function Home() {
  const menusCarrousel = await fetchMenusCarrousel();
  const doubled = [...marqueeItems, ...marqueeItems];

  return (
    <>
      {/* ── 1. HERO ── */}
      <section className="relative min-h-screen flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=95&auto=format&fit=crop"
          alt="Repas gastronomiques Clodia"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/15" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 w-full">
          <div className="mb-5">
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.30)",
              backdropFilter: "blur(8px)",
              borderRadius: "999px",
              padding: "7px 16px",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}>
              <span style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#C4704F",
                flexShrink: 0,
                display: "inline-block",
              }} />
              Service sur mesure dédié au personnel soignant &amp; hospitalier
              <span style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#C4704F",
                flexShrink: 0,
                display: "inline-block",
              }} />
            </span>
          </div>

          <h1
            className="text-white font-semibold leading-tight mb-6"
            style={{ fontSize: "clamp(40px, 6vw, 72px)", maxWidth: 700 }}
          >
            Vous prenez soin des autres.{" "}
            <span className="text-[#EAFF33]">On prend soin de vous.</span>
          </h1>

          <ul className="flex flex-col gap-3 mb-10 max-w-xl">
            {[
              "Menu du jour élaboré par notre Chef à base de produits frais et de saison",
              "Livraison avant 12h directement dans le frigo de votre service",
              "Sans engagement",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="text-white text-xl leading-none shrink-0">·</span>
                <span className="text-white font-semibold text-base leading-snug">{item}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/formules" className="btn-punch text-sm px-7 py-3.5 inline-block">
              Je découvre →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. MARQUEE ── */}
      <section className="bg-[#F5F0E8] border-y border-[#E8E3D8] py-3 overflow-hidden">
        <div className="animate-marquee">
          {doubled.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-8 text-sm font-medium text-[#4A4A4A] whitespace-nowrap px-8"
            >
              {item}
              <span className="w-1 h-1 rounded-full bg-[#4A4A4A]/30 inline-block" />
            </span>
          ))}
        </div>
      </section>

      {/* ── 3. COMMENT ÇA MARCHE ── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 600, lineHeight: 1.2, color: "#1A1A1A" }}>
              Simple à commander,<br />
              <span style={{ color: "#4A6741" }}>simple à savourer</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0" }}>

            {/* Rangée 1 — cercles + traits intégrés */}
            {etapes.map((e, i) => (
              <div key={e.titre + "-icon"} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ flex: 1, height: 1, background: "#C4704F", opacity: i === 0 ? 0 : 0.3 }} />
                <div style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: "#C4704F", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  flexShrink: 0, zIndex: 1,
                }}>
                  <i className={`ti ${e.icone}`} style={{ fontSize: 22, color: "#fff" }} />
                </div>
                <div style={{ flex: 1, height: 1, background: "#C4704F", opacity: i === etapes.length - 1 ? 0 : 0.3 }} />
              </div>
            ))}

            {/* Rangée 2 — textes */}
            {etapes.map((e, i) => (
              <div key={e.titre + "-text"} style={{ paddingTop: "1.5rem", paddingRight: i < etapes.length - 1 ? 16 : 0, textAlign: "center" }}>
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

          <div className="text-center mt-12">
            <Link href="/comment-ca-marche" className="btn-outline-wine text-sm px-7 py-3 inline-block">
              En savoir plus →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. NOS MENUS ── */}
      <section className="py-24 bg-[#F5F0E8]/70">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 600, lineHeight: 1.2, color: "#1A1A1A" }}>
                Cinq menus par semaine,<br />
                <span style={{ color: "#C4704F" }}>cinq bonnes raisons de bien manger</span>
              </h2>
            </div>
            <Link
              href="/commander"
              className="btn-punch text-sm px-6 py-3 inline-block shrink-0"
            >
              Je choisis mes menus →
            </Link>
          </div>

          <MenuCarousel menus={menusCarrousel} />
        </div>
      </section>

      {/* ── 5. LIVRAISON ── */}
      <section id="frigidaire" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 600, lineHeight: 1.2, color: "#1A1A1A" }}>
              Votre repas vous attend<br />
              <span style={{ color: "#00CCCC" }}>dans votre frigo avant midi</span>
            </h2>
            <p className="text-gray-400 mt-4 max-w-md mx-auto text-sm">
              Sélectionnez votre établissement pour trouver votre point de livraison.
            </p>
          </div>

          <PointLivraisonSelector />
        </div>
      </section>

      {/* ── 6. NOTRE PROMESSE ── */}
      <section className="py-24 bg-[#F5F0E8]/70">
        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-semibold text-[#1A1A1A] leading-tight">
              Chaque jour un vrai repas,<br />
              <span className="text-[#4A6741]">pas un compromis</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">

            <div className="relative rounded-2xl overflow-hidden min-h-[520px]">
              <Image
                src="/images/plats-clodia.jpg"
                alt="Les plats Clodia"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-white/60 text-xs uppercase tracking-widest mb-2 font-medium">
                  Notre cuisine
                </p>
                <p className="text-white text-2xl font-semibold leading-snug">
                  Cuisiné ce matin.<br />Dans votre frigo avant midi.
                </p>
              </div>
            </div>

            {/* Droite — layout éditorial, pas de cards */}
            <div className="flex flex-col justify-between h-full py-2" style={{ minHeight: "520px" }}>

              {/* Block 1 */}
              <div>
                <p style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#4A6741",
                  marginBottom: "14px",
                }}>
                  La cuisine
                </p>
                <p style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  lineHeight: 1.2,
                  color: "#1A1A1A",
                  marginBottom: "12px",
                }}>
                  Un chef<br />
                  Des produits frais<br />
                  <span style={{ color: "#4A6741" }}>Chaque matin</span>
                </p>
                <p style={{
                  fontSize: "14px",
                  color: "#6B6B6B",
                  lineHeight: 1.7,
                  maxWidth: "420px",
                }}>
                  Chaque jour, notre chef cuisine à partir de zéro avec des produits frais
                  majoritairement locaux. Rien d&apos;industriel, rien de préparé à l&apos;avance.
                </p>
              </div>

              {/* Séparateur */}
              <div style={{
                height: "1px",
                background: "linear-gradient(to right, #E8E3D8, transparent)",
                margin: "0",
              }} />

              {/* Block 2 */}
              <div>
                <p style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#C4704F",
                  marginBottom: "14px",
                }}>
                  Le service
                </p>
                <p style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  lineHeight: 1.2,
                  color: "#1A1A1A",
                  marginBottom: "12px",
                }}>
                  Sans engagement<br />
                  <span style={{ color: "#C4704F" }}>Clodia s&apos;adapte<br />à votre rythme</span>
                </p>
                <p style={{
                  fontSize: "14px",
                  color: "#6B6B6B",
                  lineHeight: 1.7,
                  maxWidth: "420px",
                }}>
                  Vous commandez la semaine qui vous convient.
                  Vos gardes, vos repos, vos envies —
                  votre choix.
                </p>
              </div>

            </div>
          </div>

          <div className="mt-5 flex items-center">
            {[
              { valeur: "5", label: "Menus différents\nchaque semaine" },
              { valeur: "12h", label: "Livraison dans le frigo\nde votre service" },
              { valeur: "0", label: "Engagement\nni abonnement" },
            ].map((item, i) => (
              <React.Fragment key={item.valeur}>
                {i > 0 && (
                  <div style={{ width: 1, height: 60, background: "#4D0F1F", opacity: 0.2, flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, textAlign: "center", padding: "1.5rem 1rem" }}>
                  <p className="text-3xl font-semibold mb-1" style={{ color: "#1A1A1A" }}>{item.valeur}</p>
                  <p className="text-xs uppercase tracking-widest leading-relaxed" style={{ color: "#6B6B6B" }}>
                    {item.label.split('\n').map((line, j) => (
                      <React.Fragment key={j}>{line}{j === 0 && <br />}</React.Fragment>
                    ))}
                  </p>
                </div>
              </React.Fragment>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/formules"
              className="inline-flex items-center gap-2 bg-[#4A6741] text-white text-sm font-semibold px-8 py-4 rounded-full hover:bg-[#3d5836] transition-colors"
            >
              Je découvre les formules →
            </Link>
          </div>

        </div>
      </section>

      {/* ── 7. FAQ ── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 600, lineHeight: 1.2, color: "#1A1A1A" }}>
              Une question ?<br />
              <span style={{ color: "#FF9933" }}>On a la réponse.</span>
            </h2>
          </div>

          <FAQAccordion items={faqItems.slice(0, 5)} />

          <div className="text-center mt-8">
            <Link href="/faq" className="btn-outline-wine text-sm px-7 py-3 inline-block">
              Voir toutes les questions →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
