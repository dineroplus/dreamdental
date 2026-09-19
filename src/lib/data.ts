import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Locale } from '../i18n/config'

/**
 * One Payload instance per server process. `cache` dedupes within a request so
 * a page and its layout requesting the same global hit the database once.
 */
const client = cache(async () => getPayload({ config: configPromise }))

export const getSettings = cache(async (locale: Locale) => {
  const payload = await client()
  return payload.findGlobal({ slug: 'settings', locale, depth: 2 })
})

export const getTheme = cache(async () => {
  const payload = await client()
  return payload.findGlobal({ slug: 'theme', depth: 0 })
})

export const getNavigation = cache(async (locale: Locale) => {
  const payload = await client()
  return payload.findGlobal({ slug: 'navigation', locale, depth: 0 })
})

export const getHome = cache(async (locale: Locale) => {
  const payload = await client()
  return payload.findGlobal({ slug: 'home', locale, depth: 2 })
})

export const getServices = cache(async (locale: Locale, opts?: { featured?: boolean }) => {
  const payload = await client()
  const res = await payload.find({
    collection: 'services',
    locale,
    depth: 1,
    limit: 100,
    sort: 'order',
    where: opts?.featured ? { featured: { equals: true } } : undefined,
  })
  return res.docs
})

export const getServiceBySlug = cache(async (locale: Locale, slug: string) => {
  const payload = await client()
  const res = await payload.find({
    collection: 'services',
    locale,
    depth: 2,
    limit: 1,
    where: { slug: { equals: slug } },
  })
  return res.docs[0] ?? null
})

export const getDoctors = cache(async (locale: Locale, opts?: { featured?: boolean }) => {
  const payload = await client()
  const res = await payload.find({
    collection: 'doctors',
    locale,
    depth: 1,
    limit: 100,
    sort: 'order',
    where: opts?.featured ? { featured: { equals: true } } : undefined,
  })
  return res.docs
})

export const getDoctorBySlug = cache(async (locale: Locale, slug: string) => {
  const payload = await client()
  const res = await payload.find({
    collection: 'doctors',
    locale,
    depth: 2,
    limit: 1,
    where: { slug: { equals: slug } },
  })
  return res.docs[0] ?? null
})

export const getCases = cache(async (locale: Locale, opts?: { featured?: boolean }) => {
  const payload = await client()
  const res = await payload.find({
    collection: 'cases',
    locale,
    depth: 1,
    limit: 100,
    sort: 'order',
    where: opts?.featured ? { featured: { equals: true } } : undefined,
  })
  return res.docs
})

export const getTestimonials = cache(async (locale: Locale, opts?: { featured?: boolean }) => {
  const payload = await client()
  const res = await payload.find({
    collection: 'testimonials',
    locale,
    depth: 1,
    limit: 100,
    sort: 'order',
    where: opts?.featured ? { featured: { equals: true } } : undefined,
  })
  return res.docs
})

export const getGallery = cache(async (locale: Locale, category?: string) => {
  const payload = await client()
  const res = await payload.find({
    collection: 'gallery-items',
    locale,
    depth: 1,
    limit: 200,
    sort: 'order',
    where: category ? { category: { equals: category } } : undefined,
  })
  return res.docs
})

export const getPageBySlug = cache(async (locale: Locale, slug: string) => {
  const payload = await client()
  const res = await payload.find({
    collection: 'pages',
    locale,
    depth: 2,
    limit: 1,
    where: { slug: { equals: slug } },
  })
  return res.docs[0] ?? null
})

export const getPosts = cache(async (locale: Locale, limit = 24) => {
  const payload = await client()
  const res = await payload.find({
    collection: 'posts',
    locale,
    depth: 1,
    limit,
    sort: '-publishedAt',
  })
  return res.docs
})

export const getPostBySlug = cache(async (locale: Locale, slug: string) => {
  const payload = await client()
  const res = await payload.find({
    collection: 'posts',
    locale,
    depth: 2,
    limit: 1,
    where: { slug: { equals: slug } },
  })
  return res.docs[0] ?? null
})

/** Slug lists used by generateStaticParams and the sitemap. */
export const getAllSlugs = cache(
  async (collection: 'services' | 'doctors' | 'posts' | 'pages') => {
    const payload = await client()
    const res = await payload.find({
      collection,
      depth: 0,
      limit: 500,
      pagination: false,
      select: { slug: true, updatedAt: true },
    })
    return res.docs as Array<{ slug: string; updatedAt: string }>
  },
)
