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

      {/* ── BLOC 1 — TITRE ── */}
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
          Trois passionnés,<br />
          <span style={{ color: "#C4704F" }}>Une évidence</span>
        </h1>
        <p style={{
          fontSize: "18px", color: "#6B6B6B",
          lineHeight: 1.75, maxWidth: "520px",
        }}>
          L&apos;histoire de Christophe, Alexandre et François — et d&apos;un prénom de
          grand-mère devenu un projet gastronomique pour les soignants de Limoges.
        </p>
      </section>

      {/* ── SÉPARATEUR ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 64px" }}>
        <div style={{ height: "1px", background: "#E8E3D8" }} />
      </div>

      {/* ── BLOC 2 — TEXTE + PHOTO ── */}
      <section style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "48px 64px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "96px", alignItems: "start",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
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
        <div style={{
          position: "relative",
          borderRadius: "20px", overflow: "hidden",
          aspectRatio: "4/5",
        }}>
          <Image
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=1000&fit=crop"
            alt="Christophe, Alexandre et François — fondateurs de Clodia"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)",
          }} />
          <p style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            color: "rgba(255,255,255,0.8)", fontSize: "12px",
            fontStyle: "italic", padding: "24px",
          }}>
            Christophe, Alexandre &amp; François — fondateurs de Clodia
          </p>
        </div>
      </section>

      {/* ── SÉPARATEUR ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 64px" }}>
        <div style={{ height: "1px", background: "#E8E3D8" }} />
      </div>

      {/* ── BLOC 3 — PARAGRAPHE CLODIA ── */}
      <section style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "48px 64px",
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
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 64px" }}>
        <div style={{ height: "1px", background: "#E8E3D8" }} />
      </div>

      {/* ── BLOC 4 — CTA ── */}
      <section style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "64px 64px 96px",
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
      </section>

    </div>
  );
}
