export interface Client {
  id: string
  telephone: string
  prenom: string
  nom: string
  email: string | null
  point_livraison: string | null
  created_at: string
}

export interface Menu {
  id: string
  date_livraison: string
  semaine: number
  annee: number
  plat: string
  plat_vege: string
  dessert: string
  publie: boolean
  photo: string | null
  created_at: string
}

export interface Commande {
  id: string
  ref_commande: string
  client_id: string
  menu_id: string | null
  type: string
  variante: string
  quantite: number
  prix_unitaire: number
  prix_total: number
  statut: string
  stripe_id: string | null
  reserve_jusqua: string | null
  created_at: string
  point_livraison: string | null
}

export interface PointLivraison {
  id: string
  hopital: string
  batiment: string | null
  service: string
  service_desc: string | null
  created_at: string
}

export interface SlotUnite {
  id: string
  date_livraison: string
  variante: string
  total: number
  reserves: number
  confirmes: number
}

export interface Tarif {
  id: string
  type: string
  repas_de: number
  repas_a: number
  prix_unitaire: number
}

export interface Config {
  id: string
  cle: string
  valeur: string
  description: string | null
}

export interface Log {
  id: string
  telephone: string
  role: string
  message: string
  created_at: string
}

export interface CommandeAvecMenu extends Commande {
  menus: Menu | null
}

export interface ClientAvecCommandes extends Client {
  commandes: Commande[]
  points_livraison: PointLivraison | null
}
