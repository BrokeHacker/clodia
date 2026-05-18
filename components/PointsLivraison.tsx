import { createServerSupabaseClient } from "@/lib/supabase-server";
import { PointLivraison } from "@/lib/types";

export default async function PointsLivraison() {
  const supabase = await createServerSupabaseClient();
  const { data: points } = await supabase
    .from("points_livraison")
    .select("*")
    .order("hopital");

  const byHopital = ((points as PointLivraison[]) ?? []).reduce(
    (acc, p) => { if (!acc[p.hopital]) acc[p.hopital] = []; acc[p.hopital].push(p); return acc; },
    {} as Record<string, PointLivraison[]>
  );

  return (
    <section id="livraisons" className="py-24 px-6 md:px-10" style={{ background: "#fff" }}>
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--green)" }}>
          Où nous livrons
        </p>
        <h2
          className="font-bold mb-4 tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 42px)", color: "var(--dark)" }}
        >
          Directement dans votre service
        </h2>
        <p className="text-base leading-relaxed mb-14" style={{ color: "var(--gray-600)", maxWidth: 460 }}>
          Nous desservons plusieurs établissements. Retrouvez votre service dans la liste ci-dessous.
        </p>

        {Object.keys(byHopital).length === 0 ? (
          <p className="text-sm" style={{ color: "var(--gray-400)" }}>Points de livraison bientôt disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(byHopital).map(([hopital, services]) => (
              <div key={hopital} className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--gray-200)" }}>
                <div
                  className="flex items-center gap-3 px-5 py-4"
                  style={{ background: "var(--gray-50)", borderBottom: "1px solid var(--gray-200)" }}
                >
                  <span className="text-lg">🏥</span>
                  <h3 className="font-semibold text-sm flex-1" style={{ color: "var(--dark)" }}>{hopital}</h3>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "var(--gray-200)", color: "var(--gray-600)" }}>
                    {services.length} service{services.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="p-3 flex flex-col gap-1.5" style={{ background: "#fff" }}>
                  {services.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-start gap-3 rounded-lg px-4 py-3"
                      style={{ background: "var(--gray-50)" }}
                    >
                      <span className="text-sm mt-0.5 shrink-0">📍</span>
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--dark)" }}>
                          {p.service}
                          {p.batiment && <span className="font-normal" style={{ color: "var(--gray-400)" }}> · {p.batiment}</span>}
                        </p>
                        {p.service_desc && (
                          <p className="text-xs mt-0.5" style={{ color: "var(--gray-400)" }}>{p.service_desc}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
