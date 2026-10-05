import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Qui sommes-nous — Clodia",
  description:
    "L'histoire de Christophe, Alexandre et François, fondateurs de Clodia, et nos engagements : des produits frais, des menus équilibrés et une démarche éco-responsable pour le personnel soignant.",
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

      {/* ══════════ SECTION 1 — NOTRE HISTOIRE ══════════ */}
      <section id="histoire" style={{ scrollMarginTop: "96px" }}>

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

        {/* ── BLOC 2 — TEXTE + PHOTO ── */}
        <section style={{
          maxWidth: "1100px", margin: "0 auto",
          padding: "48px 24px",
          gap: "48px", alignItems: "start",
        }} className="grid grid-cols-1 md:grid-cols-2">
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
          <div className="order-last md:order-none" style={{
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

      </section>

      {/* ── SÉPARATEUR ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: "1px", background: "#E8E3D8" }} />
      </div>

      {/* ══════════ SECTION 2 — NOS ENGAGEMENTS ══════════ */}
      <section id="engagements" style={{ scrollMarginTop: "96px" }}>

        {/* ── HERO ÉDITORIAL ── */}
        <section style={{
          maxWidth: "1100px", margin: "0 auto",
          padding: "48px 24px 40px",
        }}>
          <h2 style={{
            fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: 600, color: "#1A1A1A",
            lineHeight: 1.0, letterSpacing: "-0.025em",
            textTransform: "uppercase",
            margin: "0 0 32px",
            maxWidth: "800px",
          }}>
            Nos<br />
            <span style={{ color: "#4A6741" }}>engagements</span>
          </h2>
          <p style={{
            fontSize: "18px", color: "#6B6B6B",
            lineHeight: 1.75, maxWidth: "520px",
          }}>
            Clodia est né d&apos;une conviction simple :
            ceux qui prennent soin des autres méritent
            qu&apos;on prenne soin d&apos;eux. À table aussi.
          </p>
        </section>

        {/* ── SÉPARATEUR ── */}
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ height: "1px", background: "#E8E3D8" }} />
        </div>

        {/* ── ENGAGEMENT 1 — PRODUITS FRAIS ── */}
        <section style={{
          maxWidth: "1100px", margin: "0 auto",
          padding: "48px 24px",
          gap: "32px", alignItems: "center",
        }} className="grid grid-cols-1 md:grid-cols-2">
          <div>
            <p style={{
              fontSize: "clamp(56px, 8vw, 100px)",
              fontWeight: 200, color: "#E8E3D8",
              letterSpacing: "-0.04em", lineHeight: 1,
              marginBottom: "0px",
            }}>
              01
            </p>
            <h3 style={{
              fontSize: "clamp(28px, 3.5vw, 44px)",
              fontWeight: 600, color: "#1A1A1A",
              letterSpacing: "-0.02em", lineHeight: 1.1,
              textTransform: "uppercase",
              marginTop: "-16px", marginBottom: "24px",
            }}>
              Produits Frais<br />&amp; Locaux
            </h3>
            <p style={{
              fontSize: "16px", color: "#6B6B6B",
              lineHeight: 1.8, maxWidth: "400px",
            }}>
              Nos menus sont élaborés à partir de produits frais,
              majoritairement locaux, sélectionnés avec soin.
              Fruits, légumes, viandes et produits laitiers de saison —
              une exigence quotidienne sur la qualité et la fraîcheur.
            </p>
          </div>
          <div className="order-last md:order-none" style={{
            position: "relative",
            borderRadius: "20px", overflow: "hidden",
            aspectRatio: "4/3",
          }}>
            <Image
              src="/images/Produits 06.jpeg"
              alt="Produits frais Clodia"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover", objectPosition: "center 20%" }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(74,103,65,0.18)",
            }} />
          </div>
        </section>

        {/* ── SÉPARATEUR ── */}
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ height: "1px", background: "#E8E3D8" }} />
        </div>

        {/* ── ENGAGEMENT 2 — CHEF ── */}
        <section style={{
          maxWidth: "1100px", margin: "0 auto",
          padding: "48px 24px",
          gap: "32px", alignItems: "center",
        }} className="grid grid-cols-1 md:grid-cols-2">
          <div className="order-last md:order-first" style={{
            position: "relative",
            borderRadius: "20px", overflow: "hidden",
            aspectRatio: "4/3",
          }}>
            <Image
              src="/images/Produits 14.jpeg"
              alt="Chef Clodia"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover", objectPosition: "center 50%" }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(26,26,26,0.25)",
            }} />
          </div>
          <div>
            <p style={{
              fontSize: "clamp(56px, 8vw, 100px)",
              fontWeight: 200, color: "#E8E3D8",
              letterSpacing: "-0.04em", lineHeight: 1,
              marginBottom: "0px",
            }}>
              02
            </p>
            <h3 style={{
              fontSize: "clamp(28px, 3.5vw, 44px)",
              fontWeight: 600, color: "#1A1A1A",
              letterSpacing: "-0.02em", lineHeight: 1.1,
              textTransform: "uppercase",
              marginTop: "-16px", marginBottom: "24px",
            }}>
              5 Menus<br />1 Équilibre
            </h3>
            <p style={{
              fontSize: "16px", color: "#6B6B6B",
              lineHeight: 1.8, maxWidth: "400px",
            }}>
              Chaque semaine, notre chef compose 5 menus distincts
              pensés pour couvrir l&apos;ensemble des apports nutritionnels.
              Protéines et légumes variés d&apos;un jour à l&apos;autre —
              une approche nutritive conçue spécifiquement
              pour le rythme des soignants.
            </p>
          </div>
        </section>

        {/* ── SÉPARATEUR ── */}
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ height: "1px", background: "#E8E3D8" }} />
        </div>

        {/* ── ENGAGEMENT 3 — ÉCO-RESPONSABLE ── */}
        <section style={{
          maxWidth: "1100px", margin: "0 auto",
          padding: "48px 24px",
          gap: "32px", alignItems: "center",
        }} className="grid grid-cols-1 md:grid-cols-2">
          <div>
            <p style={{
              fontSize: "clamp(56px, 8vw, 100px)",
              fontWeight: 200, color: "#E8E3D8",
              letterSpacing: "-0.04em", lineHeight: 1,
              marginBottom: "0px",
            }}>
              03
            </p>
            <h3 style={{
              fontSize: "clamp(28px, 3.5vw, 44px)",
              fontWeight: 600, color: "#1A1A1A",
              letterSpacing: "-0.02em", lineHeight: 1.1,
              textTransform: "uppercase",
              marginTop: "-16px", marginBottom: "24px",
            }}>
              Un engagement<br />éco-responsable
            </h3>
            <p style={{
              fontSize: "16px", color: "#6B6B6B",
              lineHeight: 1.8, maxWidth: "400px",
            }}>
              De la livraison à l&apos;emballage, chaque détail est pensé
              pour réduire notre impact. Nos trajets sont effectués en
              véhicule 100% électrique, et nos barquettes sont fabriquées
              en carton recyclé.
            </p>
          </div>
          <div className="order-last md:order-none" style={{
            position: "relative",
            borderRadius: "20px", overflow: "hidden",
            aspectRatio: "4/3",
          }}>
            <Image
              src="/images/Barquettes.jpeg"
              alt="Barquettes éco-responsables Clodia"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(74,103,65,0.15)",
            }} />
          </div>
        </section>

        {/* ── SÉPARATEUR ── */}
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ height: "1px", background: "#E8E3D8" }} />
        </div>

        {/* ── CITATION FINALE ── */}
        <section style={{
          maxWidth: "1100px", margin: "0 auto",
          padding: "48px 24px",
          minHeight: "280px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
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
            Clodia, c&apos;est la conviction que bien manger au travail change tout — pour vous, pour votre énergie, pour votre quotidien.
          </p>
        </section>

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
