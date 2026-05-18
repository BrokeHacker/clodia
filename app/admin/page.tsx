import { createServerSupabaseClient } from "@/lib/supabase-server";

function getWeekBounds() {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const diffToMon = (day === 0 ? -6 : 1 - day);
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMon);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { monday, sunday };
}

const STATUT_COLORS: Record<string, { color: string; bg: string }> = {
  reserve:  { color: "#cc6600", bg: "rgba(255,153,51,.12)" },
  confirme: { color: "#008060", bg: "rgba(46,204,113,.12)" },
  livre:    { color: "#555",    bg: "rgba(26,26,10,.08)" },
  annule:   { color: "#d63a5a", bg: "rgba(255,61,107,.08)" },
};

export default async function AdminDashboard() {
  const supabase = await createServerSupabaseClient();
  const { monday, sunday } = getWeekBounds();

  const [
    { data: allCommandes },
    { data: commandesSemaine },
    { count: nbClients },
  ] = await Promise.all([
    supabase.from("commandes").select("prix_total, statut").neq("statut", "annule"),
    supabase
      .from("commandes")
      .select("prix_total, statut")
      .gte("created_at", monday.toISOString())
      .lte("created_at", sunday.toISOString()),
    supabase.from("clients").select("*", { count: "exact", head: true }),
  ]);

  const caTotal = (allCommandes ?? []).reduce((s, c) => s + c.prix_total, 0);
  const caSemaine = (commandesSemaine ?? []).reduce((s, c) => s + c.prix_total, 0);

  // Grouper commandes semaine par statut
  const statutGroups = (commandesSemaine ?? []).reduce(
    (acc, c) => {
      acc[c.statut] = (acc[c.statut] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const statCards = [
    { label: "CA total", value: `${caTotal.toFixed(2).replace(".", ",")} €`, icon: "💶" },
    { label: "CA cette semaine", value: `${caSemaine.toFixed(2).replace(".", ",")} €`, icon: "📈" },
    { label: "Clients actifs", value: String(nbClients ?? 0), icon: "👥" },
    { label: "Commandes cette semaine", value: String(commandesSemaine?.length ?? 0), icon: "📦" },
  ];

  return (
    <div className="px-6 md:px-10 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--dark)" }}>
        Dashboard
      </h1>
      <p className="text-sm mb-8" style={{ color: "#888" }}>
        Semaine du {monday.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} au{" "}
        {sunday.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
      </p>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl p-5 border-2"
            style={{ background: "#fff", borderColor: "#F5F5F0" }}
          >
            <div className="text-2xl mb-2">{card.icon}</div>
            <div className="text-2xl font-bold leading-tight mb-1" style={{ color: "var(--dark)" }}>
              {card.value}
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#aaa" }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Commandes par statut */}
      <div
        className="rounded-2xl overflow-hidden border-2"
        style={{ background: "#fff", borderColor: "#F5F5F0" }}
      >
        <div className="px-6 py-4 border-b-2" style={{ background: "#F5F5F0", borderColor: "#F5F5F0" }}>
          <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--dark)" }}>
            Commandes cette semaine — par statut
          </h2>
        </div>
        <div className="p-5 flex flex-col gap-3">
          {Object.keys(statutGroups).length === 0 ? (
            <p className="text-sm" style={{ color: "#aaa" }}>Aucune commande cette semaine.</p>
          ) : (
            Object.entries(statutGroups)
              .sort((a, b) => b[1] - a[1])
              .map(([statut, count]) => {
                const style = STATUT_COLORS[statut] ?? { color: "#555", bg: "rgba(26,26,10,.06)" };
                const total = commandesSemaine?.length ?? 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={statut} className="flex items-center gap-3">
                    <span
                      className="w-24 text-xs font-bold capitalize shrink-0"
                      style={{ color: style.color }}
                    >
                      {statut}
                    </span>
                    <div
                      className="flex-1 h-2 rounded-full overflow-hidden"
                      style={{ background: "var(--cream)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: style.color }}
                      />
                    </div>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold shrink-0"
                      style={{ background: style.bg, color: style.color }}
                    >
                      {count}
                    </span>
                  </div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
}
