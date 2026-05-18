import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/* ── Types ── */

interface Ligne {
  menu_id: string;
  variante: "plat" | "plat_vege";
  quantite: number;
}

interface Body {
  email: string;
  point_livraison_id: string;
  type: string;
  prix_unitaire: number;
  lignes: Ligne[];
}

/* ── Helpers ── */

function genRef(): string {
  const now = new Date();
  const d = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const r = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CLO-${d}-${r}`;
}

/* ── POST /api/commandes ── */

export async function POST(request: NextRequest) {
  try {
    const body: Body = await request.json();
    const { email, point_livraison_id, type, prix_unitaire, lignes } = body;

    /* Basic validation */
    if (!email?.trim())          return NextResponse.json({ error: "Email manquant." }, { status: 400 });
    if (!point_livraison_id)     return NextResponse.json({ error: "Point de livraison manquant." }, { status: 400 });
    if (!Array.isArray(lignes) || lignes.length === 0)
                                  return NextResponse.json({ error: "Aucune ligne de commande." }, { status: 400 });
    if (!prix_unitaire || prix_unitaire <= 0)
                                  return NextResponse.json({ error: "Prix unitaire invalide." }, { status: 400 });

    /* Supabase client (server) */
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
            } catch {}
          },
        },
      }
    );

    /* Look up client by email */
    const { data: client, error: clientErr } = await supabase
      .from("clients")
      .select("id")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (clientErr) {
      console.error("Client lookup error:", clientErr);
      return NextResponse.json({ error: "Erreur lors de la recherche de votre compte." }, { status: 500 });
    }

    if (!client) {
      return NextResponse.json(
        { error: "Aucun compte trouvé pour cet email. Inscrivez-vous via WhatsApp d'abord." },
        { status: 404 }
      );
    }

    /* Build rows to insert */
    const rows = lignes.map((ligne) => ({
      ref_commande:      genRef(),
      client_id:         client.id,
      menu_id:           ligne.menu_id,
      point_livraison:   point_livraison_id,
      type:              type,
      variante:          ligne.variante,
      quantite:          ligne.quantite,
      prix_unitaire:     prix_unitaire,
      prix_total:        parseFloat((prix_unitaire * ligne.quantite).toFixed(2)),
      statut:            "reserve",
    }));

    /* Insert */
    const { data: inserted, error: insertErr } = await supabase
      .from("commandes")
      .insert(rows)
      .select("ref_commande");

    if (insertErr) {
      console.error("Insert error:", insertErr);
      return NextResponse.json({ error: "Erreur lors de l'enregistrement. Réessayez." }, { status: 500 });
    }

    const refs = (inserted ?? []).map((r: { ref_commande: string }) => r.ref_commande);
    return NextResponse.json({ ok: true, refs }, { status: 201 });

  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Erreur serveur inattendue." }, { status: 500 });
  }
}
