import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Notre histoire — Clodia",
  description:
    "Trois passionnés, une évidence. L'histoire de Christophe, Alexandre et François — les fondateurs de Clodia.",
};

export default function NotreHistoirePage() {
  return (
    <div style={{ background: "#FAFAF8", minHeight: "100vh" }}>

      {/* ── HERO ÉDITORIAL ── */}
      <section style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "88px 64px 72px",
      }}>
        <p style={{
          fontSize: "11px", fontWeight: 600,
          letterSpacing: "0.16em", textTransform: "uppercase",
          color: "#C4704F", marginBottom: "24px",
        }}>
          Qui sommes-nous
        </p>
        <h1 style={{
          fontSize: "clamp(36px, 5vw, 64px)",
          fontWeight: 600, color: "#1A1A1A",
          lineHeight: 1.0, letterSpacing: "-0.025em",
          textTransform: "uppercase",
          margin: "0 0 32px",
          maxWidth: "800px",
        }}>
          Trois passionnés.<br />
          <span style={{ color: "#C4704F" }}>Une évidence.</span>
        </h1>
        <p style={{
          fontSize: "18px", color: "#6B6B6B",
          lineHeight: 1.75, maxWidth: "520px",
        }}>
          L&apos;histoire de Christophe, Alexandre et François — et d&apos;un prénom de grand-mère
          devenu un projet gastronomique pour les soignants de Limoges.
        </p>
      </section>

      {/* ── SÉPARATEUR ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 64px" }}>
        <div style={{ height: "1px", background: "#E8E3D8" }} />
      </div>

      {/* ── CONTENU PRINCIPAL ── */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "88px 64px" }}>
        <div className="flex flex-col lg:flex-row gap-16 items-start">

          {/* Colonne gauche — texte */}
          <div className="flex-1">
            <div className="flex flex-col gap-5">
              <p className="text-sm text-gray-600 leading-relaxed">
                L&apos;aventure commence en 2020, quand Christophe fonde Evidence Traiteur avec
                une conviction simple : une cuisine généreuse, sincère, qui ne fait aucun
                compromis sur la qualité. Son frère Alexandre est le premier conquis — et il
                pense aussitôt à François, un ami de longue date, pour faire grandir l&apos;idée.
                L&apos;enthousiasme est là, mais le timing ne l&apos;est pas encore.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Tout bascule en 2023. François s&apos;installe à Limoges avec sa femme,
                gynécologue au CHU. Au fil des dîners, elle lui raconte la même réalité :
                entre deux gardes, impossible de trouver quelque chose de bon à manger.
                Ce constat-là, François ne peut plus l&apos;ignorer.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Mi-2025, il franchit le pas. Il quitte son emploi et appelle Alexandre et
                Christophe. En quelques minutes, c&apos;est décidé — tous les trois embarquent,
                avec l&apos;envie de construire quelque chose de concret pour les soignants
                de Limoges.
              </p>
              <p className="text-sm text-[#4D0F1F] font-medium leading-relaxed">
                Clodia, c&apos;est le prénom de leur grand-mère. Un prénom qui porte la douceur
                du fait-maison, la chaleur d&apos;une table familiale — exactement ce qu&apos;on
                veut mettre dans chaque barquette.
              </p>
            </div>
          </div>

          {/* Colonne droite — photo */}
          <div className="lg:w-[420px] shrink-0">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden w-full">
              <Image
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=1000&fit=crop"
                alt="Christophe, Alexandre et François — fondateurs de Clodia"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <p className="absolute bottom-0 left-0 right-0 text-white text-xs italic p-6">
                Christophe, Alexandre &amp; François — fondateurs de Clodia
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── SÉPARATEUR ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 64px" }}>
        <div style={{ height: "1px", background: "#E8E3D8" }} />
      </div>

      {/* ── CITATION FINALE ── */}
      <section style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "96px 64px",
        textAlign: "center",
      }}>
        <p style={{
          fontSize: "clamp(20px, 3vw, 36px)",
          fontWeight: 500, color: "#1A1A1A",
          lineHeight: 1.4, letterSpacing: "-0.01em",
          maxWidth: "760px", margin: "0 auto 48px",
          fontStyle: "italic",
        }}>
          &ldquo;Clodia, c&apos;est le prénom de leur grand-mère. Un prénom qui porte la douceur
          du fait-maison, la chaleur d&apos;une table familiale.&rdquo;
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
          <Link href="/commander" style={{
            display: "inline-flex", alignItems: "center",
            gap: "8px", background: "#4A6741",
            color: "#fff", fontSize: "14px",
            fontWeight: 600, padding: "15px 32px",
            borderRadius: "999px", textDecoration: "none",
          }}>
            Commander →
          </Link>
          <Link href="/nos-engagements" style={{
            display: "inline-flex", alignItems: "center",
            gap: "8px", background: "transparent",
            color: "#1A1A1A", fontSize: "14px",
            fontWeight: 600, padding: "15px 32px",
            borderRadius: "999px", textDecoration: "none",
            border: "1px solid #E8E3D8",
          }}>
            Nos engagements
          </Link>
        </div>
      </section>

    </div>
  );
}
