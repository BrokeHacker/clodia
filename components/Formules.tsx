import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Tarif } from "@/lib/types";
import Link from "next/link";

function typeLabel(type: string) {
  const map: Record<string, string> = { abonnement: "Abonnement", pack: "Pack", unique: "Repas unique", "repas-unique": "Repas unique", "one-shot": "Repas unique" };
  return map[type.toLowerCase()] ?? type;
}
function typeIcon(type: string) {
  const map: Record<string, string> = { abonnement: "🔄", pack: "📦", unique: "🍽️", "repas-unique": "🍽️", "one-shot": "🍽️" };
  return map[type.toLowerCase()] ?? "✨";
}
function typeDesc(type: string) {
  const map: Record<string, string> = {
    abonnement: "Recevez vos repas chaque semaine, sans y penser. Tarif dégressif.",
    pack: "Achetez un lot de repas à l'avance et profitez d'un meilleur tarif.",
    unique: "Commandez ponctuellement selon vos envies du moment.",
    "repas-unique": "Commandez ponctuellement selon vos envies du moment.",
    "one-shot": "Commandez ponctuellement selon vos envies du moment.",
  };
  return map[type.toLowerCase()] ?? "";
}

export default async function Formules() {
  const supabase = await createServerSupabaseClient();
  const { data: tarifs } = await supabase.from("tarifs").select("*").order("prix_unitaire", { ascending: true });

  const grouped = ((tarifs as Tarif[]) ?? []).reduce(
    (acc, t) => { if (!acc[t.type]) acc[t.type] = []; acc[t.type].push(t); return acc; },
    {} as Record<string, Tarif[]>
  );

  return (
    <section id="formules" className="py-24 px-6 md:px-10" style={{ background: "var(--gray-50)" }}>
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--green)" }}>Nos formules</p>
        <h2 className="font-bold mb-4 tracking-tight" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 42px)", color: "var(--dark)" }}>
          Un tarif juste, des repas vrais
        </h2>
        <p className="text-base leading-relaxed mb-14" style={{ color: "var(--gray-600)", maxWidth: 460 }}>
          Plus vous commandez, moins ça coûte. Choisissez la formule qui correspond à votre rythme.
        </p>

        {Object.keys(grouped).length === 0 ? (
          <p className="text-sm" style={{ color: "var(--gray-400)" }}>Tarifs bientôt disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(grouped).map(([type, items]) => {
              const popular = type.toLowerCase() === "abonnement";
              return (
                <div
                  key={type}
                  className="relative rounded-xl bg-white p-7 flex flex-col card-hover"
                  style={{
                    border: popular ? "2px solid var(--green)" : "1px solid var(--gray-200)",
                    boxShadow: popular ? "0 4px 24px rgba(74,103,65,.10)" : "0 1px 4px rgba(0,0,0,.05)",
                  }}
                >
                  {popular && (
                    <div className="absolute -top-px left-8 px-3 py-1 rounded-b-lg text-xs font-bold" style={{ background: "var(--green)", color: "#fff" }}>
                      Le plus populaire
                    </div>
                  )}
                  <div className="text-3xl mb-4">{typeIcon(type)}</div>
                  <h3 className="text-lg font-bold mb-1" style={{ color: "var(--dark)" }}>{typeLabel(type)}</h3>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--gray-600)" }}>{typeDesc(type)}</p>

                  <div className="flex flex-col gap-2 mb-8 flex-1">
                    {items.map((t) => (
                      <div key={t.id} className="flex items-center justify-between rounded-lg px-4 py-3" style={{ background: "var(--gray-50)", border: "1px solid var(--gray-100)" }}>
                        <span className="text-sm" style={{ color: "var(--gray-600)" }}>
                          {t.repas_de === t.repas_a ? `${t.repas_de} repas` : `${t.repas_de}–${t.repas_a} repas`}
                        </span>
                        <span className="text-base font-bold" style={{ color: "var(--dark)" }}>
                          {t.prix_unitaire.toFixed(2).replace(".", ",")} €
                          <span className="text-xs font-normal ml-0.5" style={{ color: "var(--gray-400)" }}>/repas</span>
                        </span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/commander?formule=${type.toLowerCase()}`}
                    className={`block w-full text-center py-3 text-sm ${popular ? "btn-primary" : "btn-secondary"}`}
                  >
                    Choisir cette formule
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
