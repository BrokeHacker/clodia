"use client";

import { useState } from "react";
import Link from "next/link";

const LINKS = [
  { href: "#comment-ca-marche", label: "Comment ça marche" },
  { href: "#formules", label: "Formules" },
  { href: "#livraisons", label: "Points de livraison" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 bg-white border-b"
      style={{ borderColor: "var(--gray-200)" }}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif", color: "var(--dark)" }}
        >
          clodia
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              style={{ color: "var(--gray-600)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--gray-100)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/mon-compte"
            className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors duration-200"
            style={{ color: "var(--green)", borderColor: "var(--green)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--green)";
              (e.currentTarget as HTMLElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "var(--green)";
            }}
          >
            Mon espace
          </Link>
          <Link
            href="/commander"
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 btn-primary"
          >
            Commander
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 rounded-lg"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          style={{ color: "var(--dark)" }}
        >
          {open ? (
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t px-5 py-4 flex flex-col gap-1" style={{ borderColor: "var(--gray-200)" }}>
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium"
              style={{ color: "var(--gray-600)" }}
            >
              {l.label}
            </a>
          ))}
          <div className="pt-3 mt-2 border-t flex flex-col gap-2" style={{ borderColor: "var(--gray-200)" }}>
            <Link href="/mon-compte" className="block text-center py-2.5 rounded-lg text-sm font-semibold border" style={{ color: "var(--green)", borderColor: "var(--green)" }} onClick={() => setOpen(false)}>
              Mon espace
            </Link>
            <Link
              href="/commander"
              className="btn-primary block text-center py-2.5 rounded-lg text-sm font-semibold"
              onClick={() => setOpen(false)}
            >
              Commander
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
