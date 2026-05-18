import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Menu, Tarif, PointLivraison } from "@/lib/types";
import { getActiveWeek } from "@/lib/utils/getActiveWeek";
import CommanderClient from "./CommanderClient";
import Nav from "@/components/Nav";

export const metadata = {
  title: "Commander — Clodia",
  description: "Commandez vos repas gastronomiques livrés au CHU Limoges.",
};

export default async function CommanderPage() {
  const supabase = await createServerSupabaseClient();

  // Détecte la semaine active dynamiquement
  const activeWeek = await getActiveWeek(supabase);

  const [{ data: menus }, { data: tarifs }, { data: points }] = await Promise.all([
    activeWeek
      ? supabase
          .from("menus")
          .select("id, date_livraison, plat, plat_vege, dessert, publie")
          .eq("publie", true)
          .eq("semaine", activeWeek.semaine)
          .eq("annee", activeWeek.annee)
          .order("date_livraison")
      : supabase
          .from("menus")
          .select("id, date_livraison, plat, plat_vege, dessert, publie")
          .eq("publie", true)
          .gte("date_livraison", new Date().toISOString().split("T")[0])
          .order("date_livraison")
          .limit(5),
    supabase
      .from("tarifs")
      .select("*")
      .order("repas_de", { ascending: true }),
    supabase
      .from("points_livraison")
      .select("*")
      .order("hopital"),
  ]);

  return (
    <>
      <Nav />
      <CommanderClient
        menus={(menus as Menu[]) ?? []}
        tarifs={(tarifs as Tarif[]) ?? []}
        points={(points as PointLivraison[]) ?? []}
        activeWeek={activeWeek ?? undefined}
      />
    </>
  );
}
