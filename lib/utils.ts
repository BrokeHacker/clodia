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

  if (cleaned.startsWith('+33')) {
    const digits = cleaned.slice(3)
    const groups = digits.match(/.{1,2}/g) ?? []
    return '+33' + (groups.length ? ' ' + groups.join(' ') : '')
  }

  if (cleaned.startsWith('0')) {
    const digits = cleaned.slice(1)
    const groups = digits.match(/.{1,2}/g) ?? []
    return '0' + (groups.length ? groups[0] + (groups.length > 1 ? ' ' + groups.slice(1).join(' ') : '') : '')
  }

  return cleaned
}
