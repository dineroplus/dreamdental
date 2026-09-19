import type { Metadata } from 'next'
import { locales, htmlLang, ogLocale, type Locale } from '../i18n/config'
import { SITE_URL, SITE_NAME } from './site'

type Args = {
  locale: Locale
  /** Path without the locale prefix, e.g. "/services/implants". */
  path?: string
  title: string
  description?: string
  image?: string | null
  noindex?: boolean
  type?: 'website' | 'article'
  publishedTime?: string
}

/**
 * Builds canonical + hreflang for every page. Each language gets its own
 * canonical URL and all three are cross-referenced, which is what lets Google
 * rank the Georgian, English and Russian versions independently instead of
 * treating two of them as duplicates.
 */
export function buildMetadata({
  locale,
  path = '',
  title,
  description,
  image,
  noindex,
  type = 'website',
  publishedTime,
}: Args): Metadata {
  const clean = path && !path.startsWith('/') ? `/${path}` : path
  const canonical = `${SITE_URL}/${locale}${clean}`

  const languages: Record<string, string> = {}
  for (const code of locales) {
    languages[htmlLang[code]] = `${SITE_URL}/${code}${clean}`
  }
  languages['x-default'] = `${SITE_URL}/ka${clean}`

  const ogImage = image ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) : undefined

  return {
    title,
    description,
    alternates: { canonical, languages },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type,
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}
