"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";

interface Menu {
  id: string | number;
  plat: string;
  platVege?: string;
  dessert?: string;
  photo?: string;
  jourSemaine?: string;
  date_livraison?: string;
}

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

function formatJourDate(menu: Menu, index: number): string {
  const joursNoms = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
  const moisNoms = [
    "jan.", "fév.", "mar.", "avr.", "mai", "juin",
    "juil.", "août", "sep.", "oct.", "nov.", "déc."
  ];

  if (menu.date_livraison) {
    const parts = menu.date_livraison.split("T")[0].split("-");
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const day = parseInt(parts[2]);
    const date = new Date(year, month, day);
    const jourNom = joursNoms[date.getDay() === 0 ? 6 : date.getDay() - 1];
    return `${jourNom} ${day} ${moisNoms[month]}`;
  }

  return joursNoms[index % joursNoms.length];
}
const CARD_W = 340;
const CARD_GAP = 16;
const UNIT = CARD_W + CARD_GAP;

export default function MenuCarousel({ menus }: { menus: Menu[] }) {
  const total = menus.length;
  const loopWidth = total * UNIT;

  const items = [...menus, ...menus, ...menus];

  const [offset, setOffset] = useState(-loopWidth);
  const offsetRef = useRef(-loopWidth);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startOffset = useRef(0);
  const animRef = useRef<number>(0);
  const [active, setActive] = useState(0);

  const normalize = useCallback((val: number) => {
    if (val > -UNIT * 0.5) return val - loopWidth;
    if (val < -loopWidth - UNIT * 0.5) return val + loopWidth;
    return val;
  }, [loopWidth]);

  const getActive = useCallback((val: number) => {
    const normalized = (((-val - loopWidth) % loopWidth) + loopWidth) % loopWidth;
    return Math.round(normalized / UNIT) % total;
  }, [loopWidth, total]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    cancelAnimationFrame(animRef.current);
    isDragging.current = true;
    startX.current = e.clientX;
    startOffset.current = offsetRef.current;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const delta = e.clientX - startX.current;
    const next = normalize(startOffset.current + delta);
    offsetRef.current = next;
    setOffset(next);
    setActive(getActive(next));
  }, [normalize, getActive]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const nearest = Math.round(-offsetRef.current / UNIT) * -UNIT;
    const normalized = normalize(nearest);
    const from = offsetRef.current;
    const distance = normalized - from;
    const duration = Math.min(Math.abs(distance) * 0.4, 220);
    const start = performance.now();

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = from + distance * ease;
      offsetRef.current = current;
      setOffset(current);
      setActive(getActive(current));
      if (progress < 1) {
        animRef.current = requestAnimationFrame(step);
      }
    };
    animRef.current = requestAnimationFrame(step);
  }, [normalize, getActive]);

  const goTo = useCallback((dir: number) => {
    cancelAnimationFrame(animRef.current);

    const normalizedCurrent = normalize(offsetRef.current);
    offsetRef.current = normalizedCurrent;

    const target = normalizedCurrent - dir * UNIT;
    const from = normalizedCurrent;
    const distance = target - from;
    const duration = 320;
    const start = performance.now();

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = from + distance * ease;
      const normalized = normalize(current);
      offsetRef.current = normalized;
      setOffset(normalized);
      setActive(getActive(normalized));
      if (progress < 1) animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
  }, [normalize, getActive]);

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  return (
    <div className="w-full">
      <style>{`.cc { cursor: grab; } .cc:active { cursor: grabbing; }`}</style>

      {/* ── Fenêtre ── */}
      <div className="relative overflow-hidden rounded-2xl" style={{ height: 480 }}>

        {/* ── Track ── */}
        <div
          className="cc flex h-full select-none"
          style={{
            width: `${items.length * UNIT}px`,
            transform: `translateX(${offset}px)`,
            willChange: "transform",
            gap: CARD_GAP,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {items.map((menu, i) => {
            const realIdx = i % total;

            return (
              <div
                key={i}
                style={{ width: CARD_W, flexShrink: 0, height: "100%" }}
                className="relative rounded-2xl overflow-hidden"
              >
                {menu.photo ? (
                  <Image
                    src={menu.photo}
                    alt={menu.plat}
                    fill
                    className="object-cover pointer-events-none"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#3a2010] to-[#6a4030]" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                <div className="absolute top-4 left-4 pointer-events-none">
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "rgba(255,255,255,0.95)",
                    color: "#1A1A1A",
                    fontSize: "12px",
                    fontWeight: 600,
                    padding: "5px 14px",
                    borderRadius: "999px",
                    whiteSpace: "nowrap",
                    letterSpacing: "0.01em",
                  }}>
                    {formatJourDate(menu, realIdx)}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none">
                  <p style={{ color: "#ffffff", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
                    Plat du jour
                  </p>
                  <h3 className="text-white font-semibold text-base leading-tight mb-2.5 line-clamp-2">
                    {menu.plat}
                  </h3>
                  <div className="flex flex-col gap-1.5">
                    {menu.dessert && (
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        gap: "6px",
                        backgroundColor: "rgba(255,255,255,0.88)",
                        color: "#1A1A1A",
                        fontSize: "11px",
                        fontWeight: 500,
                        padding: "4px 10px",
                        borderRadius: "999px",
                        boxSizing: "border-box",
                      }}>
                        <span style={{ color: "#6B6B6B", fontSize: "10px", flexShrink: 0 }}>
                          Dessert ·
                        </span>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {menu.dessert}
                        </span>
                      </span>
                    )}
                    {menu.platVege && (
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        gap: "6px",
                        backgroundColor: "rgba(74,103,65,0.75)",
                        border: "1px solid rgba(74,103,65,0.9)",
                        color: "rgba(255,255,255,0.92)",
                        fontSize: "11px",
                        fontWeight: 500,
                        padding: "4px 10px",
                        borderRadius: "999px",
                        boxSizing: "border-box",
                      }}>
                        <span style={{ flexShrink: 0 }}>🌿</span>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {menu.platVege}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Flèches */}
        <button
          onClick={() => goTo(-1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Précédent"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => goTo(1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Suivant"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Indicateurs */}
      <div className="flex justify-center gap-2 mt-4">
        {menus.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i - active)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active
                ? "w-8 bg-[#4D0F1F]"
                : "w-2.5 bg-[#4D0F1F]/20 hover:bg-[#4D0F1F]/40"
            }`}
          />
        ))}
      </div>

    </div>
  );
}
