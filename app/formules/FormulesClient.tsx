"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchTarifs, Tarif, getTarifUnitaire } from "@/lib/menus";

function fmt(n: number) {
  return n.toFixed(2).replace(".", ",") + " €";
}

export default function FormulesClient() {
  const [selected, setSelected] = useState(2);
  const [tarifs, setTarifs] = useState<Tarif[]>([]);

  useEffect(() => {
    fetchTarifs().then(setTarifs);
  }, []);

  const precommandePaliers = tarifs
    .filter(t => t.type === 'pre-commande')
    .sort((a, b) => a.repas_de - b.repas_de)
    .map(t => ({
      jours: t.repas_de,
      label: t.repas_a === 99
        ? `${t.repas_de} jours et +`
        : t.repas_a === t.repas_de
        ? `${t.repas_de} jour${t.repas_de > 1 ? 's' : ''}`
        : `${t.repas_de} jours`,
      prix: t.prix_unitaire,
      best: t.repas_de === 3,
    }));

  const prixUnite = getTarifUnitaire(tarifs);
  const current = precommandePaliers[selected] ?? precommandePaliers[0] ?? { jours: 1, prix: 0, label: '' };
  const totalSemaine = current.prix * current.jours;

  if (precommandePaliers.length === 0) return (
    <div style={{ minHeight: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#9B9B9B", fontSize: "14px" }}>Chargement des tarifs...</p>
    </div>
  );

  return (
    <div style={{ background: "#FAFAF8", minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <section style={{
        padding: "48px 24px 32px",
        maxWidth: "1100px", margin: "0 auto",
      }}>
        <h1 style={{
          fontSize: "clamp(36px, 5vw, 64px)",
          fontWeight: 600, color: "#1A1A1A",
          lineHeight: 1.1, letterSpacing: "-0.025em",
          textTransform: "uppercase", margin: 0,
        }}>
          Choisissez<br />
          <span style={{ color: "#4A6741" }}>votre Rythme</span>
        </h1>
      </section>

      {/* ── CONFIGURATEUR PRINCIPAL ── */}
      <section style={{ padding: "0 24px 48px", maxWidth: "1100px", margin: "0 auto" }}>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_420px] gap-8 items-start">

          {/* Gauche — image sticky */}
          <div style={{ position: "sticky", top: "100px" }} className="hidden md:block">
            <div style={{
              position: "relative",
              borderRadius: "20px",
              overflow: "hidden",
              aspectRatio: "3/4",
            }}>
              <Image
                src="/images/plats-clodia.jpg"
                alt="Plats Clodia"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover", objectPosition: "center top" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(26,26,26,0.35) 0%, transparent 60%)",
              }} />
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "24px",
              }}>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", fontStyle: "italic" }}>
                  Cuisiné ce matin, dans votre frigidaire avant midi.
                </p>
              </div>
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
                  <span style={{
                    width: "5px", height: "5px", borderRadius: "50%",
                    background: "#4A6741", display: "inline-block",
                  }} />
                </div>
                <p style={{
                  fontSize: "20px", fontWeight: 600,
                  color: "#1A1A1A", letterSpacing: "-0.01em",
                  textTransform: "uppercase",
                }}>
                  Pré-Commande
                </p>
                <p style={{
                  fontSize: "13px", color: "#1A1A1A", marginTop: "4px",
                  textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600,
                }}>
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
                  {precommandePaliers.map((opt, i) => {
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
                            {opt.jours === 1 ? "plat" : "plats"}
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
                      Prix par plat
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
                      {fmt((prixUnite - current.prix) * current.jours)}
                    </strong>{" "}
                    vs commande à la carte
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div style={{ padding: "20px 28px" }}>
                <Link href="/commander?semaine=suivante" style={{
                  display: "block", textAlign: "center",
                  background: "#4A6741", color: "#fff",
                  fontSize: "14px", fontWeight: 600,
                  padding: "15px", borderRadius: "999px",
                  textDecoration: "none", letterSpacing: "0.01em",
                }}>
                  Je pré-commande {current.jours} plat{current.jours > 1 ? "s" : ""} →
                </Link>
                <p style={{
                  fontSize: "11px", color: "#9B9B9B",
                  textAlign: "center", marginTop: "8px",
                }}>
                  Plat + dessert inclus · Sans engagement
                </p>
              </div>

            </div>

            {/* À la carte */}
            <div style={{
              marginTop: "10px", background: "#fff",
              borderRadius: "16px", border: "1px solid #E8E3D8",
              overflow: "hidden",
            }}>

              {/* Bloc titre */}
              <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #F0EDE6" }}>

                {/* Badge */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "7px",
                  background: "#F5F0E8", borderRadius: "999px",
                  padding: "4px 12px", marginBottom: "14px",
                }}>
                  <span style={{
                    width: "5px", height: "5px", borderRadius: "50%",
                    background: "#C4704F", display: "inline-block",
                  }} />
                  <span style={{
                    fontSize: "10px", fontWeight: 700,
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    color: "#C4704F",
                  }}>
                    Avant minuit la veille
                  </span>
                  <span style={{
                    width: "5px", height: "5px", borderRadius: "50%",
                    background: "#C4704F", display: "inline-block",
                  }} />
                </div>

                <p style={{
                  fontSize: "20px", fontWeight: 600,
                  color: "#1A1A1A", letterSpacing: "-0.01em",
                  textTransform: "uppercase",
                }}>
                  À La Carte
                </p>
                <p style={{
                  fontSize: "13px", color: "#1A1A1A", marginTop: "4px",
                  textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600,
                }}>
                  Réservez vos plats pour la semaine en cours
                </p>
              </div>

              {/* Bloc prix */}
              <div style={{
                padding: "24px 28px",
                borderBottom: "1px solid #F0EDE6",
                background: "#FAFAF8",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div>
                    <p style={{
                      fontSize: "11px", color: "#9B9B9B",
                      textTransform: "uppercase", letterSpacing: "0.08em",
                      marginBottom: "4px",
                    }}>
                      Prix par plat
                    </p>
                    <p style={{
                      fontSize: "40px", fontWeight: 300,
                      color: "#1A1A1A", letterSpacing: "-0.03em",
                      lineHeight: 1,
                    }}>
                      {fmt(prixUnite)}
                    </p>
                  </div>
                  <p style={{
                    fontSize: "11px", color: "#9B9B9B",
                    fontStyle: "italic", textAlign: "right",
                    maxWidth: "120px", lineHeight: 1.4,
                  }}>
                    Sous réserve de disponibilité
                  </p>
                </div>
              </div>

              {/* Bloc CTA */}
              <div style={{ padding: "20px 28px" }}>
                <Link href="/commander?semaine=courante" style={{
                  display: "block", textAlign: "center",
                  background: "#1A1A1A", color: "#fff",
                  fontSize: "14px", fontWeight: 600,
                  padding: "15px", borderRadius: "999px",
                  textDecoration: "none", letterSpacing: "0.01em",
                }}>
                  Commander pour les prochains jours →
                </Link>
                <p style={{
                  fontSize: "11px", color: "#9B9B9B",
                  textAlign: "center", marginTop: "8px",
                }}>
                  Plat + dessert inclus · Sans engagement
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ── WHATSAPP CTA ── */}
      <section style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "0 24px 48px",
      }}>
        <div style={{
          background: "#E8FFF8",
          borderRadius: "20px",
          padding: "28px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "32px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              fontSize: "11px", fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "#25D366", marginBottom: "10px",
            }}>
              Commande rapide
            </p>
            <p style={{
              fontSize: "22px", fontWeight: 600,
              color: "#1A1A1A", lineHeight: 1.2,
              marginBottom: "8px",
            }}>
              Vous préférez commander<br />sur WhatsApp ?
            </p>
            <p style={{
              fontSize: "14px", color: "#6B6B6B",
              lineHeight: 1.6, maxWidth: "400px",
            }}>
              Notre bot vous guide en quelques minutes : choix du menu,
              variante, quantité et paiement — directement dans WhatsApp.
            </p>
          </div>
          <Link href="/whatsapp" style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            background: "#25D366", color: "#fff",
            fontSize: "14px", fontWeight: 600,
            padding: "15px 28px", borderRadius: "999px",
            textDecoration: "none", whiteSpace: "nowrap",
            flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.886a.5.5 0 00.611.611l6.031-1.471A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.882 9.882 0 01-5.031-1.378l-.361-.214-3.736.911.929-3.736-.235-.374A9.859 9.859 0 012.106 12C2.106 6.525 6.525 2.106 12 2.106S21.894 6.525 21.894 12 17.475 21.894 12 21.894z" />
            </svg>
            Commander sur WhatsApp →
          </Link>
        </div>
      </section>

      {/* ── BANDE COMMUNE ── */}
      <section style={{
        background: "#fff", borderTop: "1px solid #E8E3D8",
        padding: "20px 24px",
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
