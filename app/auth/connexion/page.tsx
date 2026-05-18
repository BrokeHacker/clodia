"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

export default function ConnexionPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
    else setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "var(--gray-50)" }}>
      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center mb-2">
          <span className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "var(--dark)" }}>
            clodia
          </span>
        </Link>
        <p className="text-center text-sm mb-8" style={{ color: "var(--gray-400)" }}>
          Mon espace client
        </p>

        {!sent ? (
          <div className="bg-white rounded-xl p-8 border" style={{ borderColor: "var(--gray-200)", boxShadow: "0 2px 16px rgba(0,0,0,.06)" }}>
            <h1 className="text-xl font-semibold mb-1" style={{ color: "var(--dark)" }}>Connexion</h1>
            <p className="text-sm mb-6" style={{ color: "var(--gray-400)" }}>
              Entrez votre email — vous recevez un lien magique, sans mot de passe.
            </p>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-lg text-sm border-l-4" style={{ background: "rgba(248,15,80,.05)", borderColor: "var(--coral)", color: "var(--coral)" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--gray-400)" }}>
                  Adresse email
                </label>
                <input
                  type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="prenom.nom@chu-limoges.fr"
                  className="w-full px-4 py-3 rounded-lg text-sm border outline-none transition-all"
                  style={{ borderColor: "var(--gray-200)", color: "var(--dark)" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--green)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--gray-200)")}
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full py-3 rounded-lg text-sm font-semibold transition-all duration-200"
                style={{ background: loading ? "var(--gray-200)" : "var(--green)", color: "#fff" }}
              >
                {loading ? "Envoi…" : "Recevoir mon lien de connexion"}
              </button>
            </form>

            <p className="text-center text-xs mt-5" style={{ color: "var(--gray-400)" }}>
              Pas encore de compte ?{" "}
              <a href={`https://wa.me/33753791617?text=${encodeURIComponent("Bonjour, je souhaite commander avec Clodia 🍽️")}`} target="_blank" rel="noopener noreferrer" className="font-semibold" style={{ color: "var(--green)" }}>
                Commandez via WhatsApp
              </a>
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 border text-center" style={{ borderColor: "var(--gray-200)", boxShadow: "0 2px 16px rgba(0,0,0,.06)" }}>
            <span className="text-5xl block mb-4">📬</span>
            <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--dark)" }}>Vérifiez vos emails</h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--gray-600)" }}>
              Un lien de connexion a été envoyé à{" "}
              <strong style={{ color: "var(--dark)" }}>{email}</strong>.
            </p>
            <button onClick={() => { setSent(false); setEmail(""); }} className="mt-6 text-xs" style={{ color: "var(--gray-400)" }}>
              Utiliser un autre email
            </button>
          </div>
        )}

        <Link href="/" className="block text-center mt-6 text-xs" style={{ color: "var(--gray-400)" }}>
          ← Retour au site
        </Link>
      </div>
    </div>
  );
}
