export interface Menu {
  id: string
  date_livraison: string
  semaine: number
  annee: number
  plat: string
  plat_vege: string
  dessert: string
  publie: boolean
  photo: string
  jourSemaine: string
  date: string
  prix: number
}

export function enrichMenu(m: Omit<Menu, 'jourSemaine' | 'date' | 'prix'>): Menu {
  const d = new Date(m.date_livraison)
  const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  return {
    ...m,
    jourSemaine: jours[d.getDay()],
    date: d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }),
    prix: 0, // le prix réel est chargé dynamiquement depuis Supabase
  }
}

export interface FAQItem {
  id: number;
  question: string;
  reponse: string;
}

export interface Etape {
  titre: string;
  description: string;
  icone: string;
}

export const faqItems: FAQItem[] = [
  {
    id: 1,
    question: "Comment passer ma première commande ?",
    reponse:
      "C'est très simple ! Rendez-vous sur la page Commander, choisissez votre menu, sélectionnez votre variante (plat traditionnel ou végétarienne) et votre point de livraison. Réglez en ligne par carte bancaire via notre système sécurisé Stripe. Vous recevrez immédiatement une confirmation par email.",
  },
  {
    id: 2,
    question: "Jusqu'à quelle heure puis-je commander ?",
    reponse:
      "Les commandes pour le lendemain sont acceptées jusqu'à 22h le soir précédent. Pour les commandes de la semaine complète (formule Semaine ou Prestige), la date limite est le dimanche soir à 22h. Au-delà, vous pouvez toujours commander à l'unité pour les jours disponibles.",
  },
  {
    id: 3,
    question: "Où puis-je récupérer mon repas ?",
    reponse:
      "Nous livrons actuellement dans 4 établissements de santé à Limoges : le CHU Dupuytren, l'Hôpital de la Mère et de l'Enfant, la Clinique Chénieux et la Polyclinique de Limoges. Les livraisons sont effectuées avant 12h chaque jour. Vous souhaitez un nouveau point ? Contactez-nous via le formulaire dédié.",
  },
  {
    id: 4,
    question: "Les repas sont-ils vraiment gastronomiques ?",
    reponse:
      "Absolument ! Nos menus sont élaborés par un chef récompensé au Guide Gault & Millau, avec des produits frais, locaux et de saison. Chaque plat est préparé le matin même dans notre cuisine professionnelle, conditionné en emballage isotherme et livré avant midi pour garantir une dégustation optimale.",
  },
  {
    id: 5,
    question: "Y a-t-il toujours une option végétarienne ?",
    reponse:
      "Oui, chaque jour nous proposons une alternative végétarienne élaborée avec le même soin et la même exigence que le plat principal. Elle est disponible au même prix. Nous travaillons également à proposer des options sans gluten selon la demande.",
  },
  {
    id: 6,
    question: "Comment fonctionne la livraison ?",
    reponse:
      "Vos repas sont livrés dans un emballage isotherme 100% compostable avant 12h à votre point de livraison. Notre équipe effectue toutes les livraisons en véhicule électrique pour limiter notre impact environnemental. En cas d'imprévu, vous êtes prévenu par SMS.",
  },
  {
    id: 7,
    question: "Puis-je annuler ou modifier ma commande ?",
    reponse:
      "Vous pouvez annuler ou modifier votre commande jusqu'à 22h la veille de la livraison. Au-delà, la commande est transmise à la cuisine et ne peut plus être modifiée. Pour toute demande d'annulation, contactez-nous par email à contact@clodia.fr.",
  },
  {
    id: 8,
    question: "Comment le paiement est-il sécurisé ?",
    reponse:
      "Tous les paiements sont traités par Stripe, leader mondial du paiement en ligne. Vos données bancaires ne transitent jamais par nos serveurs. Nous acceptons toutes les cartes Visa, Mastercard et American Express.",
  },
];

export const etapes: Etape[] = [
  {
    titre: "Je choisis mon menu",
    description:
      "Commandez jusqu'à la veille à minuit pour la semaine en cours, ou bénéficiez de tarifs préférentiels en commandant avant mercredi minuit pour la semaine suivante",
    icone: "ti-calendar",
  },
  {
    titre: "Je choisis mon frigidaire",
    description:
      "Sélectionnez votre point de livraison le plus proche de votre service et payez en ligne en toute sécurité",
    icone: "ti-map-pin",
  },
  {
    titre: "Livraison avant midi",
    description:
      "Votre repas est déposé avant midi dans le frigidaire sélectionné, prêt à être récupéré",
    icone: "ti-fridge",
  },
  {
    titre: "Prêt en 2 minutes",
    description:
      "Un passage au micro-ondes et votre repas est prêt à déguster",
    icone: "ti-microwave",
  },
];
