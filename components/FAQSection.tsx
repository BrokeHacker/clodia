"use client";

import { useState } from "react";
import type { FAQItem } from "@/lib/data";
import FAQAccordion from "@/components/FAQAccordion";

export interface FAQCategorie {
  titre: string;
  icone: string;
  couleur: string;
  ids: number[];
}

export default function FAQSection({ items, categories }: { items: FAQItem[]; categories: FAQCategorie[] }) {
  const [active, setActive] = useState<string | null>(null);
  const courante = categories.find((c) => c.titre === active) ?? null;
  const affichees = courante ? items.filter((i) => courante.ids.includes(i.id)) : items;

  return (
    <>
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const selectionnee = cat.titre === active;
              return (
                <button
                  key={cat.titre}
                  type="button"
                  aria-pressed={selectionnee}
                  onClick={() => setActive(selectionnee ? null : cat.titre)}
                  className="rounded-2xl p-5 text-center cursor-pointer transition-all hover:opacity-80"
                  style={{
                    background: cat.couleur,
                    border: selectionnee ? "2px solid #4D0F1F" : "2px solid transparent",
                    opacity: active && !selectionnee ? 0.6 : 1,
                  }}
                >
                  <div className="text-3xl mb-2">{cat.icone}</div>
                  <p className="text-sm font-semibold text-[#4D0F1F]">{cat.titre}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-16 pt-4 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          {courante && (
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                {courante.icone} {courante.titre} · {affichees.length} question{affichees.length > 1 ? "s" : ""}
              </p>
              <button type="button" onClick={() => setActive(null)} className="text-sm font-semibold text-[#FD3D6B] hover:underline">
                Toutes les questions
              </button>
            </div>
          )}
          <FAQAccordion key={active ?? "toutes"} items={affichees} />
        </div>
      </section>
    </>
  );
}
