import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import CookieBanner from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: "Clodia — Repas gastronomiques en milieu hospitalier",
  description:
    "Des repas gastronomiques livrés chaque midi aux soignants du CHU et des cliniques de Limoges. Menus élaborés par un chef Gault & Millau.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=chillax@200,300,400,500,600,700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"
        />
      </head>
      <body className="pb-20">
        <Header />
        <main className="pt-16">{children}</main>
        <Footer />

        <CookieBanner />
        {/* ── FIXED BOTTOM BAR ── */}
        <div
          className="fixed bottom-0 left-0 right-0 z-50"
          style={{
            background: "rgba(245,240,232,0.97)",
            backdropFilter: "blur(16px)",
            borderTop: "1px solid #E8E3D8",
          }}
        >
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-center gap-5">
            <p className="text-sm font-semibold text-[#1A1A1A] whitespace-nowrap">
              Mes menus de la semaine en 1 clic
            </p>
            <Link
              href="/commander"
              className="shrink-0 bg-[#4A6741] hover:bg-[#3d5836] text-white text-sm font-semibold px-7 py-3 rounded-full transition-colors whitespace-nowrap"
            >
              Je choisis →
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
