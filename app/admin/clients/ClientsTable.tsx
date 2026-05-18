"use client";

import { useState } from "react";
import { Client, PointLivraison } from "@/lib/types";

interface EnrichedClient extends Client {
  nbCommandes: number;
  pointLivraisonObj: PointLivraison | null;
}

interface Props {
  clients: EnrichedClient[];
  points: PointLivraison[];
}

export default function ClientsTable({ clients, points }: Props) {
  const [filterPoint, setFilterPoint] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = clients.filter((c) => {
    const matchPoint =
      filterPoint === "all" || c.point_livraison === filterPoint;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      c.prenom?.toLowerCase().includes(q) ||
      c.nom?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.telephone?.includes(q);
    return matchPoint && matchSearch;
  });

  return (
    <div>
      {/* Filtres */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un client…"
          className="px-4 py-2.5 rounded-xl text-sm border-2 outline-none w-56 transition-all"
          style={{
            background: "#fff",
            borderColor: "rgba(26,26,10,.1)",
            color: "var(--dark)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--burgundy)")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(26,26,10,.1)")}
        />
        <select
          value={filterPoint}
          onChange={(e) => setFilterPoint(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm border-2 outline-none transition-all"
          style={{
            background: "#fff",
            borderColor: "rgba(26,26,10,.1)",
            color: "var(--dark)",
          }}
        >
          <option value="all">Tous les points de livraison</option>
          {points.map((p) => (
            <option key={p.id} value={p.id}>
              {p.hopital} — {p.service}
            </option>
          ))}
        </select>
        {(filterPoint !== "all" || search) && (
          <button
            onClick={() => { setFilterPoint("all"); setSearch(""); }}
            className="px-4 py-2.5 rounded-xl text-sm font-medium"
            style={{ color: "#888", background: "rgba(26,26,10,.06)" }}
          >
            Réinitialiser
          </button>
        )}
      </div>

      <p className="text-xs mb-3" style={{ color: "#aaa" }}>
        {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
      </p>

      {/* Table desktop */}
      <div
        className="rounded-2xl overflow-hidden border-2 hidden md:block"
        style={{ background: "#fff", borderColor: "#F5F5F0" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "#F5F5F0" }}>
              {["Client", "Téléphone", "Email", "Point de livraison", "Commandes", "Inscription"].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider"
                  style={{ color: "#aaa" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm" style={{ color: "#aaa" }}>
                  Aucun client trouvé.
                </td>
              </tr>
            ) : (
              filtered.map((client, idx) => (
                <tr
                  key={client.id}
                  className="border-t-2"
                  style={{ borderColor: "#F5F5F0" }}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ background: idx % 2 === 0 ? "var(--lime)" : "#F5F5F0", color: "var(--dark)" }}
                      >
                        {client.prenom?.[0]}{client.nom?.[0]}
                      </div>
                      <span className="font-semibold" style={{ color: "var(--dark)" }}>
                        {client.prenom} {client.nom}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs" style={{ color: "#666" }}>
                    {client.telephone}
                  </td>
                  <td className="px-5 py-3.5 text-xs" style={{ color: "#666" }}>
                    {client.email ?? "—"}
                  </td>
                  <td className="px-5 py-3.5 text-xs" style={{ color: "#666" }}>
                    {client.pointLivraisonObj
                      ? `${client.pointLivraisonObj.hopital} — ${client.pointLivraisonObj.service}`
                      : "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-bold"
                      style={
                        client.nbCommandes > 0
                          ? { background: "rgba(46,204,113,.12)", color: "#008060" }
                          : { background: "rgba(26,26,10,.06)", color: "#aaa" }
                      }
                    >
                      {client.nbCommandes}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs" style={{ color: "#aaa" }}>
                    {new Date(client.created_at).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Cards mobile */}
      <div className="md:hidden flex flex-col gap-3">
        {filtered.map((client) => (
          <div
            key={client.id}
            className="rounded-2xl p-5 border-2"
            style={{ background: "#fff", borderColor: "#F5F5F0" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: "var(--lime)", color: "var(--dark)" }}
              >
                {client.prenom?.[0]}{client.nom?.[0]}
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: "var(--dark)" }}>
                  {client.prenom} {client.nom}
                </p>
                <p className="text-xs font-mono" style={{ color: "#888" }}>{client.telephone}</p>
              </div>
              <span
                className="ml-auto px-2.5 py-1 rounded-full text-xs font-bold"
                style={{ background: "rgba(46,204,113,.12)", color: "#008060" }}
              >
                {client.nbCommandes} cmd
              </span>
            </div>
            <p className="text-xs" style={{ color: "#888" }}>
              {client.pointLivraisonObj
                ? `📍 ${client.pointLivraisonObj.hopital} — ${client.pointLivraisonObj.service}`
                : "Pas de point de livraison"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
