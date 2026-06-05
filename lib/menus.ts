import { supabase } from './supabase'
import { enrichMenu, Menu } from './data'

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

  const mercrediDeadline = toLundi(1)
  mercrediDeadline.setDate(mercrediDeadline.getDate() + 2)
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
    .select('*')
    .in('date_livraison', dates)
  if (error) { console.error(error); return [] }
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
    .select('*')
    .eq('hopital', 'CHU Limoges')
    .order('batiment', { ascending: true })
    .order('service', { ascending: true })
  if (error) { console.error(error); return [] }
  return data ?? []
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
    .select('*')
    .order('type')
    .order('repas_de', { ascending: true })
  if (error) { console.error(error); return [] }
  return (data ?? []) as Tarif[]
}

export function getTarifUnitaire(tarifs: Tarif[]): number {
  const t = tarifs.find(t => t.type === 'unite')
  if (!t) {
    if (tarifs.length > 0) {
      console.warn('getTarifUnitaire : aucun tarif "unite" trouvé dans Supabase')
    }
    return 0
  }
  return t.prix_unitaire
}

export function getTarifPrecommande(tarifs: Tarif[], quantite: number): number {
  const paliers = tarifs
    .filter(t => t.type === 'pre-commande')
    .sort((a, b) => a.repas_de - b.repas_de)

  if (quantite === 0) {
    if (!paliers[0]) {
      console.warn('getTarifPrecommande : aucun palier pré-commande trouvé dans Supabase')
      return 0
    }
    return paliers[0].prix_unitaire
  }
  const palier = paliers.findLast(t => quantite >= t.repas_de)
  if (!palier) {
    console.warn('getTarifPrecommande : aucun palier trouvé pour quantité', quantite)
    return 0
  }
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
  const { data, error } = await supabase
    .from('menus')
    .select('*')
    .eq('publie', true)
    .gte('date_livraison', semaineCourante.lundi)
    .lte('date_livraison', semaineCourante.vendredi)
    .order('date_livraison', { ascending: true })
  if (error) { console.error(error); return [] }
  return (data ?? []).map(enrichMenu)
}

export async function fetchMenusSemaineSuivante(): Promise<Menu[]> {
  const { semaineSuivante } = getSemainesDisponibles()
  const { data, error } = await supabase
    .from('menus')
    .select('*')
    .eq('publie', true)
    .gte('date_livraison', semaineSuivante.lundi)
    .lte('date_livraison', semaineSuivante.vendredi)
    .order('date_livraison', { ascending: true })
  if (error) { console.error(error); return [] }
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
    .select('*')
    .eq('publie', true)
    .in('semaine', [semaineCourante, semaineSuivante])
    .order('date_livraison', { ascending: true })

  if (error) { console.error(error); return [] }

  const filtered = (data ?? []).filter(m => {
    const anneeOk =
      (m.semaine === semaineCourante && m.annee === anneeCourante) ||
      (m.semaine === semaineSuivante && m.annee === anneeSuivante)
    return anneeOk && m.date_livraison > todayStr
  })

  return filtered.map(enrichMenu)
}
