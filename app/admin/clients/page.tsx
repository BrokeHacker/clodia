import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Client, PointLivraison } from "@/lib/types";
import ClientsTable from "./ClientsTable";

export default async function ClientsPage() {
  const supabase = await createServerSupabaseClient();

  const [{ data: clients }, { data: points }] = await Promise.all([
    supabase.from("clients").select("*").order("created_at", { ascending: false }),
    supabase.from("points_livraison").select("*").order("hopital"),
  ]);

  // Commandes : comptage + dernière date
  const { data: commandeCounts } = await supabase
    .from("commandes")
    .select("client_id, created_at")
    .order("created_at", { ascending: false });

  const counts: Record<string, number> = {};
  const lastOrder: Record<string, string> = {};
  for (const c of commandeCounts ?? []) {
    counts[c.client_id] = (counts[c.client_id] ?? 0) + 1;
    if (!lastOrder[c.client_id]) lastOrder[c.client_id] = c.created_at;
  }

  // Enrichir les clients
  const pointsMap = Object.fromEntries(
    ((points as PointLivraison[]) ?? []).map((p) => [p.id, p])
  );

  const enriched = ((clients as Client[]) ?? []).map((c) => ({
    ...c,
    nbCommandes: counts[c.id] ?? 0,
    derniereCommande: lastOrder[c.id] ?? null,
    pointLivraisonObj: c.point_livraison ? pointsMap[c.point_livraison] ?? null : null,
  }));

  return (
    <div className="px-6 md:px-10 py-8">
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--dark)" }}>
        Clients
      </h1>
      <p className="text-sm mb-8" style={{ color: "#888" }}>
        {enriched.length} client{enriched.length > 1 ? "s" : ""} enregistré{enriched.length > 1 ? "s" : ""}
      </p>
      <ClientsTable
        clients={enriched}
        points={(points as PointLivraison[]) ?? []}
      />
    </div>
  );
}
