import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Qui sommes-nous — Clodia",
  description:
    "Trois passionnés, une évidence. L'histoire de Christophe, Alexandre et François, les fondateurs de Clodia, et d'un prénom de grand-mère devenu un projet pour les soignants de Limoges.",
  alternates: { canonical: "/qui-sommes-nous" },
  openGraph: {
    title: "Qui sommes-nous — Clodia",
    description:
      "Trois passionnés, une évidence. L'histoire de Christophe, Alexandre et François, les fondateurs de Clodia.",
    url: "/qui-sommes-nous",
    siteName: "Clodia",
    locale: "fr_FR",
    type: "website",
  },
};

export default function QuiSommesNousPage() {
  return (
    <div style={{ background: "#FAFAF8", minHeight: "100vh" }}>

      {/* ── BANDEAU D'EN-TÊTE ── */}
      <section style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "88px 24px 40px",
      }}>
        <h1 style={{
          fontSize: "clamp(36px, 5vw, 64px)",
          fontWeight: 600, color: "#1A1A1A",
          lineHeight: 1.0, letterSpacing: "-0.025em",
          textTransform: "uppercase",
          margin: 0,
          maxWidth: "800px",
        }}>
          Qui sommes-nous
        </h1>
      </section>

      {/* ── SÉPARATEUR ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: "1px", background: "#E8E3D8" }} />
      </div>

      {/* ── BLOC 1 — TITRE ── */}
      <section style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "88px 24px 72px",
      }}>
        <h2 style={{
          fontSize: "clamp(36px, 5vw, 64px)",
          fontWeight: 600, color: "#1A1A1A",
          lineHeight: 1.0, letterSpacing: "-0.025em",
          textTransform: "uppercase",
          margin: "0 0 32px",
          maxWidth: "800px",
        }}>
          Trois passionnés,<br />
          <span style={{ color: "#C4704F" }}>Une évidence</span>
        </h2>
        <p style={{
          fontSize: "18px", color: "#6B6B6B",
          lineHeight: 1.75, maxWidth: "520px",
        }}>
          L&apos;histoire de Christophe, Alexandre et François — et d&apos;un prénom de
          grand-mère devenu un projet gastronomique pour les soignants de Limoges.
        </p>
      </section>

      {/* ── SÉPARATEUR ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: "1px", background: "#E8E3D8" }} />
      </div>

      {/* ── BLOC 2 — TEXTE ── */}
      <section style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "48px 24px",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "720px" }}>
          <p style={{ fontSize: "16px", color: "#6B6B6B", lineHeight: 1.8 }}>
            Après vingt-cinq ans à enseigner et transmettre, des années en restaurants étoilés,
            Christophe fonde Evidence Traiteur avec une ambition assumée : rendre accessible une
            cuisine généreuse, sincère, qui ne fait aucun compromis sur la qualité. Son frère
            Alexandre, en grand amateur de gastronomie, est convaincu d&apos;une chose : ce niveau
            d&apos;exigence, cette cuisine-là mérite une portée plus large.
          </p>
          <p style={{ fontSize: "16px", color: "#6B6B6B", lineHeight: 1.8 }}>
            Alors DRH d&apos;un studio de Jeux Vidéo, Alexandre partage sa vision avec son ami de
            longue date François, passionné d&apos;aventures entrepreneuriales.
          </p>
          <p style={{ fontSize: "16px", color: "#6B6B6B", lineHeight: 1.8 }}>
            Tout bascule lorsque François s&apos;installe à Limoges avec sa femme, gynécologue au
            CHU. Au fil des dîners, elle lui raconte la même réalité : entre deux gardes,
            impossible de trouver quelque chose de bon et équilibré à manger.
          </p>
          <p style={{ fontSize: "16px", color: "#6B6B6B", lineHeight: 1.8 }}>
            C&apos;est le déclic, il appelle Alexandre et Christophe et en quelques minutes,
            c&apos;est décidé — il quitte son emploi dans la finance et tous les trois embarquent,
            avec l&apos;envie de développer une offre de restauration sur mesure dédiée au
            personnel soignant.
          </p>
        </div>
      </section>

      {/* ── SÉPARATEUR ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: "1px", background: "#E8E3D8" }} />
      </div>

      {/* ── BLOC 3 — PARAGRAPHE CLODIA ── */}
      <section style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "48px 24px",
      }}>
        <p style={{
          fontSize: "clamp(18px, 2vw, 24px)",
          color: "#4D0F1F",
          fontWeight: 500,
          lineHeight: 1.8,
          maxWidth: "720px",
          margin: "0 auto",
          textAlign: "center",
        }}>
          Clodia, c&apos;est aussi et surtout le prénom de leur grand-mère. Une vie à les
          régaler, puis à transmettre ses recettes et son savoir-faire pour résumer ce que la
          cuisine doit apporter : un moment savoureux, sain et chaleureux. C&apos;est exactement
          ce que l&apos;on veut mettre dans chaque barquette jour après jour.
        </p>
      </section>

      {/* ── SÉPARATEUR ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: "1px", background: "#E8E3D8" }} />
      </div>

      {/* ── CTA FINAL ── */}
      <section style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "64px 24px 96px",
        display: "flex", justifyContent: "center",
        alignItems: "center", gap: "16px",
        flexWrap: "wrap",
      }}>
        <Link href="/formules" style={{
          display: "inline-flex", alignItems: "center",
          gap: "8px", background: "#4A6741",
          color: "#fff", fontSize: "14px",
          fontWeight: 600, padding: "15px 32px",
          borderRadius: "999px", textDecoration: "none",
        }}>
          Je découvre les formules →
        </Link>
      </section>

    </div>
  );
}
