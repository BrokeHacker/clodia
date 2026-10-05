import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Clodia",
};

const th = "text-left font-semibold text-[#4D0F1F] py-2 pr-4 border-b border-gray-200";
const td = "py-2 pr-4 border-b border-gray-100 align-top";
const h2 = "text-lg font-semibold text-[#4D0F1F] mb-4";

export default function ConfidentialitePage() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-semibold text-[#4D0F1F] mb-2">Politique de confidentialité</h1>
        <p className="text-gray-400 text-sm mb-6">Dernière mise à jour : septembre 2026</p>
        <p className="text-sm text-gray-600 leading-relaxed mb-16">
          Clodia collecte uniquement les données nécessaires pour prendre, payer et livrer vos
          repas, et ne les vend jamais. Cette politique s&apos;applique au site clodia.fr et au
          service de commande par WhatsApp.
        </p>

        <div className="flex flex-col gap-12 text-sm text-gray-600 leading-relaxed">
          <div>
            <h2 className={h2}>1. Qui est responsable de vos données ?</h2>
            <ul className="flex flex-col gap-1">
              <li><strong>Responsable de traitement :</strong> Clodia SAS, capital de 10 000 €, RCS Limoges 987 654 321</li>
              <li><strong>Siège :</strong> 12 rue des Soignants, 87000 Limoges</li>
              <li><strong>Contact données personnelles :</strong> privacy@clodia.fr</li>
            </ul>
          </div>

          <div>
            <h2 className={h2}>2. Quelles données collectons-nous ?</h2>
            <ul className="flex flex-col gap-2 list-disc pl-5">
              <li><strong>Identité et contact :</strong> prénom, nom, adresse e-mail, numéro de téléphone.</li>
              <li><strong>Compte :</strong> mot de passe, conservé uniquement sous forme chiffrée, jamais lisible par Clodia.</li>
              <li><strong>Commandes :</strong> menus commandés, quantités, montants, point et date de livraison, formules et programmations, notes données aux repas.</li>
              <li><strong>Demandes au service client :</strong> nom, adresse e-mail, téléphone (facultatif), numéro de commande et message saisis dans le formulaire « Nous contacter » ou depuis une commande, ainsi qu&apos;une empreinte non réversible de l&apos;adresse IP, utilisée uniquement pour limiter les envois abusifs.</li>
              <li><strong>Conversations WhatsApp</strong> avec notre assistant de commande, hors données d&apos;inscription et liens de paiement, qui ne sont pas enregistrés.</li>
              <li><strong>Paiement :</strong> géré par Stripe. Clodia ne voit ni ne conserve votre numéro de carte.</li>
            </ul>
            <p className="mt-3">
              Nous ne demandons aucune donnée de santé et ne déduisons aucune information sur votre
              situation professionnelle ou personnelle au-delà du lieu de livraison choisi.
            </p>
          </div>

          <div>
            <h2 className={h2}>3. Pourquoi et sur quelle base légale ?</h2>
            <table className="w-full">
              <thead><tr><th className={th}>Finalité</th><th className={th}>Base légale</th></tr></thead>
              <tbody>
                <tr><td className={td}>Créer et gérer votre compte, prendre et livrer vos commandes</td><td className={td}>Exécution du contrat</td></tr>
                <tr><td className={td}>Encaisser le paiement, gérer les remboursements</td><td className={td}>Exécution du contrat</td></tr>
                <tr><td className={td}>Lier votre fiche WhatsApp à votre compte du site (lien à usage unique)</td><td className={td}>Exécution du contrat</td></tr>
                <tr><td className={td}>Assistance et traitement des réclamations</td><td className={td}>Intérêt légitime</td></tr>
                <tr><td className={td}>Sécurité et prévention des abus</td><td className={td}>Intérêt légitime</td></tr>
                <tr><td className={td}>Conservation des pièces comptables</td><td className={td}>Obligation légale</td></tr>
              </tbody>
            </table>
          </div>

          <div>
            <h2 className={h2}>4. Qui reçoit vos données ?</h2>
            <p>
              Vos données ne sont accessibles qu&apos;à l&apos;équipe Clodia habilitée et à nos
              prestataires (sous-traitants), liés par contrat :
            </p>
            <ul className="mt-3 flex flex-col gap-1 list-disc pl-5">
              <li><strong>Supabase</strong> : base de données et authentification.</li>
              <li><strong>Vercel</strong> : hébergement du site.</li>
              <li><strong>Railway</strong> : hébergement de l&apos;assistant WhatsApp.</li>
              <li><strong>Meta (WhatsApp Business)</strong> : transport des messages WhatsApp.</li>
              <li><strong>Stripe</strong> : paiement sécurisé.</li>
              <li><strong>Nos partenaires de production</strong> : reçoivent uniquement les quantités à préparer, sans données personnelles.</li>
            </ul>
            <p className="mt-3">Vos données sont hébergées dans l&apos;Union européenne.</p>
          </div>

          <div>
            <h2 className={h2}>5. Combien de temps conservons-nous vos données ?</h2>
            <table className="w-full">
              <thead><tr><th className={th}>Donnée</th><th className={th}>Durée</th></tr></thead>
              <tbody>
                <tr><td className={td}>Compte et fiche client</td><td className={td}>Jusqu&apos;à la suppression du compte</td></tr>
                <tr><td className={td}>Conversations WhatsApp</td><td className={td}>90 jours, puis suppression automatique</td></tr>
                <tr><td className={td}>Liens d&apos;inscription WhatsApp</td><td className={td}>30 minutes de validité, effacés 7 jours après expiration</td></tr>
                <tr><td className={td}>Commandes et données de facturation</td><td className={td}>10 ans (obligation comptable), sans lien avec votre identité après suppression du compte</td></tr>
                <tr><td className={td}>Données de paiement chez Stripe</td><td className={td}>Selon la politique de Stripe</td></tr>
              </tbody>
            </table>
          </div>

          <div>
            <h2 className={h2}>6. Vos droits</h2>
            <p>
              Vous pouvez demander l&apos;accès à vos données, leur rectification, leur effacement,
              la limitation ou l&apos;opposition au traitement, et leur portabilité.
            </p>
            <ul className="mt-3 flex flex-col gap-2 list-disc pl-5">
              <li>
                <strong>Suppression immédiate :</strong> depuis Mon espace, Mon profil, Supprimer mon
                compte. Votre fiche est anonymisée et vos conversations sont supprimées. La
                suppression est refusée s&apos;il reste une commande à venir ou un paiement en cours.
              </li>
              <li><strong>Autres demandes :</strong> privacy@clodia.fr. Réponse sous un mois.</li>
              <li><strong>Réclamation :</strong> auprès de la CNIL, www.cnil.fr.</li>
            </ul>
          </div>

          <div>
            <h2 className={h2}>7. Sécurité</h2>
            <p>
              Les données sont protégées par un contrôle d&apos;accès strict (chaque client ne voit
              que ses propres données), un chiffrement des échanges (HTTPS), la signature des messages
              entrants (WhatsApp, Stripe), la limitation des tentatives de connexion et la
              confirmation de l&apos;adresse e-mail.
            </p>
          </div>

          <div>
            <h2 className={h2}>8. Cookies</h2>
            <p>
              Le site utilise uniquement des cookies strictement nécessaires à son fonctionnement
              (session de connexion). Aucun cookie publicitaire ni outil de mesure d&apos;audience
              n&apos;est utilisé à ce jour.
            </p>
          </div>

          <div>
            <h2 className={h2}>9. Modifications</h2>
            <p>
              En cas de changement important, nous vous en informerons par e-mail ou sur le site.
              Voir aussi nos <Link href="/mentions-legales" className="underline text-[#4D0F1F]">mentions légales</Link>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
