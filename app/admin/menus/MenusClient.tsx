"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Menu } from "@/lib/types";

interface EditState {
  plat: string;
  plat_vege: string;
  dessert: string;
  photo: string;
  publie: boolean;
}

export default function MenusClient({ menus: initialMenus }: { menus: Menu[] }) {
  const [menus, setMenus] = useState<Menu[]>(initialMenus);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);
  const [creatingNew, setCreatingNew] = useState(false);
  const [newMenu, setNewMenu] = useState<Partial<Menu>>({
    date_livraison: "",
    semaine: 1,
    annee: new Date().getFullYear(),
    plat: "",
    plat_vege: "",
    dessert: "",
    publie: false,
  });
  const [error, setError] = useState("");

  function startEdit(menu: Menu) {
    setEditingId(menu.id);
    setEditState({
      plat: menu.plat,
      plat_vege: menu.plat_vege,
      dessert: menu.dessert,
      photo: menu.photo ?? "",
      publie: menu.publie,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditState(null);
  }

  async function saveEdit(id: string) {
    if (!editState) return;
    setSaving(true);
    setError("");
    const supabase = createClient();
    const { data, error: err } = await supabase
      .from("menus")
      .update({
        plat: editState.plat,
        plat_vege: editState.plat_vege,
        dessert: editState.dessert,
        photo: editState.photo || null,
        publie: editState.publie,
      })
      .eq("id", id)
      .select()
      .single();

    if (err) {
      setError("Erreur lors de la sauvegarde.");
    } else {
      setMenus((prev) => prev.map((m) => (m.id === id ? (data as Menu) : m)));
      setEditingId(null);
      setEditState(null);
    }
    setSaving(false);
  }

  async function togglePublie(menu: Menu) {
    const supabase = createClient();
    const { data } = await supabase
      .from("menus")
      .update({ publie: !menu.publie })
      .eq("id", menu.id)
      .select()
      .single();
    if (data) {
      setMenus((prev) => prev.map((m) => (m.id === menu.id ? (data as Menu) : m)));
    }
  }

  async function createMenu() {
    setSaving(true);
    setError("");
    const supabase = createClient();
    const { data, error: err } = await supabase
      .from("menus")
      .insert({
        date_livraison: newMenu.date_livraison,
        semaine: newMenu.semaine,
        annee: newMenu.annee,
        plat: newMenu.plat,
        plat_vege: newMenu.plat_vege,
        dessert: newMenu.dessert,
        publie: newMenu.publie ?? false,
        photo: null,
      })
      .select()
      .single();

    if (err) {
      setError("Erreur lors de la création.");
    } else {
      setMenus((prev) => [data as Menu, ...prev]);
      setCreatingNew(false);
      setNewMenu({
        date_livraison: "",
        semaine: 1,
        annee: new Date().getFullYear(),
        plat: "",
        plat_vege: "",
        dessert: "",
        publie: false,
      });
    }
    setSaving(false);
  }

  // Regrouper par semaine/annee
  const grouped = menus.reduce(
    (acc, m) => {
      const key = `S${m.semaine} ${m.annee}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(m);
      return acc;
    },
    {} as Record<string, Menu[]>
  );

  return (
    <div>
      {error && (
        <div
          className="mb-4 px-4 py-3 rounded-xl text-sm font-medium border-l-4"
          style={{ background: "rgba(255,61,107,.06)", borderColor: "var(--coral)", color: "var(--coral)" }}
        >
          {error}
        </div>
      )}

      {/* Bouton créer */}
      <div className="mb-6">
        {!creatingNew ? (
          <button
            onClick={() => setCreatingNew(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all"
            style={{ background: "var(--burgundy)", color: "var(--lime)" }}
          >
            + Créer un menu
          </button>
        ) : (
          <div
            className="rounded-2xl p-6 border-2 mb-4"
            style={{ background: "#fff", borderColor: "var(--burgundy)" }}
          >
            <h3 className="text-sm font-bold mb-4" style={{ color: "var(--dark)" }}>
              Nouveau menu
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              <FormField label="Date de livraison">
                <input
                  type="date"
                  value={newMenu.date_livraison}
                  onChange={(e) => setNewMenu({ ...newMenu, date_livraison: e.target.value })}
                  className="field-input"
                />
              </FormField>
              <FormField label="Semaine">
                <input
                  type="number"
                  value={newMenu.semaine}
                  onChange={(e) => setNewMenu({ ...newMenu, semaine: Number(e.target.value) })}
                  className="field-input"
                />
              </FormField>
              <FormField label="Année">
                <input
                  type="number"
                  value={newMenu.annee}
                  onChange={(e) => setNewMenu({ ...newMenu, annee: Number(e.target.value) })}
                  className="field-input"
                />
              </FormField>
              <FormField label="Plat du jour" className="col-span-2 md:col-span-3">
                <input
                  type="text"
                  value={newMenu.plat}
                  onChange={(e) => setNewMenu({ ...newMenu, plat: e.target.value })}
                  placeholder="Ex: Filet de bar, beurre blanc..."
                  className="field-input"
                />
              </FormField>
              <FormField label="Option végétarienne" className="col-span-2 md:col-span-3">
                <input
                  type="text"
                  value={newMenu.plat_vege}
                  onChange={(e) => setNewMenu({ ...newMenu, plat_vege: e.target.value })}
                  placeholder="Ex: Risotto champignons..."
                  className="field-input"
                />
              </FormField>
              <FormField label="Dessert" className="col-span-2 md:col-span-3">
                <input
                  type="text"
                  value={newMenu.dessert}
                  onChange={(e) => setNewMenu({ ...newMenu, dessert: e.target.value })}
                  placeholder="Ex: Panna cotta fruits rouges..."
                  className="field-input"
                />
              </FormField>
            </div>
            <label className="flex items-center gap-2 text-sm font-medium mb-4 cursor-pointer" style={{ color: "var(--dark)" }}>
              <input
                type="checkbox"
                checked={newMenu.publie}
                onChange={(e) => setNewMenu({ ...newMenu, publie: e.target.checked })}
                className="w-4 h-4 accent-[#4D0F1F]"
              />
              Publier immédiatement
            </label>
            <div className="flex gap-2">
              <button
                onClick={createMenu}
                disabled={saving}
                className="px-5 py-2 rounded-full text-sm font-bold"
                style={{ background: "var(--burgundy)", color: "var(--lime)", opacity: saving ? 0.7 : 1 }}
              >
                {saving ? "Création…" : "Créer"}
              </button>
              <button
                onClick={() => setCreatingNew(false)}
                className="px-5 py-2 rounded-full text-sm font-semibold border-2"
                style={{ color: "#888", borderColor: "rgba(26,26,10,.15)" }}
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Liste groupée */}
      {Object.entries(grouped).map(([semaine, items]) => (
        <div key={semaine} className="mb-8">
          <h2
            className="text-xs font-bold uppercase tracking-widest mb-3 px-1"
            style={{ color: "#aaa" }}
          >
            {semaine}
          </h2>
          <div
            className="rounded-2xl overflow-hidden border-2"
            style={{ background: "#fff", borderColor: "#F5F5F0" }}
          >
            {items.map((menu, idx) => {
              const isEditing = editingId === menu.id;
              const dateStr = new Date(menu.date_livraison + "T12:00:00").toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              });

              return (
                <div
                  key={menu.id}
                  className={idx < items.length - 1 ? "border-b-2" : ""}
                  style={{ borderColor: "#F5F5F0" }}
                >
                  {!isEditing ? (
                    <div className="px-5 py-4 flex items-center gap-4 hover:bg-[#FAFAFA] transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold capitalize" style={{ color: "var(--dark)" }}>
                            {dateStr}
                          </span>
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-bold"
                            style={
                              menu.publie
                                ? { background: "rgba(46,204,113,.12)", color: "#008060" }
                                : { background: "rgba(26,26,10,.06)", color: "#aaa" }
                            }
                          >
                            {menu.publie ? "Publié" : "Brouillon"}
                          </span>
                        </div>
                        <p className="text-sm truncate" style={{ color: "var(--dark)" }}>
                          🍽️ {menu.plat}
                        </p>
                        <p className="text-xs truncate" style={{ color: "#888" }}>
                          🥗 {menu.plat_vege} · 🍮 {menu.dessert}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => togglePublie(menu)}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                          style={{ color: "var(--dark)", borderColor: "rgba(26,26,10,.2)" }}
                        >
                          {menu.publie ? "Dépublier" : "Publier"}
                        </button>
                        <button
                          onClick={() => startEdit(menu)}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold"
                          style={{ background: "var(--burgundy)", color: "var(--lime)" }}
                        >
                          Modifier
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="px-5 py-5" style={{ background: "#FAFAFA" }}>
                      <p className="text-xs font-bold mb-3 capitalize" style={{ color: "var(--dark)" }}>
                        {dateStr}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <FormField label="Plat du jour" className="md:col-span-3">
                          <input
                            type="text"
                            value={editState!.plat}
                            onChange={(e) => setEditState({ ...editState!, plat: e.target.value })}
                            className="field-input"
                          />
                        </FormField>
                        <FormField label="Option végétarienne" className="md:col-span-3">
                          <input
                            type="text"
                            value={editState!.plat_vege}
                            onChange={(e) => setEditState({ ...editState!, plat_vege: e.target.value })}
                            className="field-input"
                          />
                        </FormField>
                        <FormField label="Dessert">
                          <input
                            type="text"
                            value={editState!.dessert}
                            onChange={(e) => setEditState({ ...editState!, dessert: e.target.value })}
                            className="field-input"
                          />
                        </FormField>
                        <FormField label="Photo (URL)">
                          <input
                            type="text"
                            value={editState!.photo}
                            onChange={(e) => setEditState({ ...editState!, photo: e.target.value })}
                            placeholder="https://..."
                            className="field-input"
                          />
                        </FormField>
                        <div className="flex items-end pb-1">
                          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer" style={{ color: "var(--dark)" }}>
                            <input
                              type="checkbox"
                              checked={editState!.publie}
                              onChange={(e) => setEditState({ ...editState!, publie: e.target.checked })}
                              className="w-4 h-4 accent-[#4D0F1F]"
                            />
                            Publié
                          </label>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(menu.id)}
                          disabled={saving}
                          className="px-5 py-2 rounded-full text-sm font-bold"
                          style={{ background: "var(--burgundy)", color: "var(--lime)", opacity: saving ? 0.7 : 1 }}
                        >
                          {saving ? "Sauvegarde…" : "Sauvegarder"}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-5 py-2 rounded-full text-sm font-semibold border-2"
                          style={{ color: "#888", borderColor: "rgba(26,26,10,.15)" }}
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {menus.length === 0 && !creatingNew && (
        <div className="text-center py-16">
          <span className="text-4xl block mb-3">🍽️</span>
          <p className="text-sm" style={{ color: "#aaa" }}>Aucun menu. Créez le premier !</p>
        </div>
      )}

      {/* Shared field styles */}
      <style>{`
        .field-input {
          width: 100%;
          padding: 10px 14px;
          background: #fff;
          border: 2px solid rgba(26,26,10,.1);
          border-radius: 10px;
          color: #1A1A0A;
          font-size: 13px;
          font-weight: 500;
          outline: none;
          transition: border-color .15s;
        }
        .field-input:focus { border-color: #4D0F1F; }
      `}</style>
    </div>
  );
}

function FormField({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "#999" }}>
        {label}
      </label>
      {children}
    </div>
  );
}
