import type { SupabaseClient } from "@supabase/supabase-js";

export interface ActiveWeek {
  semaine: number;
  annee: number;
  /** ISO date du premier jour de la semaine active (lundi) */
  dateDebut: string;
  /** ISO date du dernier jour de la semaine active (vendredi) */
  dateFin: string;
}

/**
 * Trouve la semaine dont les menus sont publiés et dont les dates
 * sont les plus proches d'aujourd'hui.
 *
 * Priorité :
 *   1. Semaine courante si des menus publiés existent pour aujourd'hui ou plus tard cette semaine
 *   2. Prochaine semaine disponible (menus futurs les plus proches)
 *   3. Fallback : semaine la plus récente publiée (passée)
 *
 * Retourne null si aucun menu publié n'existe.
 */
export async function getActiveWeek(supabase: SupabaseClient): Promise<ActiveWeek | null> {
  const today = new Date().toISOString().split("T")[0];

  // Cherche d'abord les menus futurs ou d'aujourd'hui
  const { data: upcoming } = await supabase
    .from("menus")
    .select("semaine, annee, date_livraison")
    .eq("publie", true)
    .gte("date_livraison", today)
    .order("date_livraison", { ascending: true })
    .limit(5);

  let target: { semaine: number; annee: number; date_livraison: string } | null = null;

  if (upcoming && upcoming.length > 0) {
    target = upcoming[0];
  } else {
    // Fallback : semaine passée la plus récente
    const { data: past } = await supabase
      .from("menus")
      .select("semaine, annee, date_livraison")
      .eq("publie", true)
      .lt("date_livraison", today)
      .order("date_livraison", { ascending: false })
      .limit(5);

    if (past && past.length > 0) {
      target = past[0];
    }
  }

  if (!target) return null;

  const { semaine, annee } = target;

  // Calcule lundi et vendredi de la semaine ISO trouvée
  const { dateDebut, dateFin } = getWeekBounds(annee, semaine);

  return { semaine, annee, dateDebut, dateFin };
}

/**
 * Calcule le lundi (dateDebut) et vendredi (dateFin) d'une semaine ISO donnée.
 */
function getWeekBounds(year: number, week: number): { dateDebut: string; dateFin: string } {
  // Le 4 janvier est toujours en semaine 1 de l'ISO
  const jan4 = new Date(year, 0, 4);
  const dayOfWeek = jan4.getDay() || 7; // 1 = lundi
  const monday = new Date(jan4);
  monday.setDate(jan4.getDate() - dayOfWeek + 1 + (week - 1) * 7);

  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  return {
    dateDebut: monday.toISOString().split("T")[0],
    dateFin:   friday.toISOString().split("T")[0],
  };
}
