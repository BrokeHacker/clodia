import Image from "next/image";
import Link from "next/link";
import {
  menusCurrentWeek,
  pointsLivraison,
  formules,
  faqItems,
  etapes,
} from "@/lib/data";
import MenuCard from "@/components/MenuCard";
import FAQAccordion from "@/components/FAQAccordion";

const marqueeItems = [
  "Chef Gault & Millau",
  "Livraison avant 12h",
  "CHU & cliniques de Limoges",
  "Option végétarienne",
  "Produits frais & locaux",
  "Véhicule électrique",
  "Paiement sécurisé Stripe",
];

export default function Home() {
  const doubled = [...marqueeItems, ...marqueeItems];

  return (
    <>
      {/* ── 1. HERO ── */}
      <section className="relative min-h-screen flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1547592180-85f173990554?w=1920&h=1080&fit=crop&q=90&auto=format"
          alt="Repas gastronomique"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#4D0F1F]/90 via-[#4D0F1F]/70 to-[#4D0F1F]/30" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 w-full">
          <h1
            className="text-white font-semibold leading-tight mb-6"
            style={{ fontSize: "clamp(40px, 6vw, 72px)", maxWidth: 700 }}
          >
            Vous prenez soin des autres.{" "}
            <span className="text-[#EAFF33]">On prend soin de vous.</span>
          </h1>

          <ul className="flex flex-col gap-3 mb-10 mt-6">
            {[
              "Livré avant 12h directement dans votre frigo de service",
              "Menu du jour élaboré à base de produits frais et de saison",
              "Sans engagement",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <svg
                  className="shrink-0 mt-0.5"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4A6741"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span className="text-white/85 text-base leading-snug">{item}</span>
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
      <section className="bg-[#4D0F1F] py-4 overflow-hidden">
        <div className="animate-marquee">
          {doubled.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-6 text-sm font-medium text-[#EAFF33] whitespace-nowrap px-6"
            >
              {item}
              <span className="w-1.5 h-1.5 rounded-full bg-[#EAFF33]/40 inline-block" />
            </span>
          ))}
        </div>
      </section>

      {/* ── 3. COMMENT ÇA MARCHE ── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#FD3D6B] block mb-3">
              Simple & rapide
            </span>
            <h2 className="text-4xl font-semibold text-[#4D0F1F]">
              Comment ça marche ?
            </h2>
            <p className="text-gray-400 mt-4 max-w-md mx-auto text-sm leading-relaxed">
              Trois étapes suffisent pour profiter chaque midi d&apos;un repas gastronomique.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {etapes.map((e) => (
              <div key={e.numero} className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#EAFF33] flex items-center justify-center text-2xl mx-auto mb-6">
                  {e.icone}
                </div>
                <p className="text-xs font-semibold text-[#FD3D6B] uppercase tracking-widest mb-2">
                  Étape {e.numero}
                </p>
                <h3 className="text-xl font-semibold text-[#4D0F1F] mb-3">{e.titre}</h3>
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
              Voir &amp; commander
            </Link>
          </div>

          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {menusCurrentWeek.map((menu) => (
              <div key={menu.id} className="snap-start shrink-0 w-[260px]">
                <MenuCard menu={menu} />
              </div>
            ))}
          </div>
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
              Points de livraison
            </h2>
            <p className="text-gray-400 mt-4 max-w-md mx-auto text-sm">
              Livraison avant 12h dans ces établissements. Vous ne voyez pas le vôtre ?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {pointsLivraison.map((p) => (
              <div
                key={p.id}
                className="bg-[#E8FFF8] rounded-2xl p-6 flex items-start gap-4"
              >
                <span className="text-3xl">{p.emoji}</span>
                <div>
                  <p className="font-semibold text-[#4D0F1F]">{p.hopital}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{p.batiment}</p>
                  <p className="text-xs text-[#00CCCC] mt-1 font-medium">{p.service}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a
              href="mailto:contact@clodia.fr?subject=Demande de nouveau point de livraison"
              className="btn-outline-wine text-sm px-7 py-3 inline-block"
            >
              Demander un nouveau point
            </a>
          </div>
        </div>
      </section>

      {/* ── 6. LES FORMULES ── */}
      <section className="py-24 bg-[#E8F4FF]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#007FFF] block mb-3">
              Tarifs
            </span>
            <h2 className="text-4xl font-semibold text-[#4D0F1F]">
              À partir de{" "}
              <span className="text-[#FD3D6B]">14,50 €</span>
            </h2>
            <p className="text-gray-400 mt-4 max-w-sm mx-auto text-sm">
              Choisissez la formule qui correspond à vos habitudes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {formules.map((f) => (
              <div
                key={f.id}
                className={`rounded-3xl p-8 flex flex-col ${
                  f.highlight ? "ring-2 ring-[#FD3D6B] shadow-lg" : ""
                }`}
                style={{ background: f.couleur }}
              >
                {f.highlight && (
                  <span className="bg-[#FD3D6B] text-white text-xs font-semibold px-3 py-1 rounded-full self-start mb-4">
                    Le plus populaire
                  </span>
                )}
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-4"
                  style={{ color: f.couleurBadge }}
                >
                  {f.nom}
                </p>
                <p className="text-4xl font-semibold text-[#4D0F1F] mb-1">
                  {f.prix.toFixed(2).replace(".", ",")} €
                </p>
                <p className="text-xs text-gray-400 mb-4">{f.unite}</p>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">{f.tagline}</p>
                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {f.avantages.map((a, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span style={{ color: f.couleurBadge }} className="shrink-0 font-bold">✓</span>
                      {a}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/commander"
                  className={`block text-center text-sm font-semibold py-3 rounded-full transition-colors ${
                    f.highlight
                      ? "bg-[#FD3D6B] text-white hover:bg-[#e8345e]"
                      : "border border-[#4D0F1F]/30 text-[#4D0F1F] hover:bg-[#4D0F1F] hover:text-white"
                  }`}
                >
                  Choisir cette formule
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/formules" className="text-sm text-[#007FFF] hover:underline">
              Voir le détail des formules →
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
