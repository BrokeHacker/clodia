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
          Trois passionnés,<br />
          <span style={{ color: "#C4704F" }}>une évidence</span>
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
              <p style={{ fontSize: 14, color: "#6B6B6B", lineHeight: 1.75 }}>
                Après vingt-cinq ans à enseigner et transmettre, des années en restaurants étoilés,
                Christophe fonde Evidence Traiteur avec une ambition assumée : rendre accessible une
                cuisine généreuse, sincère, qui ne fait aucun compromis sur la qualité. Son frère
                Alexandre, en grand amateur de gastronomie, est convaincu d&apos;une chose : ce niveau
                d&apos;exigence, cette cuisine-là mérite une portée plus large.
              </p>
              <p style={{ fontSize: 14, color: "#6B6B6B", lineHeight: 1.75 }}>
                Alors DRH d&apos;un studio de Jeux Vidéo, Alexandre partage sa vision avec son ami de
                longue date François, passionné d&apos;aventures entrepreneuriales.
              </p>
              <p style={{ fontSize: 14, color: "#6B6B6B", lineHeight: 1.75 }}>
                Tout bascule lorsque François s&apos;installe à Limoges avec sa femme, gynécologue au
                CHU. Au fil des dîners, elle lui raconte la même réalité : entre deux gardes,
                impossible de trouver quelque chose de bon et équilibré à manger.
              </p>
              <p style={{ fontSize: 14, color: "#6B6B6B", lineHeight: 1.75 }}>
                C&apos;est le déclic, il quitte alors son emploi dans la finance et appelle Alexandre
                et Christophe. En quelques minutes, c&apos;est décidé — tous les trois embarquent,
                avec l&apos;envie de développer une offre de restauration sur mesure dédiée au
                personnel soignant.
              </p>

              <div style={{ borderTop: "1px solid #E8E3D8", margin: "2rem 0" }} />

              <p style={{ fontSize: 16, color: "#4D0F1F", fontWeight: 500, lineHeight: 1.75 }}>
                Clodia, c&apos;est aussi et surtout le prénom de leur grand-mère. Une vie à les
                régaler, puis à transmettre ses recettes et son savoir-faire pour résumer ce que la
                cuisine doit apporter : un moment savoureux, sain et chaleureux. C&apos;est exactement
                ce que l&apos;on veut mettre dans chaque barquette jour après jour.
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

      {/* ── CTA FINAL ── */}
      <section style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "64px 64px 96px",
        textAlign: "center",
      }}>
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
          <Link href="/nos-engagements" className="btn-outline-wine text-sm px-8 py-4 inline-block">
            Nos engagements
          </Link>
        </div>
      </section>

    </div>
  );
}
