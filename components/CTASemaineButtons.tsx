"use client";

import Link from "next/link";

interface Props {
  semaine: "courante" | "suivante";
}

export default function CTASemaineButtons({ semaine }: Props) {
  const aujourdhui = new Date();
  const jourSemaine = aujourdhui.getDay();
  const lundiCourant = new Date(aujourdhui);
  lundiCourant.setDate(aujourdhui.getDate() - ((jourSemaine + 6) % 7));
  const lundiSuivant = new Date(lundiCourant);
  lundiSuivant.setDate(lundiCourant.getDate() + 7);
  const formatDate = (d: Date) =>
    d.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });

  if (semaine === "suivante") {
    return (
      <>
        <Link
          href="/commander?semaine=suivante"
          className="bg-[#FD3D6B] hover:bg-[#e8345e] text-white text-sm font-semibold px-7 py-4 rounded-full w-full block text-center transition-colors"
        >
          Je commande pour la semaine du {formatDate(lundiSuivant)}
        </Link>
        <p className="text-xs text-[#00CCCC] text-center mt-2">
          Tarifs préférentiels · Disponibilité garantie · 0 gaspillage
        </p>
      </>
    );
  }

  return (
    <>
      <Link
        href="/commander?semaine=courante"
        className="btn-outline-wine text-sm px-7 py-4 w-full block text-center"
      >
        Je commande pour la semaine du {formatDate(lundiCourant)}
      </Link>
      <p className="text-xs text-gray-400 text-center mt-2">
        Sous réserve des disponibilités restantes.
      </p>
    </>
  );
}
