import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { asc, eq } from 'drizzle-orm'
import { db, schema } from '../db/client'
import { collections, singletons, type CollectionName, type SingletonName } from '../content/schema'
import type {
  CaseStudy,
  Doctor,
  GalleryItem,
  Home,
  Navigation,
  Page,
  Post,
  Service,
  Settings,
  Testimonial,
  Theme,
} from '../content/schema'
import { resolveFields } from '../content/resolve'
import { pick, type Field, type FieldMap, type MediaRef } from '../content/fields'
import type { Locale } from '../i18n/config'

/**
 * Content is read from Postgres and cached under a single `content` tag. The
 * admin calls `revalidateTag(CONTENT_TAG)` after every save, so an edit is
 * live immediately without a redeploy.
 *
 * Next 16 replaces `unstable_cache` with the `use cache` directive, but that
 * belongs to the separate Cache Components migration; the docs are explicit
 * that this layer keeps working alongside it.
 */
export const CONTENT_TAG = 'content'

const REVALIDATE_SECONDS = 3600

/* -------------------------------------------------------------------------- */
/* Raw reads                                                                   */
/* -------------------------------------------------------------------------- */

type Row = typeof schema.documents.$inferSelect
type MediaRow = typeof schema.media.$inferSelect

const loadDocuments = unstable_cache(
  async (): Promise<Row[]> =>
    db().select().from(schema.documents).orderBy(asc(schema.documents.order), asc(schema.documents.id)),
  ['documents'],
  { tags: [CONTENT_TAG], revalidate: REVALIDATE_SECONDS },
)

const loadSingletons = unstable_cache(
  async () => db().select().from(schema.singletons),
  ['singletons'],
  { tags: [CONTENT_TAG], revalidate: REVALIDATE_SECONDS },
)

const loadMedia = unstable_cache(async (): Promise<MediaRow[]> => db().select().from(schema.media), ['media'], {
  tags: [CONTENT_TAG],
  revalidate: REVALIDATE_SECONDS,
})

/**
 * The whole content set is a few hundred rows, so it is loaded once per
 * request and joined in memory. That removes every N+1 query the previous
 * CMS made for relations and keeps a page render to three queries at most.
 */
const snapshot = cache(async () => {
  const [documents, singletonRows, mediaRows] = await Promise.all([
    loadDocuments(),
    loadSingletons(),
    loadMedia(),
  ])

  return {
    documents,
    byId: new Map(documents.map((row) => [row.id, row])),
    singletons: new Map(singletonRows.map((row) => [row.key, row.data])),
    media: new Map(mediaRows.map((row) => [row.id, row])),
  }
})

type Snapshot = Awaited<ReturnType<typeof snapshot>>

/* -------------------------------------------------------------------------- */
/* Populating ids into records                                                 */
/* -------------------------------------------------------------------------- */

function toMediaRef(row: MediaRow | undefined, locale: Locale): MediaRef | undefined {
  if (!row) return undefined
  return {
    id: row.id,
    filename: row.filename,
    url: row.url,
    mimeType: row.mimeType,
    width: row.width,
    height: row.height,
    alt: pick(row.alt, locale) ?? '',
    sizes: row.sizes ?? {},
  }
}

/**
 * Walks the resolved document and swaps media and relation ids for records.
 * `depth` stops relations from pulling in their own relations, which is both
 * a cycle guard and the reason a page never loads the entire database.
 */
function populate(
  fields: FieldMap,
  data: Record<string, unknown>,
  state: Snapshot,
  locale: Locale,
  depth: number,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...data }

  for (const [name, field] of Object.entries(fields)) {
    const value = out[name]
    if (value === undefined || value === null) continue

    switch (field.kind) {
      case 'image':
        out[name] = toMediaRef(state.media.get(value as number), locale)
        break
      case 'imageList':
        out[name] = (value as number[])
          .map((id) => toMediaRef(state.media.get(id), locale))
          .filter(Boolean)
        break
      case 'relation':
        out[name] = depth > 0 ? relatedDoc(value as number, state, locale, depth - 1) : value
        break
      case 'relationList':
        out[name] =
          depth > 0
            ? (value as number[])
                .map((id) => relatedDoc(id, state, locale, depth - 1))
                .filter(Boolean)
            : value
        break
      case 'group':
        out[name] = populate(field.fields, value as Record<string, unknown>, state, locale, depth)
        break
      case 'objectList':
        out[name] = (value as Record<string, unknown>[]).map((item) =>
          populate(field.fields, item, state, locale, depth),
        )
        break
      case 'blocks':
        out[name] = (value as Record<string, unknown>[]).map((block) => {
          const definition = field.blocks[block.type as string]
          return definition ? populate(definition.fields, block, state, locale, depth) : block
        })
        break
      case 'list':
        out[name] = populateList(field.of, value as unknown[], state, locale, depth)
        break
    }
  }

  return out
}

function populateList(
  item: Field,
  values: unknown[],
  state: Snapshot,
  locale: Locale,
  depth: number,
): unknown[] {
  if (item.kind === 'image') {
    return values.map((id) => toMediaRef(state.media.get(id as number), locale)).filter(Boolean)
  }
  if (item.kind === 'objectList' || item.kind === 'group') {
    return values.map((value) =>
      populate(item.fields, value as Record<string, unknown>, state, locale, depth),
    )
  }
  return values
}

function relatedDoc(id: number, state: Snapshot, locale: Locale, depth: number) {
  const row = state.byId.get(id)
  if (!row || row.status !== 'published') return undefined
  return buildDoc(row, state, locale, depth)
}

function buildDoc(row: Row, state: Snapshot, locale: Locale, depth = 1) {
  const definition = collections[row.type as CollectionName]
  if (!definition) return null

  const resolved = resolveFields(definition.fields, row.data, locale)
  return {
    id: row.id,
    slug: row.slug,
    order: row.order,
    featured: row.featured,
    status: row.status,
    updatedAt: row.updatedAt.toISOString(),
    ...populate(definition.fields, resolved, state, locale, depth),
  }
}

/* -------------------------------------------------------------------------- */
/* Collections                                                                 */
/* -------------------------------------------------------------------------- */

type Options = { featured?: boolean; limit?: number; includeDrafts?: boolean }

async function list<T>(type: CollectionName, locale: Locale, options: Options = {}): Promise<T[]> {
  const state = await snapshot()
  let rows = state.documents.filter((row) => row.type === type)

  if (!options.includeDrafts) rows = rows.filter((row) => row.status === 'published')
  if (options.featured) rows = rows.filter((row) => row.featured)
  if (options.limit) rows = rows.slice(0, options.limit)

  return rows.map((row) => buildDoc(row, state, locale)) as T[]
}

async function bySlug<T>(type: CollectionName, locale: Locale, slug: string): Promise<T | null> {
  const state = await snapshot()
  const row = state.documents.find(
    (entry) => entry.type === type && entry.slug === slug && entry.status === 'published',
  )
  return row ? ((buildDoc(row, state, locale) ?? null) as T | null) : null
}

export const getServices = (locale: Locale, options?: Options) =>
  list<Service>('services', locale, options)
export const getServiceBySlug = (locale: Locale, slug: string) =>
  bySlug<Service>('services', locale, slug)

export const getDoctors = (locale: Locale, options?: Options) => list<Doctor>('doctors', locale, options)
export const getDoctorBySlug = (locale: Locale, slug: string) =>
  bySlug<Doctor>('doctors', locale, slug)

export const getCases = (locale: Locale, options?: Options) => list<CaseStudy>('cases', locale, options)
export const getTestimonials = (locale: Locale, options?: Options) =>
  list<Testimonial>('testimonials', locale, options)

export async function getGallery(locale: Locale, category?: string): Promise<GalleryItem[]> {
  const items = await list<GalleryItem>('gallery', locale)
  return category ? items.filter((item) => item.category === category) : items
}

export const getPageBySlug = (locale: Locale, slug: string) => bySlug<Page>('pages', locale, slug)

export async function getPosts(locale: Locale, limit = 24): Promise<Post[]> {
  const posts = await list<Post>('posts', locale)
  return posts
    .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
    .slice(0, limit)
}

export const getPostBySlug = (locale: Locale, slug: string) => bySlug<Post>('posts', locale, slug)

/** Slug lists used by generateStaticParams and the sitemap. */
export async function getAllSlugs(type: CollectionName) {
  const state = await snapshot()
  return state.documents
    .filter((row) => row.type === type && row.status === 'published')
    .map((row) => ({ slug: row.slug, updatedAt: row.updatedAt.toISOString() }))
}

/* -------------------------------------------------------------------------- */
/* Singletons                                                                  */
/* -------------------------------------------------------------------------- */

async function singleton<T>(key: SingletonName, locale: Locale, depth = 1): Promise<T> {
  const state = await snapshot()
  const definition = singletons[key]
  const resolved = resolveFields(definition.fields, state.singletons.get(key), locale)
  return populate(definition.fields, resolved, state, locale, depth) as T
}

export const getHome = (locale: Locale) => singleton<Home>('home', locale)
export const getNavigation = (locale: Locale) => singleton<Navigation>('navigation', locale)
export const getTheme = (locale: Locale) => singleton<Theme>('theme', locale)

/** Flattens the admin's grouping so pages can read `settings.phonePrimary`. */
export async function getSettings(locale: Locale): Promise<Settings> {
  const grouped = await singleton<Record<string, Record<string, unknown>>>('settings', locale)
  const { identity, contact, hours, social, analytics, ...rest } = grouped
  return { ...identity, ...contact, ...hours, ...social, ...analytics, ...rest } as Settings
}
