"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getSemainesDisponibles } from "@/lib/menus";

interface Props {
  semaine: "courante" | "suivante";
}

export default function CTASemaineButtons({ semaine }: Props) {
  const [semaines, setSemaines] = useState<ReturnType<typeof getSemainesDisponibles> | null>(null);

  useEffect(() => {
    setSemaines(getSemainesDisponibles());
  }, []);

  const semaineSuivante = semaines?.semaineSuivante;

  if (semaine === "suivante") {
    return (
      <>
        <Link
          href="/commander?semaine=suivante"
          className="bg-[#FD3D6B] hover:bg-[#e8345e] text-white text-sm font-semibold px-7 py-4 rounded-full w-full block text-center transition-colors"
        >
          Je pré-commande du {new Date(semaineSuivante?.lundi ?? '').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} au {new Date(semaineSuivante?.vendredi ?? '').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
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
        Je commande pour les prochains jours
      </Link>
      <p className="text-xs text-gray-400 text-center mt-2">
        Sous réserve des disponibilités restantes.
      </p>
    </>
  );
}
