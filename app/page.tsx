import Image from "next/image";
import Link from "next/link";
import {
  menusCurrentWeek,
  faqItems,
  etapes,
} from "@/lib/data";
import MenuCarousel from "@/components/MenuCarousel";
import FAQAccordion from "@/components/FAQAccordion";
import PointLivraisonSelector from "@/components/PointLivraisonSelector";

const marqueeItems = [
  "Option végétarienne",
  "1 menu du jour — plat + dessert",
  "Livraison avant 12h dans le frigo de votre service",
  "Approche nutritive adaptée au personnel soignant et hospitalier",
];

export default function Home() {
  const doubled = [...marqueeItems, ...marqueeItems];

  return (
    <>
      {/* ── 1. HERO ── */}
      <section className="relative min-h-screen flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=95&auto=format&fit=crop"
          alt="Repas gastronomiques Clodia"
          fill
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
            <Link href="/commander" className="btn-punch text-sm px-7 py-3.5 inline-block">
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
            <h2 className="text-4xl md:text-5xl font-semibold text-[#4A6741]">
              Comment ça marche ?
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-10 items-start">
            {etapes.map((e) => (
              <div key={e.titre} className="flex flex-col text-center">
                <i className={`ti ${e.icone}`} style={{ fontSize: 48, color: "#C4704F" }} />
                <h3 className="text-xl font-semibold text-[#C4704F] mt-5 mb-3 min-h-[56px] flex items-center justify-center">{e.titre}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{e.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/comment-ca-marche" className="text-sm text-[#007FFF] hover:underline">
              En savoir plus →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. NOS MENUS ── */}
      <section className="py-24 bg-[#FFF9D6]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#FF9933] block mb-3">
                Semaine du 26 mai
              </span>
              <h2 className="text-4xl font-semibold text-[#4D0F1F]">
                Les menus de la semaine
              </h2>
            </div>
            <Link
              href="/commander"
              className="btn-punch text-sm px-6 py-3 inline-block shrink-0"
            >
              Je choisis mes menus →
            </Link>
          </div>

          <MenuCarousel menus={menusCurrentWeek} />
        </div>
      </section>

      {/* ── 5. LIVRAISON ── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#00CCCC] block mb-3">
              Proche de vous
            </span>
            <h2 className="text-4xl font-semibold text-[#4D0F1F]">
              Je trouve mon frigidaire
            </h2>
            <p className="text-gray-400 mt-4 max-w-md mx-auto text-sm">
              Sélectionnez votre établissement pour trouver votre point de livraison.
            </p>
          </div>

          <PointLivraisonSelector />
        </div>
      </section>

      {/* ── 6. NOTRE PROMESSE ── */}
      <section className="py-24 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-semibold text-[#1A1A1A] leading-tight">
              Chaque jour, un vrai repas.<br />
              <span className="text-[#4A6741]">Pas un compromis.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">

            <div className="relative rounded-2xl overflow-hidden min-h-[520px]">
              <Image
                src="/images/plats-clodia.jpg"
                alt="Les plats Clodia"
                fill
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
                  Un chef.<br />
                  Des produits frais.<br />
                  <span style={{ color: "#4A6741" }}>Chaque matin.</span>
                </p>
                <p style={{
                  fontSize: "14px",
                  color: "#6B6B6B",
                  lineHeight: 1.7,
                  maxWidth: "420px",
                }}>
                  Rien de surgelé, rien d&apos;industriel. Notre chef cuisine
                  à partir de zéro — avec ce que les producteurs
                  du Limousin ont livré la veille.
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
                  Sans engagement.<br />
                  <span style={{ color: "#C4704F" }}>Clodia s&apos;adapte<br />à votre rythme.</span>
                </p>
                <p style={{
                  fontSize: "14px",
                  color: "#6B6B6B",
                  lineHeight: 1.7,
                  maxWidth: "420px",
                }}>
                  Vous commandez la semaine qui vous convient.
                  Vos gardes, vos repos, vos envies —
                  pas l&apos;inverse.
                </p>
              </div>

              {/* CTA inline */}
              <div>
                <Link
                  href="/commander"
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                  style={{ color: "#4A6741" }}
                >
                  Je découvre les menus
                  <span style={{ fontSize: "18px", lineHeight: 1 }}>→</span>
                </Link>
              </div>

            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-5">
            {/* Card 1 */}
            <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: "#F5F0E8" }}>
              <p className="text-3xl font-semibold mb-1" style={{ color: "#1A1A1A" }}>5</p>
              <p className="text-xs uppercase tracking-widest leading-relaxed" style={{ color: "#6B6B6B" }}>
                Menus différents<br />chaque semaine
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: "#F5F0E8" }}>
              <p className="text-3xl font-semibold mb-1" style={{ color: "#1A1A1A" }}>12h</p>
              <p className="text-xs uppercase tracking-widest leading-relaxed" style={{ color: "#6B6B6B" }}>
                Livraison dans le frigo<br />de votre service
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: "#F5F0E8" }}>
              <p className="text-3xl font-semibold mb-1" style={{ color: "#1A1A1A" }}>0</p>
              <p className="text-xs uppercase tracking-widest leading-relaxed" style={{ color: "#6B6B6B" }}>
                Engagement<br />ni abonnement
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/commander"
              className="inline-flex items-center gap-2 bg-[#4A6741] text-white text-sm font-semibold px-8 py-4 rounded-full hover:bg-[#3d5836] transition-colors"
            >
              Je découvre les menus →
            </Link>
          </div>

        </div>
      </section>

      {/* ── 7. LA PROMESSE ── */}
      <section className="py-24 bg-[#4D0F1F]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#EAFF33] block mb-3">
              Notre promesse
            </span>
            <h2 className="text-4xl font-semibold text-white">
              Une gastronomie sans compromis
            </h2>
            <p className="text-white/50 mt-4 max-w-md mx-auto text-sm">
              Parce que bien manger ne devrait pas être un privilège, même en milieu hospitalier.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: "🌱",
                titre: "Produits frais & locaux",
                desc: "Producteurs du Limousin et du Périgord sélectionnés pour leur qualité. Fruits, légumes et viandes de saison, livrés chaque matin à notre cuisine.",
              },
              {
                icon: "👨‍🍳",
                titre: "Chef Gault & Millau",
                desc: "Nos menus sont créés par un chef distingué au Guide Gault & Millau. Une exigence gastronomique quotidienne, accessible à tous les soignants.",
              },
              {
                icon: "⚡",
                titre: "Livraison 100% électrique",
                desc: "Tous nos trajets de livraison sont effectués en véhicule électrique. Moins d'émissions, plus de saveur : nos engagements vont de pair.",
              },
            ].map((item) => (
              <div key={item.titre} className="text-center">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-3xl mx-auto mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.titre}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/nos-engagements" className="text-sm text-[#EAFF33] hover:underline">
              Tous nos engagements →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 8. FAQ ── */}
      <section className="py-24 bg-[#FFF9D6]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#FF9933] block mb-3">
              Questions fréquentes
            </span>
            <h2 className="text-4xl font-semibold text-[#4D0F1F]">
              Vous avez des questions ?
            </h2>
          </div>

          <FAQAccordion items={faqItems.slice(0, 5)} />

          <div className="text-center mt-8">
            <Link href="/faq" className="text-sm text-[#007FFF] hover:underline">
              Voir toutes les questions →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
