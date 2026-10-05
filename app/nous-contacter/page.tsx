import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Nous contacter — Clodia",
  description: "Une question, une annulation, un problème de livraison ? Écrivez-nous, nous vous répondons rapidement.",
};

export default async function NousContacterPage({ searchParams }: { searchParams: Promise<{ sujet?: string }> }) {
  const sujet = (await searchParams).sujet === "nouveau_point" ? "nouveau_point" : undefined;
  return (
    <div style={{ background: "#FAFAF8", minHeight: "100vh" }}>
      <section style={{ maxWidth: "620px", margin: "0 auto", padding: "64px 24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 600, color: "#1A1A1A", letterSpacing: "-0.02em", marginBottom: "8px" }}>
          Nous contacter
        </h1>
        <p style={{ fontSize: "14px", color: "#6B6B6B", lineHeight: 1.6, marginBottom: "24px" }}>
          Une modification, une annulation, un problème avec une commande ou une question ? Écrivez-nous, notre équipe vous répond du lundi au vendredi.
        </p>

        <div style={{ background: "#F5F0E8", borderRadius: "12px", padding: "14px 16px", marginBottom: "28px" }}>
          <p style={{ fontSize: "13px", color: "#4D0F1F", lineHeight: 1.6 }}>
            <strong>Vous avez un compte ?</strong> Le plus simple est de faire votre demande depuis votre{" "}
            <Link href="/espace-client/commandes" style={{ color: "#007FFF", fontWeight: 600 }}>espace client</Link>,
            avec le bouton « Modifier ou annuler » (commandes à venir) ou « Faire une demande » (autres commandes) : elle est automatiquement rattachée à la bonne commande et traitée plus vite.
            Pas de compte, ou commande passée sans compte ? Utilisez le formulaire ci-dessous.
          </p>
        </div>

        <ContactForm typeInitial={sujet} />
      </section>
    </div>
  );
}
