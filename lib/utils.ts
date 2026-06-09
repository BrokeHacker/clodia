export function normaliserTelephone(tel: string): string {
  const cleaned = tel.replace(/\s/g, '').replace(/-/g, '')
  if (cleaned.startsWith('0')) return '+33' + cleaned.slice(1)
  if (cleaned.startsWith('+33')) return cleaned
  return cleaned
}

export function formatPrice(p: number): string {
  return p.toFixed(2).replace('.', ',') + ' €'
}

export const REGEX_TELEPHONE = /^\+33[1-9]\d{8}$/

export function displayTelephone(tel: string): string {
  if (!tel) return ''
  const cleaned = tel.replace(/\s/g, '')

  // Format +33XXXXXXXXX → +33 6 77 83 76 86
  if (cleaned.startsWith('+33') && cleaned.length === 12) {
    const first = cleaned[3]
    const rest = cleaned.slice(4)
    const groups = rest.match(/.{1,2}/g) ?? []
    return `+33 ${first} ${groups.join(' ')}`
  }

  // Format 0XXXXXXXXX → 06 77 83 76 86
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')
  }

  return tel
}

export function formatTelephone(val: string): string {
  const cleaned = val.replace(/[^\d+]/g, '')

  // Format +33XXXXXXXXX → +33 6 77 83 76 86
  if (cleaned.startsWith('+33')) {
    const digits = cleaned.slice(3)
    if (!digits) return '+33'
    const first = digits[0]
    const rest = digits.slice(1)
    const groups = rest.match(/.{1,2}/g) ?? []
    return '+33 ' + first + (groups.length ? ' ' + groups.join(' ') : '')
  }

  // Format 0XXXXXXXXX → 06 77 83 76 86
  if (cleaned.startsWith('0')) {
    const all = cleaned.slice(0, 10) // limiter à 10 chiffres
    const groups = all.match(/.{1,2}/g) ?? []
    return groups.join(' ')
  }

  return cleaned
}
