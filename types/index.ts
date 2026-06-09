export interface PointLivraison {
  id: string
  hopital: string
  batiment: string
  service: string
  service_desc: string
}

export interface ClientPoint {
  id: string
  est_defaut: boolean
  points_livraison: PointLivraison
}

export interface Client {
  id: string
  prenom: string
  nom: string
  email: string
  telephone: string
  user_id: string
}

export interface Commande {
  id: string
  menu_id: string
  client_id: string
  variante: 'standard' | 'vegetarien'
  quantite: number
  prix_unitaire: number
  prix_total: number
  statut: 'en_attente' | 'confirme' | 'annule'
  type: 'pre-commande' | 'unite'
  point_livraison: string | null
  stripe_checkout_url: string | null
  stripe_expires_at: string | null
  created_at: string
  menus?: MenuCommande
}

export interface MenuCommande {
  date_livraison: string
  plat: string
  plat_vege: string
  dessert: string
  photo: string
}

export interface Rating {
  commande_id: string
  note: number
  updated_at?: string
}

export interface Programmation {
  id: string
  client_id: string
  jours: string[]
  variante: 'standard' | 'vegetarien' | 'alternance'
  actif: boolean
  created_at: string
  updated_at: string
}
