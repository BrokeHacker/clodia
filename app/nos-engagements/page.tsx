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
          <span style={{ color: "#4A6741" }}>Engagements.</span>
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
            Nous travaillons en direct avec des producteurs
            du Limousin et du Périgord. Fruits, légumes,
            viandes, produits laitiers — tout est sélectionné
            pour sa fraîcheur et sa qualité. Rien de surgelé,
            jamais.
          </p>
        </div>
        <div style={{
          position: "relative",
          borderRadius: "20px", overflow: "hidden",
          aspectRatio: "4/3",
        }}>
          <Image
            src="/images/plats-clodia.jpg"
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
            src="/images/plats-clodia.jpg"
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
            Un Chef.<br />Chaque Jour.
          </h2>
          <p style={{
            fontSize: "16px", color: "#6B6B6B",
            lineHeight: 1.8, maxWidth: "400px",
            marginBottom: "24px",
          }}>
            Notre chef a été formé dans les meilleures
            maisons françaises et récompensé par le Guide
            Gault &amp; Millau. Chaque semaine, cinq menus
            distincts — avec une alternative végétarienne
            élaborée — cuisinés à partir de zéro.
          </p>
          <div style={{
            display: "inline-flex", alignItems: "center",
            gap: "8px", background: "#EAF3DE",
            borderRadius: "999px", padding: "6px 16px",
          }}>
            <span style={{
              fontSize: "11px", fontWeight: 700,
              color: "#4A6741", letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}>
              Récompensé Gault &amp; Millau
            </span>
          </div>
        </div>
      </section>

      {/* ── SÉPARATEUR ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 64px" }}>
        <div style={{ height: "1px", background: "#E8E3D8" }} />
      </div>

      {/* ── ENGAGEMENTS 3 + 4 — CÔTE À CÔTE ÉDITORIAL ── */}
      <section style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "88px 64px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "64px",
      }}>

        {/* Livraison électrique */}
        <div>
          <p style={{
            fontSize: "clamp(56px, 6vw, 80px)",
            fontWeight: 200, color: "#E8E3D8",
            letterSpacing: "-0.04em", lineHeight: 1,
            marginBottom: "0px",
          }}>
            03
          </p>
          <h2 style={{
            fontSize: "clamp(22px, 2.5vw, 32px)",
            fontWeight: 600, color: "#1A1A1A",
            letterSpacing: "-0.02em", lineHeight: 1.1,
            textTransform: "uppercase",
            marginTop: "-12px", marginBottom: "20px",
          }}>
            Livraison<br />100% Électrique
          </h2>
          <p style={{
            fontSize: "15px", color: "#6B6B6B",
            lineHeight: 1.8,
          }}>
            Toutes nos livraisons sont effectuées en
            véhicule électrique. Un repas gastronomique
            peut aussi être responsable.
          </p>
        </div>

        {/* Emballages */}
        <div style={{ paddingTop: "32px" }}>
          <p style={{
            fontSize: "clamp(56px, 6vw, 80px)",
            fontWeight: 200, color: "#E8E3D8",
            letterSpacing: "-0.04em", lineHeight: 1,
            marginBottom: "0px",
          }}>
            04
          </p>
          <h2 style={{
            fontSize: "clamp(22px, 2.5vw, 32px)",
            fontWeight: 600, color: "#1A1A1A",
            letterSpacing: "-0.02em", lineHeight: 1.1,
            textTransform: "uppercase",
            marginTop: "-12px", marginBottom: "20px",
          }}>
            Emballages<br />Éco-Responsables
          </h2>
          <p style={{
            fontSize: "15px", color: "#6B6B6B",
            lineHeight: 1.8,
          }}>
            Nos emballages sont 100% compostables,
            fabriqués à partir de matériaux naturels.
            Sans plastique, conformément à nos valeurs.
          </p>
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
          fontSize: "clamp(24px, 3.5vw, 48px)",
          fontWeight: 500, color: "#1A1A1A",
          lineHeight: 1.3, letterSpacing: "-0.02em",
          maxWidth: "760px", margin: "0 auto 48px",
        }}>
          &ldquo;Chaque repas Clodia est un acte de soin
          en retour — pour vous, pour la planète,
          pour les producteurs locaux.&rdquo;
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
          <Link href="/commander" style={{
            display: "inline-flex", alignItems: "center",
            gap: "8px", background: "#4A6741",
            color: "#fff", fontSize: "14px",
            fontWeight: 600, padding: "15px 32px",
            borderRadius: "999px", textDecoration: "none",
          }}>
            Je découvre les menus →
          </Link>
          <Link href="/formules" style={{
            display: "inline-flex", alignItems: "center",
            gap: "8px", background: "transparent",
            color: "#1A1A1A", fontSize: "14px",
            fontWeight: 600, padding: "15px 32px",
            borderRadius: "999px", textDecoration: "none",
            border: "1px solid #E8E3D8",
          }}>
            Voir les formules
          </Link>
        </div>
      </section>

    </div>
  );
}
