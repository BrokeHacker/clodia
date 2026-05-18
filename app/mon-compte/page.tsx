import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Client, CommandeAvecMenu, PointLivraison } from "@/lib/types";
import MonCompteClient from "./MonCompteClient";

export default async function MonComptePage() {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/connexion");

  // Matcher le client via son email
  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("email", user.email!)
    .single();

  if (!client) {
    return <CompteIntrouvable email={user.email!} />;
  }

  // Commandes avec menus
  const { data: commandes } = await supabase
    .from("commandes")
    .select("*, menus(*)")
    .eq("client_id", (client as Client).id)
    .order("created_at", { ascending: false });

  // Point de livraison habituel
  let pointLivraison: PointLivraison | null = null;
  if ((client as Client).point_livraison) {
    const { data: pl } = await supabase
      .from("points_livraison")
      .select("*")
      .eq("id", (client as Client).point_livraison!)
      .single();
    pointLivraison = pl as PointLivraison | null;
  }

  // Plats favoris (les plats les plus commandés)
  const platCounts: Record<string, number> = {};
  (commandes as CommandeAvecMenu[] | null)?.forEach((c) => {
    if (c.menus?.plat && c.variante !== "plat_vege") {
      platCounts[c.menus.plat] = (platCounts[c.menus.plat] ?? 0) + c.quantite;
    }
    if (c.menus?.plat_vege && c.variante === "plat_vege") {
      platCounts[c.menus.plat_vege] = (platCounts[c.menus.plat_vege] ?? 0) + c.quantite;
    }
  });
  const favoris = Object.entries(platCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([plat, count]) => ({ plat, count }));

  // Statut abonné
  const commandesActives = (commandes as CommandeAvecMenu[] | null)?.filter(
    (c) => c.statut === "confirme" || c.statut === "reserve"
  );
  const isAbonne = (commandesActives?.length ?? 0) >= 3;

  return (
    <MonCompteClient
      client={client as Client}
      commandes={(commandes as CommandeAvecMenu[]) ?? []}
      pointLivraison={pointLivraison}
      favoris={favoris}
      isAbonne={isAbonne}
      userEmail={user.email!}
    />
  );
}

function CompteIntrouvable({ email }: { email: string }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--cream)" }}
    >
      <div className="max-w-sm text-center">
        <span className="text-5xl block mb-4">🔍</span>
        <h1 className="text-xl font-bold mb-2" style={{ color: "var(--dark)" }}>
          Compte introuvable
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: "#666" }}>
          Aucun compte client n&apos;est associé à{" "}
          <strong>{email}</strong>.
          <br />
          Avez-vous déjà commandé via WhatsApp avec cette adresse ?
        </p>
        <a
          href="https://wa.me/33XXXXXXXXX"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-6 px-6 py-3 rounded-full text-sm font-bold"
          style={{ background: "var(--burgundy)", color: "var(--lime)" }}
        >
          Commander sur WhatsApp
        </a>
      </div>
    </div>
  );
}
