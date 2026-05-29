"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const PRECOMMANDE = [
  { jours: 1, label: "1 jour",  prix: 13.40 },
  { jours: 2, label: "2 jours", prix: 13.40 },
  { jours: 3, label: "3 jours", prix: 12.90, best: true },
  { jours: 4, label: "4 jours", prix: 12.50 },
  { jours: 5, label: "5 jours", prix: 12.20 },
];

const GROUPEE = [
  { label: "5 – 10 repas",  prix: 12.90 },
  { label: "11 – 15 repas", prix: 12.50 },
  { label: "16 – 20 repas", prix: 12.20 },
  { label: "21 repas +",    prix: 11.95 },
];

function fmt(n: number) {
  return n.toFixed(2).replace(".", ",") + " €";
}

function ImageHover({
  children,
  style,
  hoverStyle,
}: {
  children: React.ReactNode;
  style: React.CSSProperties;
  hoverStyle: React.CSSProperties;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ ...style, ...(hovered ? hoverStyle : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </div>
  );
}

export default function FormulesClient() {
  const [selected, setSelected] = useState(2);

  const current = PRECOMMANDE[selected];
  const totalSemaine = current.prix * current.jours;

  return (
    <div style={{ background: "#FAFAF8", minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <section style={{
        padding: "72px 48px 56px",
        maxWidth: "1100px", margin: "0 auto",
      }}>
        <p style={{
          fontSize: "11px", fontWeight: 600, letterSpacing: "0.14em",
          textTransform: "uppercase", color: "#4A6741", marginBottom: "16px",
        }}>
          Nos formules
        </p>
        <h1 style={{
          fontSize: "clamp(36px, 5vw, 64px)",
          fontWeight: 600, color: "#1A1A1A",
          lineHeight: 1.1, letterSpacing: "-0.025em",
          textTransform: "uppercase", margin: 0,
        }}>
          Choisissez<br />
          <span style={{ color: "#4A6741" }}>Votre Rythme.</span>
        </h1>
      </section>

      {/* ── CONFIGURATEUR PRINCIPAL ── */}
      <section style={{ padding: "0 48px 80px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 420px",
          gap: "48px", alignItems: "start",
        }}>

          {/* Gauche — layout images dynamique */}
          <div style={{
            position: "relative",
            height: "100%",
            minHeight: "580px",
          }}>

            {/* Image principale */}
            <ImageHover
              style={{
                position: "absolute",
                top: "2%", left: 0,
                width: "75%", height: "62%",
                borderRadius: "20px",
                overflow: "hidden",
                transform: "rotate(-1.5deg)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.14)",
                zIndex: 2,
                transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s ease",
              }}
              hoverStyle={{
                transform: "rotate(-0.5deg) scale(1.02)",
                boxShadow: "0 20px 56px rgba(0,0,0,0.20)",
              }}
            >
              <Image
                src="/images/plats-clodia.jpg"
                alt="Plats Clodia"
                fill
                style={{ objectFit: "cover", objectPosition: "center top" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(26,26,26,0.35) 0%, transparent 60%)",
              }} />
            </ImageHover>

            {/* Image secondaire */}
            <ImageHover
              style={{
                position: "absolute",
                bottom: "2%", right: 0,
                width: "68%", height: "55%",
                borderRadius: "20px",
                overflow: "hidden",
                transform: "rotate(1.8deg)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                zIndex: 3,
                transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s ease",
              }}
              hoverStyle={{
                transform: "rotate(0.8deg) scale(1.02)",
                boxShadow: "0 20px 56px rgba(0,0,0,0.18)",
              }}
            >
              <Image
                src="/images/plats-clodia.jpg"
                alt="Plats Clodia détail"
                fill
                style={{ objectFit: "cover", objectPosition: "center 65%" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "rgba(74,103,65,0.20)",
              }} />
            </ImageHover>

            {/* Badge texte circulaire */}
            <div style={{
              position: "absolute",
              top: "4%",
              right: "26%",
              zIndex: 6,
              width: "150px",
              height: "150px",
              animation: "spin 16s linear infinite",
            }}>
              <style>{`
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
              `}</style>
              <svg viewBox="0 0 150 150" width="150" height="150">
                <defs>
                  <path
                    id="txt-circle"
                    d="M 75,75 m -62,0 a 62,62 0 1,1 124,0 a 62,62 0 1,1 -124,0"
                  />
                </defs>
                {/* Anneau de fond */}
                <circle
                  cx="75" cy="75" r="62"
                  fill="none"
                  stroke="#4A6741"
                  strokeWidth="22"
                />
                {/* Texte blanc par dessus */}
                <text
                  fontSize="9.2"
                  fontWeight="800"
                  fill="#ffffff"
                  letterSpacing="3.4"
                >
                  <textPath href="#txt-circle" startOffset="0%">
                    {"LIVRÉ DANS VOTRE FRIGO DE SERVICE AVANT 12H   ·   "}
                  </textPath>
                </text>
              </svg>
            </div>

          </div>

          {/* Droite — configurateur */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>

            {/* Card configurateur */}
            <div style={{
              background: "#fff", borderRadius: "20px",
              border: "1px solid #E8E3D8", overflow: "hidden",
            }}>

              {/* Header card */}
              <div style={{ padding: "28px 28px 24px", borderBottom: "1px solid #F0EDE6" }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "7px",
                  background: "#EAF3DE", borderRadius: "999px",
                  padding: "4px 12px", marginBottom: "14px",
                }}>
                  <span style={{
                    width: "5px", height: "5px", borderRadius: "50%",
                    background: "#4A6741", display: "inline-block",
                  }} />
                  <span style={{
                    fontSize: "10px", fontWeight: 700,
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    color: "#4A6741",
                  }}>
                    Avant mercredi 22h
                  </span>
                </div>
                <p style={{
                  fontSize: "20px", fontWeight: 600,
                  color: "#1A1A1A", letterSpacing: "-0.01em",
                  textTransform: "uppercase",
                }}>
                  Pré-Commande
                </p>
                <p style={{ fontSize: "13px", color: "#9B9B9B", marginTop: "4px" }}>
                  Réservez vos repas pour la semaine suivante
                </p>
              </div>

              {/* Sélecteur jours */}
              <div style={{ padding: "24px 28px", borderBottom: "1px solid #F0EDE6" }}>
                <p style={{
                  fontSize: "11px", fontWeight: 600,
                  color: "#9B9B9B", textTransform: "uppercase",
                  letterSpacing: "0.1em", marginBottom: "12px",
                }}>
                  Combien de jours par semaine ?
                </p>
                <style>{`
                  .day-btn { transition: all 0.18s cubic-bezier(0.4,0,0.2,1); }
                  .day-btn:hover { transform: translateY(-2px); box-shadow: 0 0 0 2px #4A6741, 0 6px 18px rgba(74,103,65,0.14) !important; }
                  .day-btn:active { transform: translateY(0px); }
                `}</style>

                <div style={{ display: "flex", gap: "8px" }}>
                  {PRECOMMANDE.map((opt, i) => {
                    const isSelected = selected === i;
                    const isBest = opt.best;
                    return (
                      <button
                        key={i}
                        className="day-btn"
                        onClick={() => setSelected(i)}
                        style={{
                          flex: 1,
                          padding: "0",
                          borderRadius: "14px",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "center",
                          position: "relative",
                          background: "#fff",
                          boxShadow: isSelected
                            ? "0 0 0 2.5px #4A6741, 0 4px 16px rgba(74,103,65,0.18)"
                            : isBest
                            ? "0 0 0 1.5px #C4704F, 0 2px 8px rgba(196,112,79,0.08)"
                            : "0 0 0 1px #E8E3D8, 0 2px 4px rgba(0,0,0,0.04)",
                        }}
                      >
                        {/* Badge best-seller */}
                        {isBest && (
                          <span style={{
                            position: "absolute",
                            top: "-9px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "#C4704F",
                            color: "#fff",
                            fontSize: "7px",
                            fontWeight: 800,
                            padding: "2px 7px",
                            borderRadius: "999px",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                          }}>
                            Best-seller
                          </span>
                        )}

                        <div style={{
                          padding: "15px 4px 11px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "3px",
                        }}>
                          <span style={{
                            fontSize: "20px",
                            fontWeight: 800,
                            color: isSelected ? "#4A6741" : "#1A1A1A",
                            lineHeight: 1,
                            letterSpacing: "-0.02em",
                          }}>
                            {opt.jours}
                          </span>
                          <span style={{
                            fontSize: "8px",
                            fontWeight: 600,
                            color: isSelected ? "#4A6741" : "#B0ACA6",
                            textTransform: "uppercase",
                            letterSpacing: "0.07em",
                          }}>
                            {opt.jours === 1 ? "jour" : "jours"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Prix dynamique */}
              <div style={{
                padding: "24px 28px",
                borderBottom: "1px solid #F0EDE6",
                background: "#FAFAF8",
              }}>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "flex-end",
                }}>
                  <div>
                    <p style={{
                      fontSize: "11px", color: "#9B9B9B",
                      textTransform: "uppercase", letterSpacing: "0.08em",
                      marginBottom: "4px",
                    }}>
                      Prix par repas
                    </p>
                    <p style={{
                      fontSize: "40px", fontWeight: 300,
                      color: "#1A1A1A", letterSpacing: "-0.03em",
                      lineHeight: 1,
                    }}>
                      {fmt(current.prix)}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{
                      fontSize: "11px", color: "#9B9B9B",
                      textTransform: "uppercase", letterSpacing: "0.08em",
                      marginBottom: "4px",
                    }}>
                      Total semaine
                    </p>
                    <p style={{
                      fontSize: "22px", fontWeight: 600,
                      color: "#4A6741", letterSpacing: "-0.02em",
                    }}>
                      {fmt(totalSemaine)}
                    </p>
                  </div>
                </div>

                <div style={{
                  marginTop: "12px", padding: "8px 12px",
                  background: "#EAF3DE", borderRadius: "8px",
                  display: "flex", alignItems: "center", gap: "6px",
                }}>
                  <span style={{ fontSize: "12px" }}>🌿</span>
                  <p style={{ fontSize: "12px", color: "#4A6741", fontWeight: 500, margin: 0 }}>
                    Vous économisez{" "}
                    <strong>
                      {fmt((13.90 - current.prix) * current.jours)}
                    </strong>{" "}
                    vs commande à la carte
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div style={{ padding: "20px 28px" }}>
                <Link href="/commander" style={{
                  display: "block", textAlign: "center",
                  background: "#4A6741", color: "#fff",
                  fontSize: "14px", fontWeight: 600,
                  padding: "15px", borderRadius: "999px",
                  textDecoration: "none", letterSpacing: "0.01em",
                }}>
                  Je pré-commande {current.jours} jour{current.jours > 1 ? "s" : ""} →
                </Link>
                <p style={{
                  fontSize: "11px", color: "#9B9B9B",
                  textAlign: "center", marginTop: "8px",
                }}>
                  Plat + dessert · Sans engagement
                </p>
              </div>

            </div>

            {/* Groupée */}
            <div style={{
              marginTop: "12px", background: "#fff",
              borderRadius: "16px", border: "1px solid #E8E3D8",
              overflow: "hidden",
            }}>
              <div style={{ padding: "20px 24px" }}>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", marginBottom: "12px",
                }}>
                  <div>
                    <p style={{
                      fontSize: "14px", fontWeight: 600,
                      color: "#1A1A1A", textTransform: "uppercase",
                      letterSpacing: "0.02em",
                    }}>
                      Commande Groupée
                    </p>
                    <p style={{ fontSize: "12px", color: "#9B9B9B", marginTop: "2px" }}>
                      Pour votre équipe · 5 repas minimum
                    </p>
                  </div>
                  <p style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A" }}>
                    Dès 11,95 €
                    <span style={{ fontSize: "11px", fontWeight: 400, color: "#9B9B9B" }}> /repas</span>
                  </p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
                  {GROUPEE.map((g) => (
                    <div key={g.label} style={{
                      display: "flex", justifyContent: "space-between",
                      padding: "7px 10px", borderRadius: "8px",
                      background: "#FAFAF8",
                    }}>
                      <span style={{ fontSize: "12px", color: "#6B6B6B" }}>{g.label}</span>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#1A1A1A" }}>
                        {fmt(g.prix)}
                      </span>
                    </div>
                  ))}
                </div>
                <Link href="/commander" style={{
                  display: "block", textAlign: "center",
                  background: "#F5F0E8", color: "#1A1A1A",
                  fontSize: "13px", fontWeight: 600,
                  padding: "12px", borderRadius: "999px",
                  textDecoration: "none", marginTop: "14px",
                  border: "1px solid #E8E3D8",
                }}>
                  Commander pour l&apos;équipe →
                </Link>
              </div>
            </div>

            {/* À la carte */}
            <div style={{
              marginTop: "10px", background: "#fff",
              borderRadius: "16px", border: "1px solid #E8E3D8",
              padding: "18px 24px",
              display: "flex", alignItems: "center",
              justifyContent: "space-between", gap: "16px",
            }}>
              <div>
                <p style={{
                  fontSize: "14px", fontWeight: 600, color: "#1A1A1A",
                  textTransform: "uppercase", letterSpacing: "0.02em",
                }}>
                  À La Carte
                </p>
                <p style={{ fontSize: "12px", color: "#9B9B9B", marginTop: "2px" }}>
                  Jusqu&apos;à minuit la veille · Dispo limitée
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
                <p style={{
                  fontSize: "18px", fontWeight: 300,
                  color: "#1A1A1A", letterSpacing: "-0.02em",
                }}>
                  13,90 €
                  <span style={{ fontSize: "11px", fontWeight: 400, color: "#9B9B9B", marginLeft: "3px" }}>
                    /repas
                  </span>
                </p>
                <Link href="/commander" style={{
                  background: "#1A1A1A", color: "#fff",
                  fontSize: "12px", fontWeight: 600,
                  padding: "10px 18px", borderRadius: "999px",
                  textDecoration: "none", whiteSpace: "nowrap",
                }}>
                  Commander →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── BANDE COMMUNE ── */}
      <section style={{
        background: "#fff", borderTop: "1px solid #E8E3D8",
        padding: "28px 48px",
      }}>
        <div style={{
          maxWidth: "1100px", margin: "0 auto",
          display: "flex", justifyContent: "center",
          gap: "40px", flexWrap: "wrap",
        }}>
          {[
            "Livraison incluse avant 12h",
            "Option végétarienne disponible",
            "Paiement sécurisé Stripe",
            "Aucun abonnement automatique",
          ].map((item) => (
            <span key={item} style={{
              fontSize: "13px", color: "#9B9B9B",
              display: "flex", alignItems: "center", gap: "7px",
            }}>
              <span style={{
                width: "4px", height: "4px", borderRadius: "50%",
                background: "#4A6741", display: "inline-block",
              }} />
              {item}
            </span>
          ))}
        </div>
      </section>

    </div>
  );
}
