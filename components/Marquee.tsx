const items = [
  "Cuisine gastronomique",
  "Livraison avant 12h dans votre service",
  "Chef Gault & Millau",
  "Dès 12,20 €/repas",
  "Option végétarienne disponible",
  "Commande avant mercredi 22h",
  "Sans engagement",
  "Plat + dessert inclus",
];

export default function Marquee() {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden py-3 border-y" style={{ background: "var(--gray-50)", borderColor: "var(--gray-200)" }}>
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span className="px-8 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--gray-400)" }}>
              {item}
            </span>
            <span className="w-1 h-1 rounded-full" style={{ background: "var(--gray-200)" }} />
          </span>
        ))}
      </div>
    </div>
  );
}
