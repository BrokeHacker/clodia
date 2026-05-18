const steps = [
  {
    num: "01",
    icon: "💬",
    title: "Ouvrez WhatsApp",
    desc: "Scannez le QR code ou cliquez sur le lien. Notre bot vous guide en 2 minutes, sans téléchargement.",
  },
  {
    num: "02",
    icon: "🍽️",
    title: "Choisissez votre repas",
    desc: "Plat du jour ou option végétarienne — formule unique, pack ou abonnement hebdomadaire.",
  },
  {
    num: "03",
    icon: "💳",
    title: "Payez en ligne",
    desc: "Paiement sécurisé via Stripe directement dans la conversation WhatsApp.",
  },
  {
    num: "04",
    icon: "📍",
    title: "Récupérez votre repas",
    desc: "Livraison avant 12h dans votre service. Chaque repas est emballé avec soin, prêt à déguster.",
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
          Simple comme un message
        </h2>
        <p className="text-base leading-relaxed mb-14" style={{ color: "var(--gray-600)", maxWidth: 460 }}>
          Pas d'app à installer, pas de compte à créer. Tout se passe dans WhatsApp.
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
