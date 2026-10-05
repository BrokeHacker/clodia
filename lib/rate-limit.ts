// Limitation de débit "au mieux" : compteurs en mémoire d'UNE instance serverless.
// Utile contre un usage abusif simple, mais à doubler d'une règle de limitation de débit
// du pare-feu Vercel sur les routes sensibles.
const compteurs = new Map<string, { n: number; debut: number }>()

export function limiteAtteinte(cle: string, max: number, fenetreMs: number): boolean {
  const now = Date.now()
  if (compteurs.size > 5000) compteurs.clear()
  const c = compteurs.get(cle)
  if (!c || now - c.debut > fenetreMs) {
    compteurs.set(cle, { n: 1, debut: now })
    return false
  }
  c.n += 1
  return c.n > max
}

export function ipDe(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'inconnu'
}
