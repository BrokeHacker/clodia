export interface Menu {
  id: number;
  date: string;
  date_livraison?: string;
  jourSemaine: string;
  plat: string;
  platVege: string;
  dessert: string;
  prix: number;
  photo: string;
  semaine: "courante" | "suivante";
}

export interface PointLivraison {
  id: number;
  hopital: string;
  batiment: string;
  service: string;
  emoji: string;
}

export interface Formule {
  id: number;
  nom: string;
  tagline: string;
  prix: number;
  unite: string;
  avantages: string[];
  couleur: string;
  couleurBadge: string;
  highlight: boolean;
}

export interface FAQItem {
  id: number;
  question: string;
  reponse: string;
}

export interface Engagement {
  id: number;
  titre: string;
  description: string;
  icone: string;
  couleur: string;
}

export interface Etape {
  numero: number;
  titre: string;
  description: string;
  icone: string;
}

export const menusCurrentWeek: Menu[] = [
  {
    id: 1,
    date: "26 mai",
    date_livraison: "2026-05-25",
    jourSemaine: "Lundi",
    plat: "Filet de bœuf Rossini, sauce périgourdine & légumes confits",
    platVege: "Risotto aux cèpes et parmesan 24 mois d'affinage",
    dessert: "Mille-feuille vanille bourbon maison",
    prix: 17.5,
    photo:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop&auto=format",
    semaine: "courante",
  },
  {
    id: 2,
    date: "27 mai",
    date_livraison: "2026-05-26",
    jourSemaine: "Mardi",
    plat: "Suprême de volaille fermière, jus aux herbes fraîches",
    platVege: "Quiche aux légumes printaniers du marché",
    dessert: "Tarte Tatin aux pommes caramélisées",
    prix: 16.5,
    photo:
      "https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&h=400&fit=crop&auto=format",
    semaine: "courante",
  },
  {
    id: 3,
    date: "28 mai",
    date_livraison: "2026-05-27",
    jourSemaine: "Mercredi",
    plat: "Pavé de saumon label rouge, beurre blanc aux agrumes",
    platVege: "Gratin dauphinois aux champignons et crème fraîche",
    dessert: "Panna cotta fruits rouges, coulis framboise",
    prix: 17.0,
    photo:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop&auto=format",
    semaine: "courante",
  },
  {
    id: 4,
    date: "29 mai",
    date_livraison: "2026-05-28",
    jourSemaine: "Jeudi",
    plat: "Magret de canard du Périgord, sauce cerise et poivre",
    platVege: "Tartine de légumes rôtis, chèvre frais et feta",
    dessert: "Crème brûlée à la lavande de Provence",
    prix: 18.0,
    photo:
      "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=600&h=400&fit=crop&auto=format",
    semaine: "courante",
  },
  {
    id: 5,
    date: "30 mai",
    date_livraison: "2026-05-29",
    jourSemaine: "Vendredi",
    plat: "Côte de veau fermière, purée maison et jus corsé",
    platVege: "Curry de légumes de saison au lait de coco",
    dessert: "Charlotte aux framboises et coulis de mangue",
    prix: 17.5,
    photo:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop&auto=format",
    semaine: "courante",
  },
];

export const menusNextWeek: Menu[] = [
  {
    id: 6,
    date: "2 juin",
    jourSemaine: "Lundi",
    plat: "Tartare de bœuf façon chef, frites maison dorées",
    platVege: "Velouté de courge butternut, crème et noix de cajou",
    dessert: "Éclair au chocolat noir Valrhona",
    prix: 17.0,
    photo:
      "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=600&h=400&fit=crop&auto=format",
    semaine: "suivante",
  },
  {
    id: 7,
    date: "3 juin",
    jourSemaine: "Mardi",
    plat: "Pintade rôtie au four, sauce au vin jaune du Jura",
    platVege: "Ravioles épinards-ricotta, beurre noisette et sauge",
    dessert: "Île flottante et caramel beurre salé breton",
    prix: 16.5,
    photo:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop&auto=format",
    semaine: "suivante",
  },
  {
    id: 8,
    date: "4 juin",
    jourSemaine: "Mercredi",
    plat: "Lieu noir sauvage, sauce vierge et légumes croquants",
    platVege: "Pizza à la burrata di bufala et légumes grillés",
    dessert: "Tarte au citron meringuée façon grand-mère",
    prix: 17.0,
    photo:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&auto=format",
    semaine: "suivante",
  },
  {
    id: 9,
    date: "5 juin",
    jourSemaine: "Jeudi",
    plat: "Joue de bœuf braisée 7h, carottes fondantes au thym",
    platVege: "Gnocchis à la romaine gratinés, sauce gorgonzola",
    dessert: "Soufflé chaud au Grand Marnier, anglaise vanille",
    prix: 18.5,
    photo:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop&auto=format",
    semaine: "suivante",
  },
  {
    id: 10,
    date: "6 juin",
    jourSemaine: "Vendredi",
    plat: "Carré d'agneau de lait, flageolets à la sarriette",
    platVege: "Bowl thaï aux légumes croquants et tempeh mariné",
    dessert: "Baba au rhum authentique et chantilly mascarpone",
    prix: 18.0,
    photo:
      "https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=600&h=400&fit=crop&auto=format",
    semaine: "suivante",
  },
];

export const pointsLivraison: PointLivraison[] = [
  {
    id: 1,
    hopital: "CHU Limoges",
    batiment: "Hôpital Dupuytren",
    service: "Hall principal — niveau 0",
    emoji: "🏥",
  },
  {
    id: 2,
    hopital: "CHU Limoges",
    batiment: "Hôpital de la Mère et de l'Enfant",
    service: "Accueil — rez-de-chaussée",
    emoji: "👶",
  },
  {
    id: 3,
    hopital: "Clinique Chénieux",
    batiment: "Bâtiment principal",
    service: "Cafétéria — niveau 1",
    emoji: "🏨",
  },
  {
    id: 4,
    hopital: "Polyclinique de Limoges",
    batiment: "Entrée principale",
    service: "Espace détente soignants",
    emoji: "💊",
  },
];

export const formules: Formule[] = [
  {
    id: 1,
    nom: "Découverte",
    tagline: "Sans engagement, testez Clodia",
    prix: 17.5,
    unite: "par repas",
    avantages: [
      "Plat du jour + dessert",
      "Option végétarienne incluse",
      "Livraison au point choisi",
      "Commande à l'unité",
      "Sans abonnement",
    ],
    couleur: "#E8F4FF",
    couleurBadge: "#007FFF",
    highlight: false,
  },
  {
    id: 2,
    nom: "Semaine",
    tagline: "Un chef à votre table chaque midi",
    prix: 15.5,
    unite: "par repas · 5 repas/semaine",
    avantages: [
      "5 repas par semaine",
      "Plat + dessert chaque jour",
      "Option végétarienne incluse",
      "Livraison prioritaire",
      "Économisez 10 € / semaine",
    ],
    couleur: "#FDD5D9",
    couleurBadge: "#FD3D6B",
    highlight: true,
  },
  {
    id: 3,
    nom: "Prestige",
    tagline: "L'expérience gastronomique complète",
    prix: 14.5,
    unite: "par repas · à partir de 10",
    avantages: [
      "10 à 20 repas par mois",
      "Plat + dessert + amuse-bouche",
      "Option végétarienne incluse",
      "Livraison prioritaire garantie",
      "Menu exclusif le vendredi",
      "Économisez jusqu'à 30 € / mois",
    ],
    couleur: "#E8FFF8",
    couleurBadge: "#00CCCC",
    highlight: false,
  },
];

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
    numero: 1,
    titre: "Choisissez votre menu",
    description:
      "Chaque semaine, notre chef compose un nouveau menu. Consultez le programme et choisissez le ou les jours qui vous conviennent, en plat traditionnel ou végétarien.",
    icone: "🍽️",
  },
  {
    numero: 2,
    titre: "Commandez en ligne",
    description:
      "Sélectionnez votre point de livraison parmi nos établissements partenaires, choisissez votre formule et payez en toute sécurité par carte bancaire avant 22h la veille.",
    icone: "📱",
  },
  {
    numero: 3,
    titre: "Savourez avant midi",
    description:
      "Le lendemain, récupérez votre repas au point de livraison avant 12h. Votre plateau gastronomique vous attend dans son emballage isotherme, prêt à être dégusté.",
    icone: "⭐",
  },
];

export const engagements: Engagement[] = [
  {
    id: 1,
    titre: "Produits frais & locaux",
    description:
      "Nous travaillons en direct avec des producteurs du Limousin et du Périgord. Fruits, légumes, viandes et produits laitiers : tout est sélectionné pour sa fraîcheur et sa qualité.",
    icone: "🌱",
    couleur: "#E8FFF8",
  },
  {
    id: 2,
    titre: "Chef récompensé Gault & Millau",
    description:
      "Nos menus sont créés et supervisés par un chef distingué au Guide Gault & Millau. Une exigence gastronomique quotidienne, même en milieu hospitalier.",
    icone: "👨‍🍳",
    couleur: "#FFF9D6",
  },
  {
    id: 3,
    titre: "Livraison 100% électrique",
    description:
      "Toutes nos livraisons sont effectuées en véhicule électrique. Parce qu'un repas gastronomique peut aussi être responsable, nous nous engageons à réduire notre empreinte carbone.",
    icone: "⚡",
    couleur: "#E8F4FF",
  },
  {
    id: 4,
    titre: "Emballages éco-responsables",
    description:
      "Nos emballages sont 100% compostables et fabriqués à partir de matériaux naturels. Le maintien en température est assuré sans plastique, conformément à nos valeurs.",
    icone: "♻️",
    couleur: "#FFEBD6",
  },
  {
    id: 5,
    titre: "Équipe locale & engagée",
    description:
      "Toute notre équipe est basée à Limoges. En choisissant Clodia, vous soutenez un projet local qui crée des emplois et valorise les talents culinaires de notre région.",
    icone: "🤝",
    couleur: "#FDD5D9",
  },
];
