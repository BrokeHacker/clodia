"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) { setError("Email ou mot de passe incorrect."); setLoading(false); return; }
    if (data.user?.app_metadata?.role !== "admin") {
      await supabase.auth.signOut();
      setError("Accès réservé aux administrateurs.");
      setLoading(false);
      return;
    }
    router.push("/admin");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "var(--dark)" }}>
      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center mb-2">
          <span className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "#fff" }}>
            clodia
          </span>
        </Link>
        <p className="text-center text-xs uppercase tracking-widest mb-8" style={{ color: "rgba(255,255,255,.35)" }}>
          Back-office fondateurs
        </p>

        <div className="rounded-xl p-8 border" style={{ background: "rgba(255,255,255,.05)", borderColor: "rgba(255,255,255,.1)" }}>
          <h1 className="text-xl font-semibold mb-1" style={{ color: "#fff" }}>Administration</h1>
          <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,.4)" }}>Accès restreint.</p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg text-sm border-l-4" style={{ background: "rgba(248,15,80,.1)", borderColor: "var(--coral)", color: "var(--coral)" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {[
              { label: "Email", type: "email", value: email, set: setEmail, placeholder: "fondateur@clodia.fr" },
              { label: "Mot de passe", type: "password", value: password, set: setPassword, placeholder: "••••••••" },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "rgba(255,255,255,.35)" }}>
                  {f.label}
                </label>
                <input
                  type={f.type} required value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                  style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)", color: "#fff" }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(255,255,255,.4)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,.12)")}
                />
              </div>
            ))}
            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-semibold mt-1 transition-all duration-200"
              style={{ background: "#fff", color: "var(--dark)", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Connexion…" : "Accéder au back-office"}
            </button>
          </form>
        </div>

        <Link href="/" className="block text-center mt-6 text-xs" style={{ color: "rgba(255,255,255,.2)" }}>
          ← Retour au site
        </Link>
      </div>
    </div>
  );
}
