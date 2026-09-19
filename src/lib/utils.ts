import type { Media } from '../payload-types'
import type { Locale } from '../i18n/config'

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

type MediaLike = number | Media | null | undefined

export function isMedia(value: MediaLike): value is Media {
  return typeof value === 'object' && value !== null && 'url' in value
}

export function mediaUrl(value: MediaLike, size?: 'thumb' | 'card' | 'wide' | 'hero'): string | null {
  if (!isMedia(value)) return null
  const raw = (size && value.sizes?.[size]?.url) || value.url
  if (!raw) return null
  return toLocalImageSrc(raw)
}

/**
 * Payload prefixes uploads with `serverURL`, so src becomes
 * `http://localhost:3000/api/media/file/…`. next/image treats that as a remote
 * URL and rejects it (`"url" parameter is not allowed`). Same-origin paths
 * go through the local optimizer. CDN/R2 hosts stay absolute.
 */
function toLocalImageSrc(url: string): string {
  if (!/^https?:\/\//i.test(url)) return url
  try {
    const parsed = new URL(url)
    const site = process.env.NEXT_PUBLIC_SITE_URL
    const sameOrigin = site ? parsed.host === new URL(site).host : false
    const loopback = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1'
    if (sameOrigin || loopback) return `${parsed.pathname}${parsed.search}`
    return url
  } catch {
    return url
  }
}

export function mediaAlt(value: MediaLike, fallback = ''): string {
  return (isMedia(value) && value.alt) || fallback
}

export function mediaDimensions(value: MediaLike): { width: number; height: number } {
  if (isMedia(value) && value.width && value.height) {
    return { width: value.width, height: value.height }
  }
  return { width: 1200, height: 800 }
}

/** Builds a locale-prefixed path. Every locale is prefixed, including Georgian. */
export function localePath(locale: Locale, path = '/'): string {
  const clean = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`
  return `/${locale}${clean}`
}

export function formatPhone(raw?: string | null): string {
  if (!raw) return ''
  const digits = raw.replace(/[^\d+]/g, '')
  const match = digits.match(/^\+995(\d{3})(\d{2})(\d{2})(\d{2})$/)
  if (match) return `+995 ${match[1]} ${match[2]} ${match[3]} ${match[4]}`
  return raw
}

/** Strips Lexical rich text down to plain text for meta descriptions. */
export function richTextToPlain(node: unknown, limit = 300): string {
  const out: string[] = []
  const walk = (n: any) => {
    if (!n || out.join(' ').length > limit) return
    if (typeof n.text === 'string') out.push(n.text)
    if (Array.isArray(n.children)) n.children.forEach(walk)
    if (n.root) walk(n.root)
  }
  walk(node)
  return out.join(' ').replace(/\s+/g, ' ').trim().slice(0, limit)
}

export function truncate(text: string, limit: number): string {
  if (text.length <= limit) return text
  return `${text.slice(0, limit - 1).trimEnd()}…`
}
