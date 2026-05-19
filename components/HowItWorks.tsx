const steps = [
  {
    num: "01",
    icon: "🎛️",
    title: "Je choisis mes jours",
    desc: "De 2 à 5 jours dans la semaine. Je sélectionne mes plats et ma variante — plat du jour ou option végé.",
  },
  {
    num: "02",
    icon: "✏️",
    title: "Je valide avant mercredi 22h",
    desc: "Ma pré-commande est confirmée pour la semaine suivante en quelques clics. Sans engagement.",
  },
  {
    num: "03",
    icon: "🚚",
    title: "Livraison avant 12h",
    desc: "Mon repas est déposé dans le réfrigérateur de mon service, prêt à récupérer à la pause déjeuner.",
  },
  {
    num: "04",
    icon: "🍽️",
    title: "Plat + dessert inclus",
    desc: "Chaque menu inclut un plat (ou option végé) et un dessert cuisiné par notre chef Gault & Millau.",
  },
];

export default function HowItWorks() {
  return (
    <section id="comment-ca-marche" className="py-24 px-6 md:px-10" style={{ background: "#fff" }}>
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--green)" }}>
          Comment ça marche
        </p>
        <h2
          className="font-bold mb-4 tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 42px)", color: "var(--dark)" }}
        >
          Commandé en 2 minutes, livré avant midi
        </h2>
        <p className="text-base leading-relaxed mb-14" style={{ color: "var(--gray-600)", maxWidth: 460 }}>
          Chaque semaine, choisissez vos jours et vos plats. On s&apos;occupe du reste.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="rounded-xl p-6 border transition-shadow duration-200 hover:shadow-md"
              style={{ background: "var(--gray-50)", borderColor: "var(--gray-200)" }}
            >
              <div className="text-3xl font-bold mb-5 leading-none" style={{ color: "var(--gray-200)" }}>
                {step.num}
              </div>
              <span className="text-3xl block mb-4">{step.icon}</span>
              <h3 className="text-base font-semibold mb-2" style={{ color: "var(--dark)" }}>
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--gray-600)" }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
