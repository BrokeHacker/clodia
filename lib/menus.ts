import { supabase } from './supabase'
import { enrichMenu, Menu } from './data'
import { ClientPoint, PointLivraison } from '@/types'

export function getSemainesDisponibles(): {
  semaineCourante: { lundi: string; vendredi: string; label: string }
  semaineSuivante: { lundi: string; vendredi: string; label: string }
  estApresJeudi: boolean
  deadlinePrecommande: Date
} {
  const now = new Date()
  const jourSemaine = now.getDay()

  const estApresJeudi = jourSemaine === 4 || jourSemaine === 5 || jourSemaine === 6 || jourSemaine === 0

  const lundiSemaineCourante = new Date(now)
  const diffLundi = (jourSemaine === 0 ? -6 : 1 - jourSemaine)
  lundiSemaineCourante.setDate(now.getDate() + diffLundi)
  lundiSemaineCourante.setHours(0, 0, 0, 0)

  function toLundi(offset: number) {
    const d = new Date(lundiSemaineCourante)
    d.setDate(lundiSemaineCourante.getDate() + offset * 7)
    return d
  }

  function toStr(d: Date) {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  function toVendredi(lundi: Date) {
    const v = new Date(lundi)
    v.setDate(lundi.getDate() + 4)
    v.setHours(23, 59, 59, 999)
    return v
  }

  function toLabelSemaine(lundi: Date) {
    return `semaine du ${lundi.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`
  }

  const offsetCourante = estApresJeudi ? 1 : 0
  const offsetSuivante = estApresJeudi ? 2 : 1

  const lundiCourante = toLundi(offsetCourante)
  const lundiSuivante = toLundi(offsetSuivante)

  // La deadline est le mercredi 23h59 de la semaine courante (S0)
  // car du lundi au mercredi on commande pour S+1
  // et du jeudi au dimanche on commande pour S+2 (deadline = mercredi S+1)
  const mercrediDeadline = new Date(lundiSemaineCourante)
  mercrediDeadline.setDate(lundiSemaineCourante.getDate() + (estApresJeudi ? 9 : 2))
  mercrediDeadline.setHours(23, 59, 0, 0)

  return {
    semaineCourante: {
      lundi: toStr(lundiCourante),
      vendredi: toStr(toVendredi(lundiCourante)),
      label: toLabelSemaine(lundiCourante),
    },
    semaineSuivante: {
      lundi: toStr(lundiSuivante),
      vendredi: toStr(toVendredi(lundiSuivante)),
      label: toLabelSemaine(lundiSuivante),
    },
    estApresJeudi,
    deadlinePrecommande: mercrediDeadline,
  }
}

export interface SlotUnite {
  id: string
  date_livraison: string
  variante: string
  total: number
  reserves: number
  confirmes: number
}

export function getDisponible(slot: SlotUnite): number {
  return Math.max(0, slot.total - slot.reserves - slot.confirmes)
}

export async function fetchSlotsUnite(dates: string[]): Promise<SlotUnite[]> {
  if (dates.length === 0) return []
  const { data, error } = await supabase
    .from('slots_unite')
    .select('id, date_livraison, variante, total, reserves, confirmes')
    .in('date_livraison', dates)
  if (error) { return [] }
  return data ?? []
}

export interface PointLivraisonDB {
  id: string
  hopital: string
  batiment: string
  service: string
  service_desc: string
}

export async function fetchPointsLivraison(): Promise<PointLivraisonDB[]> {
  const { data, error } = await supabase
    .from('points_livraison')
    .select('id, hopital, batiment, service, service_desc')
    .eq('hopital', 'CHU Limoges')
    .order('batiment', { ascending: true })
    .order('service', { ascending: true })
  if (error) { return [] }
  return data ?? []
}

export async function fetchPointLivraisonDefaut(clientId: string, supabaseClient = supabase): Promise<PointLivraison | null> {
  const { data } = await supabaseClient
    .from('client_points_livraison')
    .select('id, est_defaut, points_livraison(id, hopital, batiment, service, service_desc)')
    .eq('client_id', clientId)
    .eq('est_defaut', true)
    .single()

  return (data?.points_livraison
    ? Array.isArray(data.points_livraison)
      ? data.points_livraison[0]
      : data.points_livraison
    : null) as PointLivraison | null
}

interface ClientPointRaw {
  id: string
  est_defaut: boolean
  points_livraison: PointLivraison | PointLivraison[]
}

export async function fetchPointsLivraisonClient(clientId: string, supabaseClient = supabase): Promise<ClientPoint[]> {
  const { data } = await supabaseClient
    .from('client_points_livraison')
    .select('id, est_defaut, points_livraison(id, hopital, batiment, service, service_desc)')
    .eq('client_id', clientId)
    .order('est_defaut', { ascending: false })

  return (data ?? []).map((item: ClientPointRaw) => ({
    id: item.id,
    est_defaut: item.est_defaut,
    points_livraison: Array.isArray(item.points_livraison)
      ? item.points_livraison[0]
      : item.points_livraison,
  })) as ClientPoint[]
}

export interface Tarif {
  id: string
  type: string
  repas_de: number
  repas_a: number
  prix_unitaire: number
}

export async function fetchTarifs(): Promise<Tarif[]> {
  const { data, error } = await supabase
    .from('tarifs')
    .select('id, type, repas_de, repas_a, prix_unitaire')
    .order('type')
    .order('repas_de', { ascending: true })
  if (error) { return [] }
  return (data ?? []) as Tarif[]
}

export function getTarifUnitaire(tarifs: Tarif[]): number {
  const t = tarifs.find(t => t.type === 'unite')
  if (!t) {
    return 0
  }
  return t.prix_unitaire
}

export function getTarifPrecommande(tarifs: Tarif[], quantite: number): number {
  const paliers = tarifs
    .filter(t => t.type === 'pre-commande')
    .sort((a, b) => a.repas_de - b.repas_de)

  if (quantite === 0) {
    if (!paliers[0]) { return 0 }
    return paliers[0].prix_unitaire
  }
  const palier = paliers.findLast(t => quantite >= t.repas_de)
  if (!palier) { return 0 }
  return palier.prix_unitaire
}

function getSemaineISO(date: Date): { semaine: number; annee: number } {
  const tmp = new Date(date)
  tmp.setHours(0, 0, 0, 0)
  tmp.setDate(tmp.getDate() + 3 - ((tmp.getDay() + 6) % 7))
  const semaine1 = new Date(tmp.getFullYear(), 0, 4)
  return {
    annee: tmp.getFullYear(),
    semaine: 1 + Math.round(((tmp.getTime() - semaine1.getTime()) / 86400000 - 3 + ((semaine1.getDay() + 6) % 7)) / 7),
  }
}

export async function fetchMenusSemaineCourante(): Promise<Menu[]> {
  const { semaineCourante } = getSemainesDisponibles()
  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const { data, error } = await supabase
    .from('menus')
    .select('id, date_livraison, semaine, annee, plat, plat_vege, dessert, publie, photo')
    .eq('publie', true)
    .gt('date_livraison', today)
    .lte('date_livraison', semaineCourante.vendredi)
    .order('date_livraison', { ascending: true })
  if (error) { return [] }
  return (data ?? []).map(enrichMenu)
}

export async function fetchMenusSemaineSuivante(): Promise<Menu[]> {
  const { semaineSuivante } = getSemainesDisponibles()
  const { data, error } = await supabase
    .from('menus')
    .select('id, date_livraison, semaine, annee, plat, plat_vege, dessert, publie, photo')
    .eq('publie', true)
    .gte('date_livraison', semaineSuivante.lundi)
    .lte('date_livraison', semaineSuivante.vendredi)
    .order('date_livraison', { ascending: true })
  if (error) { return [] }
  return (data ?? []).map(enrichMenu)
}

export async function fetchMenusCarrousel(): Promise<Menu[]> {
  const aujourd = new Date()
  const todayStr = [
    aujourd.getFullYear(),
    String(aujourd.getMonth() + 1).padStart(2, '0'),
    String(aujourd.getDate()).padStart(2, '0'),
  ].join('-')
  aujourd.setHours(0, 0, 0, 0)


  const nextWeek = new Date(aujourd)
  nextWeek.setDate(aujourd.getDate() + 7)

  const { semaine: semaineCourante, annee: anneeCourante } = getSemaineISO(aujourd)
  const { semaine: semaineSuivante, annee: anneeSuivante } = getSemaineISO(nextWeek)

  const { data, error } = await supabase
    .from('menus')
    .select('id, date_livraison, semaine, annee, plat, plat_vege, dessert, publie, photo')
    .eq('publie', true)
    .in('semaine', [semaineCourante, semaineSuivante])
    .order('date_livraison', { ascending: true })

  if (error) { return [] }

  const filtered = (data ?? []).filter(m => {
    const anneeOk =
      (m.semaine === semaineCourante && m.annee === anneeCourante) ||
      (m.semaine === semaineSuivante && m.annee === anneeSuivante)
    return anneeOk && m.date_livraison > todayStr
  })

  return filtered.map(enrichMenu)
}
