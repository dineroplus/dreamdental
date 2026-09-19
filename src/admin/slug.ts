const KA: Record<string, string> = {
  ა: 'a',
  ბ: 'b',
  გ: 'g',
  დ: 'd',
  ე: 'e',
  ვ: 'v',
  ზ: 'z',
  თ: 't',
  ი: 'i',
  კ: 'k',
  ლ: 'l',
  მ: 'm',
  ნ: 'n',
  ო: 'o',
  პ: 'p',
  ჟ: 'zh',
  რ: 'r',
  ს: 's',
  ტ: 't',
  უ: 'u',
  ფ: 'p',
  ქ: 'k',
  ღ: 'gh',
  ყ: 'q',
  შ: 'sh',
  ჩ: 'ch',
  ც: 'ts',
  ძ: 'dz',
  წ: 'ts',
  ჭ: 'ch',
  ხ: 'kh',
  ჯ: 'j',
  ჰ: 'h',
}

/** URL slug from a Georgian or Latin title. Clinic staff never type this. */
export function slugFromTitle(value: string): string {
  const transliterated = value
    .trim()
    .toLowerCase()
    .split('')
    .map((char) => KA[char] ?? char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)

  return transliterated || `item-${Date.now().toString(36)}`
}

export function titleFromStored(value: unknown): string {
  if (typeof value === 'string') return value.trim()
  if (value && typeof value === 'object') {
    const map = value as Record<string, unknown>
    for (const key of ['ka', 'en', 'ru']) {
      const part = map[key]
      if (typeof part === 'string' && part.trim()) return part.trim()
    }
  }
  return ''
}
