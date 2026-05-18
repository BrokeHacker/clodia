import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Commande, SlotUnite, Client } from "@/lib/types";

function getWeekBounds() {
  const now = new Date();
  const day = now.getDay();
  const diffToMon = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMon);
  monday.setHours(0, 0, 0, 0);
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  friday.setHours(23, 59, 59, 999);
  return { monday, friday };
}

const STATUT_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  reserve:  { label: "Réservé",  color: "#cc6600", bg: "rgba(255,153,51,.12)" },
  confirme: { label: "Confirmé", color: "#008060", bg: "rgba(46,204,113,.12)" },
  livre:    { label: "Livré",    color: "#555",    bg: "rgba(26,26,10,.08)"  },
  annule:   { label: "Annulé",   color: "#d63a5a", bg: "rgba(255,61,107,.08)" },
};

interface CommandeEnrichie extends Commande {
  clients: Pick<Client, "prenom" | "nom"> | null;
}

export default async function PipelinePage() {
  const supabase = await createServerSupabaseClient();
  const { monday, friday } = getWeekBounds();

  const mondayDate = monday.toISOString().split("T")[0];
  const fridayDate = friday.toISOString().split("T")[0];

  const [{ data: commandes }, { data: slots }] = await Promise.all([
    supabase
      .from("commandes")
      .select("*, clients(prenom, nom)")
      .gte("point_livraison", "0") // trick pour forcer le join à fonctionner
      .or(`point_livraison.not.is.null,point_livraison.is.null`)
      .gte("created_at", monday.toISOString())
      .lte("created_at", friday.toISOString())
      .order("created_at"),
    supabase
      .from("slots_unite")
      .select("*")
      .gte("date_livraison", mondayDate)
      .lte("date_livraison", fridayDate),
  ]);

  // Re-fetch sans le filtre point_livraison foireux
  const { data: commandesPropres } = await supabase
    .from("commandes")
    .select("*, clients(prenom, nom)")
    .gte("created_at", monday.toISOString())
    .lte("created_at", friday.toISOString())
    .order("created_at");

  const commandesList = (commandesPropres as CommandeEnrichie[]) ?? [];
  const slotsList = (slots as SlotUnite[]) ?? [];

  // Grouper par date_livraison (ou date created_at si pas de menu)
  const byDate: Record<string, CommandeEnrichie[]> = {};
  commandesList.forEach((c) => {
    const dateKey = c.created_at.split("T")[0];
    if (!byDate[dateKey]) byDate[dateKey] = [];
    byDate[dateKey].push(c);
  });

  const slotsMap = Object.fromEntries(slotsList.map((s) => [`${s.date_livraison}_${s.variante}`, s]));

  const totalSemaine = commandesList.length;
  const confirmes = commandesList.filter((c) => c.statut === "confirme" || c.statut === "livre").length;
  const caGlobal = commandesList
    .filter((c) => c.statut !== "annule")
    .reduce((s, c) => s + c.prix_total, 0);

  return (
    <div className="px-6 md:px-10 py-8">
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--dark)" }}>
        Pipeline semaine
      </h1>
      <p className="text-sm mb-6" style={{ color: "#888" }}>
        Semaine du {monday.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} au{" "}
        {friday.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
      </p>

      {/* Résumé semaine */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Commandes totales", value: String(totalSemaine), icon: "📦" },
          { label: "Confirmées / livrées", value: String(confirmes), icon: "✅" },
          { label: "CA semaine", value: `${caGlobal.toFixed(2).replace(".", ",")} €`, icon: "💶" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-5 border-2"
            style={{ background: "#fff", borderColor: "#F5F5F0" }}
          >
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold" style={{ color: "var(--dark)" }}>{s.value}</div>
            <div className="text-xs font-semibold uppercase tracking-wider mt-0.5" style={{ color: "#aaa" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Par jour */}
      {Object.keys(byDate).length === 0 ? (
        <div className="text-center py-16">
          <span className="text-4xl block mb-3">📭</span>
          <p className="text-sm" style={{ color: "#aaa" }}>Aucune commande cette semaine.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(byDate).map(([dateKey, cmds]) => {
            const dateLabel = new Date(dateKey + "T12:00:00").toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            });

            const nbPlat = cmds.filter((c) => c.variante !== "plat_vege" && c.statut !== "annule").length;
            const nbVege = cmds.filter((c) => c.variante === "plat_vege" && c.statut !== "annule").length;

            const slotPlat = slotsMap[`${dateKey}_plat`];
            const slotVege = slotsMap[`${dateKey}_plat_vege`];

            const statutGroups = cmds.reduce(
              (acc, c) => { acc[c.statut] = (acc[c.statut] ?? 0) + 1; return acc; },
              {} as Record<string, number>
            );

            return (
              <div
                key={dateKey}
                className="rounded-2xl overflow-hidden border-2"
                style={{ background: "#fff", borderColor: "#F5F5F0" }}
              >
                {/* Header jour */}
                <div
                  className="px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-b-2"
                  style={{ background: "#F5F5F0", borderColor: "#EBEBEB" }}
                >
                  <h2 className="text-sm font-bold capitalize" style={{ color: "var(--dark)" }}>
                    {dateLabel}
                  </h2>
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Statuts pills */}
                    {Object.entries(statutGroups).map(([st, n]) => {
                      const s = STATUT_STYLE[st] ?? { label: st, color: "#555", bg: "rgba(26,26,10,.06)" };
                      return (
                        <span
                          key={st}
                          className="px-2.5 py-1 rounded-full text-xs font-bold"
                          style={{ background: s.bg, color: s.color }}
                        >
                          {n} {s.label}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Volume + slots */}
                <div className="px-5 py-4 flex flex-wrap gap-5 border-b-2" style={{ borderColor: "#F5F5F0" }}>
                  {/* Plat */}
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🍽️</span>
                    <div>
                      <p className="text-xs font-bold" style={{ color: "#aaa" }}>Plat du jour</p>
                      <p className="text-lg font-bold" style={{ color: "var(--dark)" }}>{nbPlat}</p>
                      {slotPlat && (
                        <SlotBar reserves={slotPlat.reserves} confirmes={slotPlat.confirmes} total={slotPlat.total} />
                      )}
                    </div>
                  </div>
                  {/* Végé */}
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🥗</span>
                    <div>
                      <p className="text-xs font-bold" style={{ color: "#aaa" }}>Option végé</p>
                      <p className="text-lg font-bold" style={{ color: "var(--dark)" }}>{nbVege}</p>
                      {slotVege && (
                        <SlotBar reserves={slotVege.reserves} confirmes={slotVege.confirmes} total={slotVege.total} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Liste commandes */}
                <div className="divide-y-2" style={{ borderColor: "#F5F5F0" }}>
                  {cmds.map((c) => {
                    const st = STATUT_STYLE[c.statut] ?? { label: c.statut, color: "#555", bg: "rgba(26,26,10,.06)" };
                    return (
                      <div
                        key={c.id}
                        className="px-5 py-3 flex items-center gap-3 hover:bg-[#FAFAFA] transition-colors"
                      >
                        <span className="text-base shrink-0">
                          {c.variante === "plat_vege" ? "🥗" : "🍽️"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: "var(--dark)" }}>
                            {c.clients?.prenom} {c.clients?.nom}
                          </p>
                          <p className="text-xs font-mono truncate" style={{ color: "#bbb" }}>
                            #{c.ref_commande}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold" style={{ color: "var(--dark)" }}>
                            {c.prix_total.toFixed(2)}€
                          </p>
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-bold"
                            style={{ background: st.bg, color: st.color }}
                          >
                            {st.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SlotBar({ reserves, confirmes, total }: { reserves: number; confirmes: number; total: number }) {
  if (total === 0) return null;
  const pctReserve = Math.min(100, Math.round((reserves / total) * 100));
  const pctConfirme = Math.min(100, Math.round((confirmes / total) * 100));
  return (
    <div className="mt-1">
      <div className="h-1.5 rounded-full overflow-hidden w-24" style={{ background: "var(--cream)" }}>
        <div className="h-full rounded-full" style={{ width: `${pctReserve}%`, background: "#FF9933" }} />
      </div>
      <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>
        {confirmes}/{total} confirmés · {pctConfirme}%
      </p>
    </div>
  );
}
