import type { CollectionName, SingletonName } from '../../content/schema'

/** Public path for a collection document, or null when there is no detail page. */
export function documentPreviewPath(type: CollectionName, slug: string | null | undefined): string | null {
  const clean = (slug || '').trim()
  if (!clean) {
    if (type === 'gallery') return '/ka/gallery'
    if (type === 'testimonials') return '/ka'
    if (type === 'cases') return '/ka/cases'
    return null
  }

  switch (type) {
    case 'doctors':
      return `/ka/doctors/${clean}`
    case 'services':
      return `/ka/services/${clean}`
    case 'posts':
      return `/ka/blog/${clean}`
    case 'pages':
      return `/ka/${clean}`
    case 'cases':
      return '/ka/cases'
    case 'gallery':
      return '/ka/gallery'
    case 'testimonials':
      return '/ka'
    default:
      return null
  }
}

export function singletonPreviewPath(key: SingletonName): string | null {
  switch (key) {
    case 'home':
      return '/ka'
    case 'settings':
      return '/ka/contact'
    case 'navigation':
      return '/ka'
    case 'theme':
      return '/ka'
    default:
      return null
  }
}

/** Absolute URL for opening in a new tab from the browser. */
export function absolutePreviewUrl(path: string | null): string | null {
  if (!path) return null
  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  return `${origin.replace(/\/$/, '')}${path}`
}

/** First useful image id from document/singleton data. */
export function previewImageId(data: Record<string, unknown>): number | null {
  for (const key of ['photo', 'image', 'heroImage', 'coverImage', 'beforeImage', 'afterImage']) {
    const value = data[key]
    if (typeof value === 'number') return value
  }
  return null
}

/** Georgian-first title from common content fields. */
export function previewTitle(data: Record<string, unknown>, titleKey?: string): string {
  const keys = titleKey
    ? [titleKey, 'title', 'name', 'heroTitle', 'patientName']
    : ['title', 'name', 'heroTitle', 'patientName']

  for (const key of keys) {
    const raw = data[key]
    const text = localizedText(raw)
    if (text) return text
  }

  const identity = data.identity
  if (identity && typeof identity === 'object') {
    const clinic = localizedText((identity as Record<string, unknown>).clinicName)
    if (clinic) return clinic
  }

  return 'უსათაურო'
}

function localizedText(value: unknown): string {
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (value && typeof value === 'object') {
    const map = value as Record<string, unknown>
    for (const code of ['ka', 'en', 'ru']) {
      const part = map[code]
      if (typeof part === 'string' && part.trim()) return part.trim()
    }
  }
  return ''
}
