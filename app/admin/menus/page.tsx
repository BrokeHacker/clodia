import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Menu } from "@/lib/types";
import MenusClient from "./MenusClient";

export default async function MenusPage() {
  const supabase = await createServerSupabaseClient();
  const { data: menus } = await supabase
    .from("menus")
    .select("*")
    .order("date_livraison", { ascending: false });

  return (
    <div className="px-6 md:px-10 py-8">
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--dark)" }}>
        Menus
      </h1>
      <p className="text-sm mb-8" style={{ color: "#888" }}>
        Gérez les menus hebdomadaires. Cliquez sur une ligne pour modifier.
      </p>
      <MenusClient menus={(menus as Menu[]) ?? []} />
    </div>
  );
}
