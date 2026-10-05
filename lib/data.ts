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
  lien?: { label: string; href: string };
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
      "Rendez-vous sur la page Commander, choisissez vos repas dans le menu de la semaine (plat ou version végétarienne, dessert inclus), sélectionnez le point de livraison de votre service puis réglez en ligne par carte bancaire. Votre commande est confirmée dès que le paiement est validé. Vous pouvez commander sans créer de compte ; un compte vous permet toutefois de retrouver vos commandes, de modifier vos pré-commandes et de faire vos demandes plus simplement.",
  },
  {
    id: 2,
    question: "Jusqu'à quand puis-je commander ?",
    reponse:
      "Il y a deux façons de commander. La pré-commande de la semaine suivante est ouverte jusqu'au mercredi 23h59 de la semaine précédente, à un tarif préférentiel. La commande à l'unité concerne les jours restants de la semaine en cours : elle est possible jusqu'à la veille de la livraison à 23h59, dans la limite des repas disponibles chaque jour.",
  },
  {
    id: 3,
    question: "Où puis-je récupérer mon repas ?",
    reponse:
      "Nous livrons actuellement au CHU de Limoges, dans les frigos mis à disposition dans les services : vous choisissez votre bâtiment et votre service au moment de la commande. Votre établissement n'est pas encore desservi ? Dites-le-nous, cela nous aide à choisir nos prochaines ouvertures.",
    lien: { label: "Demander un nouveau point de livraison", href: "/nous-contacter?sujet=nouveau_point" },
  },
  {
    id: 4,
    question: "Que contient un menu ?",
    reponse:
      "Chaque jour, un nouveau menu complet : un plat et un dessert. Il est cuisiné par un chef traiteur à partir de produits frais, puis conditionné et livré avant midi pour que vous puissiez le réchauffer en deux minutes à votre pause.",
  },
  {
    id: 5,
    question: "Y a-t-il toujours une option végétarienne ?",
    reponse:
      "Oui, chaque jour une version végétarienne du plat est proposée, au même prix. Vous avez une allergie ou une contrainte alimentaire particulière ? Écrivez-nous avant de commander pour que nous puissions vous répondre précisément.",
    lien: { label: "Nous contacter", href: "/nous-contacter" },
  },
  {
    id: 6,
    question: "Comment fonctionne la livraison ?",
    reponse:
      "Vos repas sont livrés avant 12h dans le frigo du service que vous avez choisi : il vous suffit de venir les récupérer à votre pause. En cas de problème avec votre livraison (repas manquant, frigo introuvable…), faites-le-nous savoir le jour même.",
    lien: { label: "Signaler un problème de livraison", href: "/nous-contacter" },
  },
  {
    id: 7,
    question: "Puis-je annuler ou modifier ma commande ?",
    reponse:
      "Oui. Le plus simple est de passer par votre espace client : dans « Commandes en cours », utilisez le bouton « Modifier ou annuler » pour demander une annulation ou une modification (par exemple passer d'un plat standard à un plat végétarien). Une commande dont la livraison est prévue aujourd'hui n'est plus modifiable. Votre demande est alors rattachée à la bonne commande et traitée plus vite. Vous avez commandé sans compte ? Utilisez la page Nous contacter en indiquant votre nom, votre email, votre téléphone et, si possible, votre numéro de commande. Dans tous les cas, écrivez-nous le plus tôt possible : une commande déjà préparée ne peut plus être annulée. Si l'annulation est acceptée, le remboursement est effectué sur la carte utilisée pour le paiement.",
    lien: { label: "Nous contacter", href: "/nous-contacter" },
  },
  {
    id: 8,
    question: "Comment le paiement est-il sécurisé ?",
    reponse:
      "Tous les paiements sont traités par Stripe, leader mondial du paiement en ligne. Vos données bancaires ne transitent jamais par nos serveurs. Nous acceptons les cartes Visa, Mastercard et American Express.",
  },
  {
    id: 9,
    question: "Dois-je créer un compte pour commander ?",
    reponse:
      "Non, vous pouvez commander sans compte en renseignant simplement votre nom, votre email et votre téléphone. Avec un compte, vous retrouvez vos commandes et votre point de livraison habituel, vous modifiez vos pré-commandes en ligne et vous nous adressez vos demandes (modification, annulation, problème de livraison) directement depuis chaque commande.",
  },
  {
    id: 10,
    question: "Un problème avec mon repas ou ma livraison ?",
    reponse:
      "Écrivez-nous : si vous avez un compte, depuis votre espace client (bouton « Faire une demande » sur la commande concernée) ; sinon avec la page Nous contacter. Précisez le jour de livraison concerné et ce qui s'est passé, nous revenons vers vous rapidement.",
    lien: { label: "Nous contacter", href: "/nous-contacter" },
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
