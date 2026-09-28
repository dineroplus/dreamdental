/** "5 წუთის წინ" style label; falls back to the date after a week. */
export function relativeTime(value: Date | string, now = new Date()): string {
  const date = typeof value === 'string' ? new Date(value) : value
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'ახლახან'
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} წუთის წინ`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} საათის წინ`
  const days = Math.round(hours / 24)
  if (days === 1) return 'გუშინ'
  if (days < 7) return `${days} დღის წინ`
  return fullDate(date)
}

export function fullDate(value: Date | string): string {
  const date = typeof value === 'string' ? new Date(value) : value
  return date.toLocaleString('ka-GE', {
    timeZone: 'Asia/Tbilisi',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Digits only, for `tel:` and wa.me links. */
export function phoneDigits(phone: string): string {
  return phone.replace(/[^\d+]/g, '')
}

export function whatsappHref(phone: string): string {
  let digits = phone.replace(/\D/g, '')
  if (digits.length === 9 && digits.startsWith('5')) digits = `995${digits}`
  return `https://wa.me/${digits}`
}
