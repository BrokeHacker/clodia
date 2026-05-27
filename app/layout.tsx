import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import BottomBanner from "@/components/BottomBanner";

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
        <BottomBanner />
      </body>
    </html>
  );
}
