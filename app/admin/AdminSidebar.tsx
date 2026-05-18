"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/menus", label: "Menus", icon: "🍽️" },
  { href: "/admin/clients", label: "Clients", icon: "👥" },
  { href: "/admin/pipeline", label: "Pipeline", icon: "📦" },
];

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/admin");
  }

  return (
    <aside
      className="w-full md:w-56 md:min-h-screen md:sticky md:top-0 md:h-screen flex flex-col"
      style={{ background: "var(--burgundy)" }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: "rgba(255,255,255,.08)" }}>
        <Link href="/" className="text-2xl font-bold" style={{ color: "var(--lime)" }}>
          clodia
        </Link>
        <p className="text-xs mt-0.5 font-medium" style={{ color: "rgba(234,255,51,.4)" }}>
          Administration
        </p>
      </div>

      {/* User */}
      <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,.08)" }}>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-2"
          style={{ background: "var(--lime)", color: "var(--dark)" }}
        >
          A
        </div>
        <p className="text-xs font-semibold" style={{ color: "#fff" }}>Admin</p>
        <p className="text-xs truncate" style={{ color: "rgba(255,255,255,.45)" }}>{userEmail}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 flex md:flex-col flex-row overflow-x-auto">
        {NAV.map((item) => {
          const isActive = item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-5 py-3 text-sm font-medium transition-all whitespace-nowrap border-l-0 md:border-l-4"
              style={
                isActive
                  ? {
                      background: "rgba(234,255,51,.1)",
                      color: "var(--lime)",
                      borderColor: "var(--lime)",
                    }
                  : {
                      color: "rgba(255,255,255,.55)",
                      borderColor: "transparent",
                    }
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 hidden md:block">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-semibold transition-all"
          style={{ color: "rgba(255,255,255,.35)", borderColor: "rgba(255,255,255,.12)" }}
        >
          <span>↩</span> Déconnexion
        </button>
        <Link
          href="/"
          className="block text-center mt-2 text-xs"
          style={{ color: "rgba(255,255,255,.2)" }}
        >
          ← Site public
        </Link>
      </div>
    </aside>
  );
}
