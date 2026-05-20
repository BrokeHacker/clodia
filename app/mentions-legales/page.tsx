import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales — Clodia",
};

export default function MentionsLegalesPage() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-semibold text-[#4D0F1F] mb-2">Mentions légales</h1>
        <p className="text-gray-400 text-sm mb-16">Dernière mise à jour : mai 2025</p>

        <div className="flex flex-col gap-12 text-sm text-gray-600 leading-relaxed">
          <div>
            <h2 className="text-lg font-semibold text-[#4D0F1F] mb-4">1. Éditeur du site</h2>
            <p>
              Le site clodia.fr est édité par la société <strong>Clodia SAS</strong>, société par
              actions simplifiée au capital de 10 000 €, immatriculée au Registre du Commerce et
              des Sociétés de Limoges sous le numéro RCS 987 654 321.
            </p>
            <ul className="mt-3 flex flex-col gap-1">
              <li><strong>Siège social :</strong> 12 rue des Soignants, 87000 Limoges</li>
              <li><strong>Email :</strong> contact@clodia.fr</li>
              <li><strong>Téléphone :</strong> +33 (0)5 55 00 00 00</li>
              <li><strong>Directeur de la publication :</strong> Jean Dupont, Président</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#4D0F1F] mb-4">2. Hébergeur</h2>
            <p>
              Ce site est hébergé par <strong>Vercel Inc.</strong>, 340 Pine Street, Suite 900,
              San Francisco, CA 94104, États-Unis. Site web : vercel.com.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#4D0F1F] mb-4">
              3. Propriété intellectuelle
            </h2>
            <p>
              L&apos;ensemble des contenus présents sur ce site (textes, images, logos, icônes,
              graphismes) est la propriété exclusive de Clodia SAS ou fait l&apos;objet d&apos;une
              autorisation d&apos;utilisation. Toute reproduction, représentation, modification ou
              exploitation, totale ou partielle, du contenu de ce site sans autorisation expresse
              est interdite et constituerait une contrefaçon.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#4D0F1F] mb-4">
              4. Protection des données personnelles
            </h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi
              Informatique et Libertés, vous disposez d&apos;un droit d&apos;accès, de rectification,
              d&apos;effacement et de portabilité de vos données personnelles.
            </p>
            <p className="mt-3">
              Pour exercer ces droits ou pour toute question relative à la protection de vos données,
              vous pouvez contacter notre délégué à la protection des données à l&apos;adresse :
              dpo@clodia.fr.
            </p>
            <p className="mt-3">
              Les données collectées lors d&apos;une commande (nom, prénom, email, données de
              paiement) sont utilisées exclusivement pour le traitement et la livraison de vos commandes.
              Les données de paiement sont traitées par Stripe et ne transitent jamais par nos serveurs.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#4D0F1F] mb-4">5. Cookies</h2>
            <p>
              Ce site utilise des cookies fonctionnels strictement nécessaires à son fonctionnement.
              Aucun cookie publicitaire ou de tracking n&apos;est déposé sans votre consentement. Vous
              pouvez configurer votre navigateur pour désactiver les cookies, mais certaines
              fonctionnalités du site pourraient ne plus être disponibles.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#4D0F1F] mb-4">
              6. Limitation de responsabilité
            </h2>
            <p>
              Clodia SAS s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour des informations
              diffusées sur ce site. Toutefois, elle ne peut garantir l&apos;exactitude, la complétude
              ou l&apos;actualité des informations. En conséquence, Clodia SAS décline toute
              responsabilité pour les éventuelles inexactitudes, erreurs ou omissions.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#4D0F1F] mb-4">7. Droit applicable</h2>
            <p>
              Les présentes mentions légales sont soumises au droit français. En cas de litige,
              les tribunaux français seront seuls compétents.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
