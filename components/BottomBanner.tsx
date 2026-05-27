"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomBanner() {
  const pathname = usePathname();

  if (pathname === "/commander") return null;

  return (
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
  );
}
