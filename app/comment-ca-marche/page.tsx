import type { Metadata } from "next";
import Image from "next/image";
import CTASemaineButtons from "@/components/CTASemaineButtons";

export const metadata: Metadata = {
  title: "Comment ça marche — Clodia",
  description:
    "De la commande à la dégustation, tout est pensé pour s'adapter à votre quotidien de soignant.",
};

const avantagesPrecommande = [
  { icone: "ti-tag", texte: "Tarifs réduits par rapport à la commande à l'unité" },
  { icone: "ti-check", texte: "Disponibilité garantie sur tous les menus" },
  { icone: "ti-calendar", texte: "Menu disponible dès le jeudi pour planifier sereinement" },
  { icone: "ti-leaf", texte: "Zéro gaspillage — on cuisine exactement ce qu'il faut" },
];

export default function CommentCaMarchePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#FFF9D6] py-24">
        <div className="max-w-5xl mx-auto px-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#FD3D6B] block mb-4">
            Simple & rapide
          </span>
          <h1 className="text-5xl font-semibold text-[#4D0F1F] leading-tight mb-6">
            Comment ça marche ?
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed max-w-xl">
            De la commande à la dégustation, tout est pensé pour s&apos;adapter à votre quotidien
            de soignant.
          </p>
        </div>
      </section>

      {/* Étape 1 */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <p
            className="font-semibold leading-none mb-4"
            style={{ fontSize: 72, color: "#C4704F" }}
          >
            01
          </p>
          <h2 className="text-3xl font-semibold text-[#4D0F1F] mb-8">
            Choisissez votre menu
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Bloc mis en avant */}
            <div className="bg-[#E8FFF8] rounded-2xl p-6 flex flex-col ring-2 ring-[#00CCCC]">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#00CCCC] block mb-3">
                Notre recommandation
              </span>
              <h3 className="text-xl font-semibold text-[#4D0F1F] mb-3">
                La pré-commande
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                Commandez avant mercredi minuit pour la semaine suivante. Vous planifiez vos
                repas à l&apos;avance, bénéficiez de tarifs préférentiels, et contribuez à une
                démarche zéro gaspillage. Chaque commande anticipée nous permet de cuisiner
                exactement ce dont vous avez besoin.
              </p>
              <ul className="flex flex-col gap-3 mb-5">
                {avantagesPrecommande.map(({ icone, texte }) => (
                  <li key={icone} className="flex items-start gap-3 text-sm text-gray-600">
                    <i
                      className={`ti ${icone} shrink-0 mt-0.5`}
                      style={{ fontSize: 18, color: "#00CCCC" }}
                    />
                    {texte}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <CTASemaineButtons semaine="suivante" />
              </div>
            </div>

            {/* Bloc secondaire */}
            <div className="bg-[#F5F0E8] rounded-2xl p-6 flex flex-col">
              <div className="text-xs font-semibold uppercase tracking-widest mb-3 invisible">
                NOTRE RECOMMANDATION
              </div>
              <h3 className="text-xl font-semibold text-[#4D0F1F] mb-3">
                La commande en cours de semaine
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-3">
                Vous préférez rester flexible ? Commandez jusqu&apos;à la veille à minuit selon
                vos gardes et vos envies. Les menus disponibles sont affichés en temps réel.
              </p>
              <ul className="flex flex-col gap-2 mt-4 mb-5">
                <li className="flex items-center gap-2 text-sm text-[#4D0F1F]">
                  <i className="ti ti-arrows-shuffle text-[#C4704F]" />
                  Flexibilité totale
                </li>
                <li className="flex items-center gap-2 text-sm text-[#4D0F1F]">
                  <i className="ti ti-clock text-[#C4704F]" />
                  Commande possible la veille jusqu&apos;à minuit
                </li>
                <li className="flex items-center gap-2 text-sm text-[#4D0F1F]">
                  <i className="ti ti-alert-triangle text-[#FF9933]" />
                  Disponibilités non garanties
                </li>
              </ul>
              <div className="mt-auto">
                <CTASemaineButtons semaine="courante" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Étape 2 */}
      <section className="py-24 bg-[#F5F0E8]/70">
        <div className="max-w-5xl mx-auto px-6">
          <p
            className="font-semibold leading-none mb-4"
            style={{ fontSize: 72, color: "#C4704F" }}
          >
            02
          </p>
          <h2 className="text-3xl font-semibold text-[#4D0F1F] mb-8">
            Choisissez votre frigidaire
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Colonne 1 — Photo */}
            <div className="lg:col-span-1">
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden">
                <Image
                  src="/images/Frigo.png"
                  alt="Frigidaire Clodia dans un service hospitalier"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-4">
                  <p className="text-white text-xs italic">
                    Votre frigidaire Clodia dans votre service
                  </p>
                </div>
              </div>
            </div>

            {/* Colonne 2 — Texte principal */}
            <div className="lg:col-span-1">
              <h3 className="text-xl font-semibold text-[#4D0F1F] mb-4">
                Une livraison au cœur de votre service
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Pas de détour par la cafétéria. Votre repas est déposé directement dans un
                frigidaire dédié Clodia, installé au sein de votre service.
              </p>

              <div className="my-6 border-t border-gray-200" />

              <h3 className="text-xl font-semibold text-[#4D0F1F] mb-4">
                Comment trouver votre frigidaire ?
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                La sélection se fait en 3 étapes simples :
              </p>
              <ol className="flex flex-col gap-2">
                {[
                  "Choisissez votre hôpital",
                  "Sélectionnez votre bâtiment",
                  "Choisissez votre service — l'emplacement exact du frigidaire s'affiche",
                ].map((texte, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#4D0F1F]">
                    <span className="shrink-0 font-semibold text-[#C4704F]">{i + 1}.</span>
                    {texte}
                  </li>
                ))}
              </ol>
            </div>

            {/* Colonne 3 — CTA */}
            <div className="lg:col-span-1">
              <p className="font-semibold text-[#4D0F1F] mb-3">
                Vous ne savez pas où est votre frigidaire ?
              </p>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                Utilisez notre outil de recherche pour trouver le point de livraison le
                plus proche de votre service.
              </p>
              <a
                href="/#frigidaire"
                className="bg-[#007FFF] hover:bg-[#0066cc] text-white text-sm font-semibold px-7 py-4 rounded-full w-full block text-center transition-colors"
              >
                Trouver mon frigidaire
              </a>

              <div className="my-6 border-t border-gray-200" />

              <p className="text-sm text-gray-500 mb-2">
                Vous ne trouvez pas votre service ?
              </p>
              <a
                href="mailto:contact@clodia.fr?subject=Demande de nouveau point de livraison"
                className="text-sm text-[#007FFF] hover:underline"
              >
                Demandez l&apos;ouverture d&apos;un nouveau point →
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Étape 3 */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <p
            className="font-semibold leading-none mb-4"
            style={{ fontSize: 72, color: "#C4704F" }}
          >
            03
          </p>
          <h2 className="text-3xl font-semibold text-[#4D0F1F] mb-1">
            La livraison
          </h2>
          <p className="text-gray-500 italic mb-8">
            Vous ne faites rien, on s&apos;occupe de tout.
          </p>

          <div className="flex flex-col lg:flex-row gap-10 items-start">

            {/* Colonne gauche — Liste */}
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-[#4D0F1F] mb-6">
                Une livraison pensée pour vous
              </h3>
              <ul className="flex flex-col gap-4">
                <li className="flex items-start gap-3 text-sm text-gray-600">
                  <span
                    className="shrink-0 flex items-center justify-center rounded-full mt-0.5"
                    style={{ background: "#4D0F1F", width: 22, height: 22 }}
                  >
                    <i className="ti ti-bolt" style={{ fontSize: 13, color: "#EAFF33" }} />
                  </span>
                  Livraison en véhicule 100% électrique
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600">
                  <i className="ti ti-snowflake shrink-0 mt-0.5" style={{ fontSize: 18, color: "#007FFF" }} />
                  Chaîne du froid respectée — caisses de transport réfrigérées
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600">
                  <i className="ti ti-clock shrink-0 mt-0.5" style={{ fontSize: 18, color: "#00CCCC" }} />
                  Dépôt dans votre frigidaire avant 12h, sans aucune intervention de votre part
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600">
                  <i className="ti ti-tag shrink-0 mt-0.5" style={{ fontSize: 18, color: "#C4704F" }} />
                  Chaque plat est étiqueté à votre nom
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600">
                  <i className="ti ti-bell shrink-0 mt-0.5" style={{ fontSize: 18, color: "#FD3D6B" }} />
                  Notification envoyée dès que votre repas est dans le frigidaire
                </li>
              </ul>
            </div>

            {/* Colonne droite — CTA */}
            <div className="lg:w-80 shrink-0">
              <p className="font-semibold text-[#4D0F1F] mb-3">
                Vous avez une question sur la livraison ?
              </p>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                Consultez notre FAQ pour tout savoir sur le déroulé de la livraison, les
                horaires et la chaîne du froid.
              </p>
              <a
                href="/faq"
                className="btn-outline-wine text-sm px-7 py-4 w-full block text-center rounded-full"
              >
                Consulter la FAQ
              </a>

              <div className="my-6 border-t border-gray-200" />

              <p className="text-sm text-gray-500 mb-2">
                Un problème avec votre livraison ?
              </p>
              <a
                href="mailto:contact@clodia.fr?subject=Problème de livraison"
                className="text-sm text-[#007FFF] hover:underline"
              >
                Contactez-nous → contact@clodia.fr
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Étape 4 */}
      <section className="py-24 bg-[#F5F0E8]/70">
        <div className="max-w-5xl mx-auto px-6">
          <p
            className="font-semibold leading-none mb-4"
            style={{ fontSize: 72, color: "#C4704F" }}
          >
            04
          </p>
          <h2 className="text-3xl font-semibold text-[#4D0F1F] mb-1">
            La dégustation
          </h2>
          <p className="text-gray-500 italic mb-8">
            Prêt en 2 minutes, savouré à votre rythme.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Colonne 1 — Photo */}
            <div className="lg:col-span-1">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden w-full">
                <Image
                  src="/images/Plat 05.jpeg"
                  alt="Plat Clodia"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <p className="absolute bottom-4 left-4 right-4 text-white text-xs italic">
                  Cuisiné ce matin, dans votre frigidaire avant midi.
                </p>
              </div>
            </div>

            {/* Colonne 2 — Liste */}
            <div className="lg:col-span-1">
              <h3 className="text-xl font-semibold text-[#4D0F1F] mb-6">
                Tout est pensé jusqu&apos;au bout
              </h3>
              <ul className="flex flex-col gap-4">
                <li className="flex items-start gap-3 text-sm text-gray-600">
                  <i className="ti ti-microwave shrink-0 mt-0.5" style={{ fontSize: 18, color: "#C4704F" }} />
                  Barquette en carton recyclé — passe au micro-ondes et au four
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600">
                  <i className="ti ti-alert-circle shrink-0 mt-0.5" style={{ fontSize: 18, color: "#FF9933" }} />
                  Étiquette allergènes sur chaque barquette
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600">
                  <i className="ti ti-calendar-time shrink-0 mt-0.5" style={{ fontSize: 18, color: "#007FFF" }} />
                  DLC inscrite sur la barquette — profitez de votre plat le lendemain ou le surlendemain si besoin
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600">
                  <i className="ti ti-heart shrink-0 mt-0.5" style={{ fontSize: 18, color: "#FD3D6B" }} />
                  Vous avez adoré ? Ou pas ? Dites-le nous depuis votre espace client
                </li>
              </ul>
            </div>

            {/* Colonne 3 — CTA */}
            <div className="lg:col-span-1">
              <p className="font-semibold text-[#4D0F1F] mb-3">
                Prêt à essayer ?
              </p>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                Commandez votre premier repas Clodia et découvrez une gastronomie pensée
                pour les soignants.
              </p>
              <a
                href="/commander"
                className="bg-[#FD3D6B] hover:bg-[#e8345e] text-white text-sm font-semibold px-7 py-4 rounded-full w-full block text-center transition-colors"
              >
                Je commande mon premier repas
              </a>
              <div className="my-6 border-t border-gray-200" />
              <p className="text-xs text-gray-400 text-center">
                Sans engagement · Paiement sécurisé Stripe · Livraison avant 12h
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
