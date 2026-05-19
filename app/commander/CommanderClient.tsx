"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Menu, Tarif, PointLivraison } from "@/lib/types";
import type { ActiveWeek } from "@/lib/utils/getActiveWeek";

/* ─── Types ──────────────────────────────────────────────────────────── */

interface Props {
  menus: Menu[];
  tarifs: Tarif[];
  points: PointLivraison[];
  activeWeek?: ActiveWeek;
}

type FormuleType = "precommande" | "groupe";

interface JourSelection {
  menu_id: string;
  date_livraison: string;
  plat: string;
  plat_vege: string;
  dessert: string;
  qty_plat: number;
  qty_vege: number;
}

type Step = "formule" | "jours" | "infos" | "done";

/* ─── Helpers ────────────────────────────────────────────────────────── */

const JOURS_FR = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];
const MOIS_FR = ["jan.", "fév.", "mar.", "avr.", "mai", "juin", "juil.", "août", "sep.", "oct.", "nov.", "déc."];

function formatDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return `${JOURS_FR[d.getDay()]} ${d.getDate()} ${MOIS_FR[d.getMonth()]}`;
}

function getPrixUnitaire(tarifs: Tarif[], type: FormuleType, totalQty: number): number {
  // precommande → cherche dans les tarifs 'abonnement' ou 'precommande'
  // groupe       → cherche dans les tarifs 'groupe' ou 'pack'
  const aliases: Record<FormuleType, string[]> = {
    precommande: ["abonnement", "precommande"],
    groupe:      ["groupe", "pack"],
  };
  const allowed = aliases[type] ?? [type];
  const row = tarifs
    .filter((t) => allowed.includes(t.type.toLowerCase()))
    .find((t) => totalQty >= t.repas_de && totalQty <= t.repas_a);
  return row?.prix_unitaire ?? 0;
}

function genRef(): string {
  const now = new Date();
  const d = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,"0")}${String(now.getDate()).padStart(2,"0")}`;
  const r = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CLO-${d}-${r}`;
}

/** Retourne le mercredi 22h le plus proche (cette semaine ou la suivante) */
function getOrderDeadline(): string {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=dim, 3=mer
  let daysUntilWed = (3 - dayOfWeek + 7) % 7;
  // Si on est mercredi après 22h → deadline = mercredi prochain
  if (daysUntilWed === 0 && now.getHours() >= 22) daysUntilWed = 7;
  const deadline = new Date(now);
  deadline.setDate(now.getDate() + daysUntilWed);
  return deadline.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}

/* ─── Sub-components ─────────────────────────────────────────────────── */

function StepIndicator({ current }: { current: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: "formule", label: "Formule" },
    { key: "jours",   label: "Jours & plats" },
    { key: "infos",   label: "Infos" },
    { key: "done",    label: "Confirmation" },
  ];
  const idx = steps.findIndex((s) => s.key === current);
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((s, i) => {
        const done   = i < idx;
        const active = i === idx;
        return (
          <div key={s.key} className="flex items-center gap-0 flex-1 min-w-0">
            <div className="flex flex-col items-center shrink-0">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-200"
                style={{
                  background:  done || active ? "var(--green)" : "#fff",
                  borderColor: done || active ? "var(--green)" : "var(--gray-200)",
                  color:       done || active ? "#fff" : "var(--gray-400)",
                }}
              >
                {done ? "✓" : i + 1}
              </div>
              <span className="text-xs mt-1 font-medium hidden sm:block" style={{ color: active ? "var(--green)" : "var(--gray-400)" }}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-1 mb-4" style={{ background: done ? "var(--green)" : "var(--gray-200)" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Counter({ value, onChange, min = 0, max = 20 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}
        className="w-8 h-8 rounded-full border flex items-center justify-center text-lg font-bold transition-all duration-150"
        style={{ borderColor: value > min ? "var(--green)" : "var(--gray-200)", color: value > min ? "var(--green)" : "var(--gray-300)", background: "#fff" }}>
        −
      </button>
      <span className="w-6 text-center text-sm font-bold" style={{ color: "var(--dark)" }}>{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}
        className="w-8 h-8 rounded-full border flex items-center justify-center text-lg font-bold transition-all duration-150"
        style={{ borderColor: value < max ? "var(--green)" : "var(--gray-200)", color: value < max ? "var(--green)" : "var(--gray-300)", background: "#fff" }}>
        +
      </button>
    </div>
  );
}

function VariantCard({ icon, label, platName, qty, onChange }: { icon: string; label: string; platName: string; qty: number; onChange: (v: number) => void }) {
  const active = qty > 0;
  return (
    <div
      className="flex-1 rounded-xl p-4 border-2 flex flex-col gap-3 transition-all duration-200 cursor-pointer"
      style={{ borderColor: active ? "var(--green)" : "var(--gray-200)", background: active ? "rgba(74,103,65,.05)" : "#fff" }}
      onClick={() => { if (qty === 0) onChange(1); }}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: active ? "var(--green)" : "var(--gray-400)" }}>{label}</p>
          <p className="text-sm font-medium leading-snug mt-0.5" style={{ color: "var(--dark)" }}>{platName}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: "var(--gray-400)" }}>Quantité</span>
        <Counter value={qty} onChange={onChange} />
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────── */

export default function CommanderClient({ menus, tarifs, points, activeWeek }: Props) {
  const searchParams = useSearchParams();
  const [step,       setStep]       = useState<Step>("formule");
  const [formule,    setFormule]    = useState<FormuleType | null>(null);
  const [selections, setSelections] = useState<Map<string, JourSelection>>(new Map());
  const [email,      setEmail]      = useState("");
  const [pointId,    setPointId]    = useState("");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [doneRef,    setDoneRef]    = useState<string[]>([]);

  // Pré-sélectionner la formule depuis l'URL (?formule=precommande)
  useEffect(() => {
    const param = searchParams.get("formule") as FormuleType | null;
    if (param && ["precommande", "groupe"].includes(param)) {
      setFormule(param);
    }
    // Rétrocompatibilité anciens liens avec ?formule=abonnement
    if (searchParams.get("formule") === "abonnement") setFormule("precommande");
    if (searchParams.get("formule") === "pack")        setFormule("groupe");
  }, [searchParams]);

  /* ── Derived ── */
  const totalQty = useMemo(() =>
    Array.from(selections.values()).reduce((s, j) => s + j.qty_plat + j.qty_vege, 0),
    [selections]
  );
  const prixUnitaire = useMemo(() =>
    formule ? getPrixUnitaire(tarifs, formule, Math.max(1, totalQty)) : 0,
    [tarifs, formule, totalQty]
  );
  const totalPrix = prixUnitaire * totalQty;
  const canContinueJours = useMemo(() => {
    if (selections.size === 0) return false;
    return Array.from(selections.values()).every((j) => j.qty_plat + j.qty_vege > 0);
  }, [selections]);

  /* ── Helpers ── */
  function toggleJour(menu: Menu) {
    setSelections((prev) => {
      const next = new Map(prev);
      if (next.has(menu.id)) { next.delete(menu.id); }
      else {
        next.set(menu.id, {
          menu_id: menu.id, date_livraison: menu.date_livraison,
          plat: menu.plat, plat_vege: menu.plat_vege, dessert: menu.dessert,
          qty_plat: 1, qty_vege: 0,
        });
      }
      return next;
    });
  }

  function setQty(menuId: string, variant: "plat" | "vege", qty: number) {
    setSelections((prev) => {
      const next = new Map(prev);
      const cur  = next.get(menuId);
      if (!cur) return next;
      next.set(menuId, { ...cur, qty_plat: variant === "plat" ? qty : cur.qty_plat, qty_vege: variant === "vege" ? qty : cur.qty_vege });
      return next;
    });
  }

  /* ── Formules ── */
  const FORMULES: { type: FormuleType; icon: string; label: string; desc: string; badge?: string; avantages: string[] }[] = [
    {
      type: "precommande",
      icon: "📅",
      label: "Pré-commande semaine",
      desc: "Je choisis mes jours pour la semaine à venir et je règle en une fois. Mon repas est déposé dans le frigo de mon service avant midi, sans que j'aie à y penser le jour J.",
      badge: "Le plus choisi",
      avantages: ["De 2 à 5 jours par semaine", "Livraison avant 12h dans votre service", "Plat + dessert inclus", `Commandez avant mercredi 22h`, "Sans engagement"],
    },
    {
      type: "groupe",
      icon: "👥",
      label: "Commande groupée",
      desc: "Commandez pour plusieurs collègues en une seule transaction. Idéal pour une équipe ou un service.",
      avantages: ["5 repas minimum", "Tarif dégressif selon le volume", "Livraison avant 12h dans votre service", "Plat + dessert inclus"],
    },
  ];

  /* ── Submit ── */
  async function handleSubmit() {
    setError("");
    if (!email.trim()) { setError("Veuillez renseigner votre email."); return; }
    if (!pointId)      { setError("Veuillez choisir un point de livraison."); return; }
    setLoading(true);
    try {
      const lignes = Array.from(selections.values()).flatMap((j) => {
        const rows = [];
        if (j.qty_plat > 0) rows.push({ menu_id: j.menu_id, variante: "plat",     quantite: j.qty_plat });
        if (j.qty_vege > 0) rows.push({ menu_id: j.menu_id, variante: "plat_vege", quantite: j.qty_vege });
        return rows;
      });
      const res = await fetch("/api/commandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, point_livraison_id: pointId, type: formule, prix_unitaire: prixUnitaire, lignes }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Une erreur est survenue. Réessayez."); setLoading(false); return; }
      setDoneRef(json.refs ?? []);
      setStep("done");
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion et réessayez.");
    } finally {
      setLoading(false);
    }
  }

  const deadline = getOrderDeadline();

  /* ══════════════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════════════ */
  return (
    <main className="min-h-screen py-12 px-4" style={{ background: "var(--gray-50)" }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--green)" }}>Commander</p>
          <h1 className="font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 38px)", color: "var(--dark)" }}>
            Votre repas gastronomique
          </h1>
          <p className="text-sm" style={{ color: "var(--gray-600)" }}>
            Livraison avant 12h directement dans votre service au CHU Limoges.
          </p>
        </div>

        <StepIndicator current={step} />

        {/* Bandeau WhatsApp discret */}
        <div className="flex items-center gap-3 rounded-xl px-4 py-3 mb-6 text-sm" style={{ background: "var(--sand)", border: "1px solid rgba(0,0,0,.06)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.856L.057 23.884a.5.5 0 0 0 .613.613l6.028-1.476A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.807 9.807 0 0 1-5.012-1.376l-.36-.214-3.724.912.93-3.617-.234-.372A9.789 9.789 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
          </svg>
          <p style={{ color: "var(--gray-600)" }}>
            Vous préférez WhatsApp ?{" "}
            <a href="https://wa.me/33753791617?text=Bonjour%2C%20je%20souhaite%20commander%20avec%20Clodia%20%F0%9F%8D%BD%EF%B8%8F" target="_blank" rel="noopener noreferrer" className="font-semibold" style={{ color: "var(--green)" }}>
              Commandez via notre bot →
            </a>
          </p>
        </div>

        {/* ── STEP 1 : Formule ── */}
        {step === "formule" && (
          <div>
            <h2 className="text-base font-semibold mb-5" style={{ color: "var(--dark)" }}>Choisissez votre formule</h2>

            {/* Deadline banner */}
            <div className="flex items-center gap-2 rounded-xl px-4 py-3 mb-5 text-sm" style={{ background: "var(--sand)", border: "1px solid rgba(74,103,65,.15)" }}>
              <span>⏰</span>
              <p style={{ color: "var(--green)" }}>
                <span className="font-semibold">Commandez avant mercredi {deadline} à 22h</span>
                {" "}pour la semaine suivante.
              </p>
            </div>

            <div className="flex flex-col gap-4 mb-8">
              {FORMULES.map((f) => {
                const selected = formule === f.type;
                const tarif = tarifs.find((t) => {
                  const aliases: Record<FormuleType, string[]> = { precommande: ["abonnement","precommande"], groupe: ["groupe","pack"] };
                  return (aliases[f.type] ?? [f.type]).includes(t.type.toLowerCase());
                });
                return (
                  <button key={f.type} type="button" onClick={() => setFormule(f.type)}
                    className="relative text-left rounded-xl p-5 border-2 transition-all duration-200"
                    style={{ borderColor: selected ? "var(--green)" : "var(--gray-200)", background: selected ? "rgba(74,103,65,.05)" : "#fff" }}
                  >
                    {f.badge && (
                      <span className="absolute -top-px right-5 px-2.5 py-0.5 rounded-b-lg text-xs font-bold" style={{ background: "var(--green)", color: "#fff" }}>
                        {f.badge}
                      </span>
                    )}
                    <div className="flex items-start gap-4">
                      <span className="text-2xl mt-0.5">{f.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-sm font-bold" style={{ color: "var(--dark)" }}>{f.label}</p>
                          {tarif && (
                            <p className="text-sm font-bold shrink-0" style={{ color: "var(--green)" }}>
                              dès {tarif.prix_unitaire.toFixed(2).replace(".", ",")} €
                              <span className="text-xs font-normal" style={{ color: "var(--gray-400)" }}>/repas</span>
                            </p>
                          )}
                        </div>
                        <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--gray-600)" }}>{f.desc}</p>
                        <div className="flex flex-col gap-1">
                          {f.avantages.map((a) => (
                            <div key={a} className="flex items-center gap-1.5">
                              <span className="text-xs" style={{ color: "var(--green)" }}>✓</span>
                              <span className="text-xs" style={{ color: "var(--gray-600)" }}>{a}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center mt-0.5"
                        style={{ borderColor: selected ? "var(--green)" : "var(--gray-200)", background: selected ? "var(--green)" : "#fff" }}>
                        {selected && <span style={{ color: "#fff", fontSize: 10 }}>✓</span>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button type="button" disabled={!formule} onClick={() => setStep("jours")}
              className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{ background: formule ? "var(--green)" : "var(--gray-200)", color: formule ? "#fff" : "var(--gray-400)", cursor: formule ? "pointer" : "not-allowed" }}>
              {formule === "precommande" ? "Choisir mes jours →" : "Continuer →"}
            </button>
          </div>
        )}

        {/* ── STEP 2 : Jours & variantes ── */}
        {step === "jours" && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-semibold" style={{ color: "var(--dark)" }}>
                {formule === "precommande" ? "Choisissez vos jours" : "Choisissez les jours et quantités"}
              </h2>
              <button type="button" onClick={() => setStep("formule")} className="text-xs font-medium" style={{ color: "var(--gray-400)" }}>
                ← Retour
              </button>
            </div>

            {/* Deadline + semaine */}
            <div className="flex items-center gap-2 rounded-xl px-4 py-3 mb-5 text-xs" style={{ background: "var(--sand)", border: "1px solid rgba(74,103,65,.15)" }}>
              <span>⏰</span>
              <p style={{ color: "var(--green)" }}>
                <span className="font-semibold">Commandez avant mercredi {deadline} à 22h</span>
              </p>
            </div>

            {activeWeek && (
              <p className="text-xs mb-4" style={{ color: "var(--gray-400)" }}>
                Semaine {activeWeek.semaine} — du{" "}
                {new Date(activeWeek.dateDebut + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                {" "}au{" "}
                {new Date(activeWeek.dateFin + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            )}

            {menus.length === 0 ? (
              <div className="bg-white rounded-xl p-8 border text-center" style={{ borderColor: "var(--gray-200)" }}>
                <span className="text-3xl block mb-3">📅</span>
                <p className="text-sm font-medium mb-1" style={{ color: "var(--dark)" }}>Aucun menu disponible en ce moment</p>
                <p className="text-xs" style={{ color: "var(--gray-400)" }}>Les menus de la prochaine semaine sont publiés chaque vendredi.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 mb-6">
                {menus.map((menu) => {
                  const sel = selections.get(menu.id);
                  const checked = !!sel;
                  return (
                    <div key={menu.id} className="bg-white rounded-xl border-2 overflow-hidden transition-all duration-200"
                      style={{ borderColor: checked ? "var(--green)" : "var(--gray-200)" }}>
                      <button type="button" onClick={() => toggleJour(menu)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left"
                        style={{ background: checked ? "rgba(74,103,65,.04)" : "#fff" }}>
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0"
                            style={{ borderColor: checked ? "var(--green)" : "var(--gray-300)", background: checked ? "var(--green)" : "#fff" }}>
                            {checked && <span style={{ color: "#fff", fontSize: 9 }}>✓</span>}
                          </div>
                          <span className="text-sm font-semibold capitalize" style={{ color: "var(--dark)" }}>{formatDate(menu.date_livraison)}</span>
                        </div>
                        {menu.dessert && <span className="text-xs" style={{ color: "var(--gray-400)" }}>🍮 {menu.dessert}</span>}
                      </button>
                      {checked && sel && (
                        <div className="px-4 pb-4 pt-2 border-t flex gap-3" style={{ borderColor: "rgba(74,103,65,.12)" }}>
                          <VariantCard icon="🍽️" label="Plat du jour" platName={menu.plat} qty={sel.qty_plat} onChange={(v) => setQty(menu.id, "plat", v)} />
                          <VariantCard icon="🥗" label="Option végé"  platName={menu.plat_vege} qty={sel.qty_vege} onChange={(v) => setQty(menu.id, "vege", v)} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {totalQty > 0 && (
              <div className="rounded-xl px-4 py-3 mb-4 flex items-center justify-between"
                style={{ background: "rgba(74,103,65,.07)", border: "1px solid rgba(74,103,65,.2)" }}>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--green)" }}>
                    {totalQty} repas · {prixUnitaire.toFixed(2).replace(".", ",")} €/repas
                  </p>
                  {prixUnitaire === 0 && <p className="text-xs mt-0.5" style={{ color: "var(--coral)" }}>Tarif non configuré pour cette quantité</p>}
                </div>
                <p className="text-lg font-bold" style={{ color: "var(--dark)" }}>{totalPrix.toFixed(2).replace(".", ",")} €</p>
              </div>
            )}

            {Array.from(selections.values()).some((j) => j.qty_plat + j.qty_vege === 0) && (
              <p className="text-xs mb-3 px-1" style={{ color: "var(--coral)" }}>⚠️ Chaque jour sélectionné doit avoir au moins 1 repas.</p>
            )}

            <button type="button" disabled={!canContinueJours || menus.length === 0} onClick={() => setStep("infos")}
              className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{ background: canContinueJours ? "var(--green)" : "var(--gray-200)", color: canContinueJours ? "#fff" : "var(--gray-400)", cursor: canContinueJours ? "pointer" : "not-allowed" }}>
              Continuer → ({totalQty} repas · {totalPrix.toFixed(2).replace(".", ",")} €)
            </button>
          </div>
        )}

        {/* ── STEP 3 : Infos client ── */}
        {step === "infos" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold" style={{ color: "var(--dark)" }}>Vos informations</h2>
              <button type="button" onClick={() => setStep("jours")} className="text-xs font-medium" style={{ color: "var(--gray-400)" }}>← Retour</button>
            </div>

            {/* Récap */}
            <div className="bg-white rounded-xl border mb-6 overflow-hidden" style={{ borderColor: "var(--gray-200)" }}>
              <div className="px-4 py-3 border-b" style={{ borderColor: "var(--gray-100)", background: "var(--gray-50)" }}>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gray-400)" }}>
                  Votre pré-commande
                  {activeWeek && (
                    <span className="ml-2 normal-case font-normal" style={{ color: "var(--gray-400)" }}>
                      — Semaine du {new Date(activeWeek.dateDebut + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} au {new Date(activeWeek.dateFin + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                    </span>
                  )}
                </p>
              </div>
              <div className="divide-y" style={{ borderColor: "var(--gray-100)" }}>
                {Array.from(selections.values()).map((j) => (
                  <div key={j.menu_id} className="px-4 py-3">
                    <p className="text-xs font-semibold mb-1.5" style={{ color: "var(--gray-600)" }}>{formatDate(j.date_livraison)}</p>
                    <div className="flex flex-col gap-1">
                      {j.qty_plat > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs" style={{ color: "var(--dark)" }}>🍽️ {j.plat} × {j.qty_plat}</span>
                          <span className="text-xs font-medium" style={{ color: "var(--dark)" }}>{(j.qty_plat * prixUnitaire).toFixed(2)} €</span>
                        </div>
                      )}
                      {j.qty_vege > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs" style={{ color: "var(--dark)" }}>🥗 {j.plat_vege} × {j.qty_vege}</span>
                          <span className="text-xs font-medium" style={{ color: "var(--dark)" }}>{(j.qty_vege * prixUnitaire).toFixed(2)} €</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div className="px-4 py-3 flex items-center justify-between">
                  <span className="text-sm font-bold" style={{ color: "var(--dark)" }}>Total · sans engagement</span>
                  <span className="text-base font-bold" style={{ color: "var(--green)" }}>{totalPrix.toFixed(2).replace(".", ",")} €</span>
                </div>
              </div>
            </div>

            {/* Champs */}
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "var(--gray-600)" }}>Email *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="prenom.nom@chu-limoges.fr"
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200"
                  style={{ borderColor: "var(--gray-200)", color: "var(--dark)", background: "#fff" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--green)")}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = "var(--gray-200)")} />
                <p className="text-xs mt-1" style={{ color: "var(--gray-400)" }}>L&apos;email doit correspondre à votre compte Clodia.</p>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "var(--gray-600)" }}>Point de livraison *</label>
                <select value={pointId} onChange={(e) => setPointId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 appearance-none"
                  style={{ borderColor: "var(--gray-200)", color: pointId ? "var(--dark)" : "var(--gray-400)", background: "#fff", cursor: "pointer" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--green)")}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = "var(--gray-200)")}>
                  <option value="">Sélectionnez votre service…</option>
                  {points.map((p) => <option key={p.id} value={p.id}>{p.hopital} — {p.service}</option>)}
                </select>
              </div>
            </div>

            {error && (
              <div className="rounded-xl px-4 py-3 mb-4 text-sm" style={{ background: "rgba(248,15,80,.08)", color: "var(--coral)", border: "1px solid rgba(248,15,80,.2)" }}>
                {error}
              </div>
            )}

            <button type="button" onClick={handleSubmit} disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              style={{ background: loading ? "var(--gray-200)" : "var(--green)", color: loading ? "var(--gray-400)" : "#fff", cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? (
                <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Réservation en cours…</>
              ) : (
                `Confirmer ma pré-commande · ${totalPrix.toFixed(2).replace(".", ",")} €`
              )}
            </button>
            <p className="text-xs text-center mt-3" style={{ color: "var(--gray-400)" }}>
              Pas encore inscrit ?{" "}
              <a href="https://wa.me/33753791617?text=Bonjour%2C%20je%20souhaite%20commander%20avec%20Clodia%20%F0%9F%8D%BD%EF%B8%8F" target="_blank" rel="noopener noreferrer" style={{ color: "var(--green)" }}>
                Rejoignez-nous sur WhatsApp
              </a>
            </p>
          </div>
        )}

        {/* ── STEP 4 : Confirmation ── */}
        {step === "done" && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl" style={{ background: "rgba(74,103,65,.12)" }}>✅</div>
            <h2 className="font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 3vw, 28px)", color: "var(--dark)" }}>
              Pré-commande confirmée !
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--gray-600)", maxWidth: 380, margin: "0 auto 24px" }}>
              Votre commande a bien été enregistrée. Livraison avant 12h dans votre service. Bon appétit ! 🍽️
            </p>
            {doneRef.length > 0 && (
              <div className="inline-flex flex-col gap-1 bg-white rounded-xl px-6 py-4 border mb-8" style={{ borderColor: "var(--gray-200)" }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--gray-400)" }}>Référence{doneRef.length > 1 ? "s" : ""}</p>
                {doneRef.map((r) => <p key={r} className="font-mono text-sm font-bold" style={{ color: "var(--dark)" }}>{r}</p>)}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/mon-compte" className="btn-primary px-8 py-3 text-sm font-semibold inline-block">Voir mes commandes</Link>
              <Link href="/" className="btn-secondary px-8 py-3 text-sm font-semibold inline-block">Retour à l&apos;accueil</Link>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
