import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Client, PointLivraison } from "@/lib/types";
import ClientsTable from "./ClientsTable";

export default async function ClientsPage() {
  const supabase = await createServerSupabaseClient();

  const [{ data: clients }, { data: points }] = await Promise.all([
    supabase.from("clients").select("*").order("created_at", { ascending: false }),
    supabase.from("points_livraison").select("*").order("hopital"),
  ]);

  // Compter les commandes par client
  const { data: commandeCounts } = await supabase
    .from("commandes")
    .select("client_id");

  const counts = (commandeCounts ?? []).reduce(
    (acc, c) => {
      acc[c.client_id] = (acc[c.client_id] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Enrichir les clients
  const pointsMap = Object.fromEntries(
    ((points as PointLivraison[]) ?? []).map((p) => [p.id, p])
  );

  const enriched = ((clients as Client[]) ?? []).map((c) => ({
    ...c,
    nbCommandes: counts[c.id] ?? 0,
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
