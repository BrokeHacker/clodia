"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("clodia_cookies");
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("clodia_cookies", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("clodia_cookies", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-20 left-0 right-0 z-[60] flex justify-center px-4"
    >
      <div
        style={{
          background: "rgba(245,240,232,0.98)",
          backdropFilter: "blur(16px)",
          border: "1px solid #E8E3D8",
          borderRadius: "16px",
          padding: "20px 24px",
          maxWidth: "580px",
          width: "100%",
          boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
        }}
      >
        <div className="flex flex-col gap-4">

          {/* Texte */}
          <div>
            <p style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#1A1A1A",
              marginBottom: "6px",
            }}>
              Vos données, votre choix
            </p>
            <p style={{
              fontSize: "13px",
              color: "#6B6B6B",
              lineHeight: 1.6,
              margin: 0,
            }}>
              Nous utilisons des cookies pour améliorer votre expérience
              et analyser notre trafic. Vos données ne sont jamais
              revendues.{" "}
              <Link
                href="/mentions-legales"
                style={{ color: "#4A6741", textDecoration: "underline" }}
              >
                En savoir plus
              </Link>
            </p>
          </div>

          {/* Boutons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={accept}
              style={{
                backgroundColor: "#4A6741",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 600,
                padding: "9px 22px",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Accepter
            </button>
            <button
              onClick={decline}
              style={{
                backgroundColor: "transparent",
                color: "#6B6B6B",
                fontSize: "13px",
                fontWeight: 500,
                padding: "9px 22px",
                borderRadius: "999px",
                border: "1px solid #E8E3D8",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Refuser
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
