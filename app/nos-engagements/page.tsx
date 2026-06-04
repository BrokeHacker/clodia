import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Nos engagements — Clodia",
  description:
    "Clodia est né d'une conviction : le personnel soignant mérite de bien manger.",
};

export default function NosEngagementsPage() {
  return (
    <div style={{ background: "#FAFAF8", minHeight: "100vh" }}>

      {/* ── HERO ÉDITORIAL ── */}
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
          Nos<br />
          <span style={{ color: "#4A6741" }}>engagements</span>
        </h1>
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
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 64px" }}>
        <div style={{ height: "1px", background: "#E8E3D8" }} />
      </div>

      {/* ── ENGAGEMENT 1 — PRODUITS FRAIS ── */}
      <section style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "88px 64px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "96px", alignItems: "center",
      }}>
        <div>
          <p style={{
            fontSize: "clamp(56px, 8vw, 100px)",
            fontWeight: 200, color: "#E8E3D8",
            letterSpacing: "-0.04em", lineHeight: 1,
            marginBottom: "0px",
          }}>
            01
          </p>
          <h2 style={{
            fontSize: "clamp(28px, 3.5vw, 44px)",
            fontWeight: 600, color: "#1A1A1A",
            letterSpacing: "-0.02em", lineHeight: 1.1,
            textTransform: "uppercase",
            marginTop: "-16px", marginBottom: "24px",
          }}>
            Produits Frais<br />&amp; Locaux
          </h2>
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
        <div style={{
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
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 64px" }}>
        <div style={{ height: "1px", background: "#E8E3D8" }} />
      </div>

      {/* ── ENGAGEMENT 2 — CHEF ── */}
      <section style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "88px 64px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "96px", alignItems: "center",
      }}>
        <div style={{
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
          <h2 style={{
            fontSize: "clamp(28px, 3.5vw, 44px)",
            fontWeight: 600, color: "#1A1A1A",
            letterSpacing: "-0.02em", lineHeight: 1.1,
            textTransform: "uppercase",
            marginTop: "-16px", marginBottom: "24px",
          }}>
            5 Menus<br />1 Équilibre
          </h2>
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
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 64px" }}>
        <div style={{ height: "1px", background: "#E8E3D8" }} />
      </div>

      {/* ── ENGAGEMENT 3 — ÉCO-RESPONSABLE ── */}
      <section style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "88px 64px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "96px", alignItems: "center",
      }}>
        <div>
          <p style={{
            fontSize: "clamp(56px, 8vw, 100px)",
            fontWeight: 200, color: "#E8E3D8",
            letterSpacing: "-0.04em", lineHeight: 1,
            marginBottom: "0px",
          }}>
            03
          </p>
          <h2 style={{
            fontSize: "clamp(28px, 3.5vw, 44px)",
            fontWeight: 600, color: "#1A1A1A",
            letterSpacing: "-0.02em", lineHeight: 1.1,
            textTransform: "uppercase",
            marginTop: "-16px", marginBottom: "24px",
          }}>
            Un engagement<br />éco-responsable
          </h2>
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
        <div style={{
          position: "relative",
          borderRadius: "20px", overflow: "hidden",
          aspectRatio: "4/3",
        }}>
          <Image
            src="https://images.unsplash.com/photo-1605522561233-768ad7a8fabf?w=800&h=600&fit=crop"
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
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 64px" }}>
        <div style={{ height: "1px", background: "#E8E3D8" }} />
      </div>

      {/* ── CITATION FINALE ── */}
      <section style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "64px 64px",
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

      {/* ── SÉPARATEUR ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 64px" }}>
        <div style={{ height: "1px", background: "#E8E3D8" }} />
      </div>

      {/* ── BOUTONS CTA ── */}
      <section style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "48px 64px 96px",
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
        <Link href="/notre-histoire" style={{
          display: "inline-flex", alignItems: "center",
          gap: "8px", background: "transparent",
          color: "#1A1A1A", fontSize: "14px",
          fontWeight: 600, padding: "15px 32px",
          borderRadius: "999px", textDecoration: "none",
          border: "1px solid #E8E3D8",
        }}>
          Découvrir notre histoire
        </Link>
      </section>

    </div>
  );
}
