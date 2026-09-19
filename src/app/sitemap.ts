import type { MetadataRoute } from 'next'
import { locales, htmlLang } from '../i18n/config'
import { SITE_URL } from '../lib/site'
import { getAllSlugs } from '../lib/data'

const STATIC_PATHS = ['', '/services', '/doctors', '/cases', '/gallery', '/blog', '/contact', '/about']

/**
 * Every URL is listed once per language with full hreflang alternates, so
 * Google discovers and groups the three versions rather than guessing.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  const alternatesFor = (path: string) =>
    Object.fromEntries(locales.map((code) => [htmlLang[code], `${SITE_URL}/${code}${path}`]))

  const push = (path: string, lastModified?: string, priority = 0.7) => {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: lastModified ? new Date(lastModified) : new Date(),
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : priority,
        alternates: { languages: alternatesFor(path) },
      })
    }
  }

  for (const path of STATIC_PATHS) push(path, undefined, path === '' ? 1 : 0.8)

  const [services, doctors, posts, pages] = await Promise.all([
    getAllSlugs('services').catch(() => []),
    getAllSlugs('doctors').catch(() => []),
    getAllSlugs('posts').catch(() => []),
    getAllSlugs('pages').catch(() => []),
  ])

  for (const doc of services) push(`/services/${doc.slug}`, doc.updatedAt, 0.9)
  for (const doc of doctors) push(`/doctors/${doc.slug}`, doc.updatedAt, 0.6)
  for (const doc of posts) push(`/blog/${doc.slug}`, doc.updatedAt, 0.6)
  for (const doc of pages) {
    if (STATIC_PATHS.includes(`/${doc.slug}`)) continue
    push(`/${doc.slug}`, doc.updatedAt, 0.5)
  }

  return entries
}
