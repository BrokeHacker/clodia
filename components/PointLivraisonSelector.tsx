"use client";

import { useState } from "react";
import { pointsLivraison } from "@/lib/data";

export default function PointLivraisonSelector() {
  const hopitaux = [...new Set(pointsLivraison.map((p) => p.hopital))];

  const [hopital, setHopital] = useState("CHU Limoges");
  const [batiment, setBatiment] = useState("");
  const [service, setService] = useState("");

  const batiments = [
    ...new Set(
      pointsLivraison
        .filter((p) => p.hopital === hopital)
        .map((p) => p.batiment)
    ),
  ];

  const services = pointsLivraison
    .filter((p) => p.hopital === hopital && p.batiment === batiment)
    .map((p) => ({ service: p.service, id: p.id }));

  const selectedPoint = pointsLivraison.find(
    (p) =>
      p.hopital === hopital && p.batiment === batiment && p.service === service
  );

  function handleHopitalChange(val: string) {
    setHopital(val);
    setBatiment("");
    setService("");
  }

  function handleBatimentChange(val: string) {
    setBatiment(val);
    setService("");
  }

  const selectClass =
    "w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm text-[#4D0F1F] focus:outline-none focus:border-[#FD3D6B] disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start justify-center max-w-3xl mx-auto">

      {/* Colonne gauche — selects */}
      <div className="flex flex-col gap-4 w-full md:w-[420px] shrink-0">
        <select
          value={hopital}
          onChange={(e) => handleHopitalChange(e.target.value)}
          className={selectClass}
        >
          <option value="">Choisissez un hôpital</option>
          {hopitaux.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>

        <select
          value={batiment}
          onChange={(e) => handleBatimentChange(e.target.value)}
          disabled={!hopital}
          className={selectClass}
        >
          <option value="">Choisissez un bâtiment</option>
          {batiments.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          disabled={!batiment}
          className={selectClass}
        >
          <option value="">Choisissez un service</option>
          {services.map((s) => (
            <option key={s.service} value={s.service}>{s.service}</option>
          ))}
        </select>

        {selectedPoint && (
          <div className="bg-[#E8FFF8] rounded-2xl p-5">
            <p className="text-xs font-semibold text-[#00CCCC] uppercase tracking-widest mb-2">
              Votre point de livraison
            </p>
            <p className="text-sm text-[#4D0F1F] leading-relaxed">
              {selectedPoint.description}
            </p>
          </div>
        )}

        {selectedPoint && (
          <a
            href={`/commander?point=${selectedPoint.id}`}
            className="bg-[#FD3D6B] text-white rounded-full px-8 py-4 font-semibold inline-block text-sm hover:bg-[#e8345e] transition-colors text-center"
          >
            Je choisis ce frigidaire →
          </a>
        )}
      </div>

      {/* Colonne droite — encart */}
      <div className="flex flex-col gap-4 w-full md:w-[280px] shrink-0">
        <div className="bg-[#F5F0E8] rounded-2xl p-6">
          <p className="font-semibold text-[#4D0F1F] text-center">
            Aucun frigidaire proche de vous ?
          </p>
          <p className="text-sm text-gray-500 mt-1 text-center leading-relaxed">
            Dites-le nous — on fait notre possible pour ouvrir de nouveaux points de livraison.
          </p>
        </div>
        <a
          href="mailto:contact@clodia.fr?subject=Demande de nouveau point de livraison"
          className="btn-outline-wine text-sm px-7 py-3 inline-block text-center"
        >
          Demander un nouveau point
        </a>
      </div>

    </div>
  );
}
