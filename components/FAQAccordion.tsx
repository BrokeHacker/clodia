"use client";

import { useState } from "react";
import type { FAQItem } from "@/lib/data";

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="bg-white rounded-2xl overflow-hidden border border-gray-100"
          >
            <button
              className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
            >
              <span className="font-medium text-[#4D0F1F] text-sm md:text-base leading-snug">
                {item.question}
              </span>
              <span
                className="shrink-0 text-[#FD3D6B] transition-transform duration-200"
                style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </span>
            </button>

            {isOpen && (
              <div className="px-6 pb-5">
                <p className="text-gray-500 text-sm leading-relaxed">{item.reponse}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
