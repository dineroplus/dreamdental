/**
 * One-off migration: read every document out of the old CMS and write it into
 * the `cms` schema in the shape described by `src/content/schema.ts`.
 *
 * Two structural changes happen here:
 *  - Lexical rich text becomes markdown-lite text.
 *  - Lists that used to be stored once per locale are zipped into a single
 *    list whose text fields hold all three languages.
 *
 * Re-running is safe: every table it owns is cleared first.
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { db, schema } from '../src/db/client'
import { locales, defaultLocale, type Locale } from '../src/i18n/config'

type Json = Record<string, any>
type LocalizedRaw<T> = Partial<Record<Locale, T | null>>

/* -------------------------------------------------------------------------- */
/* Value helpers                                                               */
/* -------------------------------------------------------------------------- */

/** Drops the `null`s Payload emits for untranslated locales. */
function cleanLocalized<T>(value: LocalizedRaw<T> | null | undefined): Record<string, T> | undefined {
  if (!value || typeof value !== 'object') return undefined
  const out: Record<string, T> = {}
  for (const locale of locales) {
    const entry = value[locale]
    if (entry !== null && entry !== undefined && entry !== '') out[locale] = entry
  }
  return Object.keys(out).length ? out : undefined
}

function clean<T>(value: T | null | undefined): T | undefined {
  if (value === null || value === undefined || value === '') return undefined
  if (Array.isArray(value) && value.length === 0) return undefined
  return value
}

/* -------------------------------------------------------------------------- */
/* Lexical -> markdown-lite                                                    */
/* -------------------------------------------------------------------------- */

const BOLD = 1

function inlineToMarkdown(children: Json[] | undefined): string {
  if (!children) return ''
  return children
    .map((node) => {
      if (node.type === 'link') {
        const href = node.fields?.url ?? node.fields?.doc ?? ''
        return `[${inlineToMarkdown(node.children)}](${href})`
      }
      if (typeof node.text !== 'string') return inlineToMarkdown(node.children)
      // eslint-disable-next-line no-bitwise
      return node.format & BOLD ? `**${node.text}**` : node.text
    })
    .join('')
}

function lexicalToMarkdown(value: Json | null | undefined): string | undefined {
  const root = value?.root
  if (!root?.children) return undefined

  const lines: string[] = []
  for (const node of root.children as Json[]) {
    if (node.type === 'heading') {
      const prefix = node.tag === 'h3' ? '### ' : '## '
      lines.push(prefix + inlineToMarkdown(node.children))
    } else if (node.type === 'list') {
      for (const item of (node.children ?? []) as Json[]) {
        lines.push('- ' + inlineToMarkdown(item.children))
      }
    } else if (node.type === 'quote') {
      lines.push(inlineToMarkdown(node.children))
    } else {
      const text = inlineToMarkdown(node.children)
      if (text.trim()) lines.push(text)
    }
  }

  return lines.length ? lines.join('\n') : undefined
}

function localizedMarkdown(value: LocalizedRaw<Json> | null | undefined): Record<string, string> | undefined {
  if (!value) return undefined
  const out: Record<string, string> = {}
  for (const locale of locales) {
    const markdown = lexicalToMarkdown(value[locale])
    if (markdown) out[locale] = markdown
  }
  return Object.keys(out).length ? out : undefined
}

/* -------------------------------------------------------------------------- */
/* Localised arrays -> one list holding every language                         */
/* -------------------------------------------------------------------------- */

/**
 * `{ ka: [a, b], en: [a, b] }` becomes `[{ text: { ka, en } }, …]`. Rows are
 * matched by position, which holds because each locale is a translation of
 * the same list. Any extra rows in one locale are still carried over.
 */
function zipLocalizedList(
  value: LocalizedRaw<Json[]> | null | undefined,
  localizedKeys: string[],
  plainKeys: string[] = [],
): Json[] | undefined {
  if (!value || typeof value !== 'object') return undefined

  const length = Math.max(...locales.map((locale) => value[locale]?.length ?? 0), 0)
  if (!length) return undefined

  const rows: Json[] = []
  for (let index = 0; index < length; index += 1) {
    const row: Json = {}

    for (const key of localizedKeys) {
      const translations: Record<string, unknown> = {}
      for (const locale of locales) {
        const entry = value[locale]?.[index]?.[key]
        if (entry !== null && entry !== undefined && entry !== '') translations[locale] = entry
      }
      if (Object.keys(translations).length) row[key] = translations
    }

    for (const key of plainKeys) {
      const entry = locales.map((locale) => value[locale]?.[index]?.[key]).find((v) => v != null)
      if (entry !== undefined) row[key] = entry
    }

    if (Object.keys(row).length) rows.push(row)
  }

  return rows.length ? rows : undefined
}

/** Lists that were never localised: only their text fields need cleaning. */
function cleanList(
  value: Json[] | null | undefined,
  localizedKeys: string[],
  transform?: (row: Json, out: Json) => void,
): Json[] | undefined {
  if (!Array.isArray(value) || !value.length) return undefined

  const rows = value.map((row) => {
    const out: Json = {}
    for (const [key, entry] of Object.entries(row)) {
      if (key === 'id' || key === 'blockName') continue
      if (localizedKeys.includes(key)) {
        const cleaned = cleanLocalized(entry as LocalizedRaw<unknown>)
        if (cleaned) out[key] = cleaned
      } else {
        const cleaned = clean(entry)
        if (cleaned !== undefined) out[key] = cleaned
      }
    }
    transform?.(row, out)
    return out
  })

  return rows.filter((row) => Object.keys(row).length).length ? rows : undefined
}

/* -------------------------------------------------------------------------- */
/* Shared field conversions                                                    */
/* -------------------------------------------------------------------------- */

function convertSeo(seo: Json | null | undefined, media: Map<number, number>): Json | undefined {
  if (!seo) return undefined
  const out: Json = {}
  const title = cleanLocalized(seo.title)
  const description = cleanLocalized(seo.description)
  const keywords = cleanLocalized(seo.keywords)
  if (title) out.title = title
  if (description) out.description = description
  if (keywords) out.keywords = keywords
  const image = mapMedia(seo.image, media)
  if (image) out.image = image
  if (seo.noindex) out.noindex = true
  return Object.keys(out).length ? out : undefined
}

function convertFaq(faq: unknown): Json[] | undefined {
  return zipLocalizedList(faq as LocalizedRaw<Json[]>, ['question', 'answer'])
}

function mapMedia(value: unknown, media: Map<number, number>): number | undefined {
  if (typeof value !== 'number') return undefined
  return media.get(value)
}

function mapMediaList(value: unknown, media: Map<number, number>): number[] | undefined {
  if (!Array.isArray(value)) return undefined
  const ids = value.map((entry) => mapMedia(entry, media)).filter((id): id is number => id != null)
  return ids.length ? ids : undefined
}

function mapRelation(value: unknown, relations: Map<string, number>, type: string): number | undefined {
  if (typeof value !== 'number') return undefined
  return relations.get(`${type}:${value}`)
}

function mapRelationList(value: unknown, relations: Map<string, number>, type: string): number[] | undefined {
  if (!Array.isArray(value)) return undefined
  const ids = value
    .map((entry) => mapRelation(entry, relations, type))
    .filter((id): id is number => id != null)
  return ids.length ? ids : undefined
}

/**
 * Media was seeded before R2 was configured, so stored URLs point at
 * `http://localhost:3000`. Keeping only the path makes them host-independent
 * and lets the new media route serve them from wherever the files live.
 */
function toPath(url: string | null | undefined): string | undefined {
  if (!url) return undefined
  if (!/^https?:\/\//i.test(url)) return url
  try {
    const parsed = new URL(url)
    return `${parsed.pathname}${parsed.search}`
  } catch {
    return url
  }
}

function dropEmpty(data: Json): Json {
  const out: Json = {}
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue
    if (Array.isArray(value) && !value.length) continue
    if (typeof value === 'object' && !Array.isArray(value) && !Object.keys(value).length) continue
    out[key] = value
  }
  return out
}

/* -------------------------------------------------------------------------- */
/* Import                                                                      */
/* -------------------------------------------------------------------------- */

const payload = await getPayload({ config })
const database = db()

async function findAll(collection: string): Promise<Json[]> {
  const res = await payload.find({
    collection: collection as never,
    locale: 'all',
    depth: 0,
    limit: 1000,
    pagination: false,
    draft: false,
  })
  return res.docs as Json[]
}

console.log('Clearing the cms schema…')
await database.delete(schema.revisions)
await database.delete(schema.documents)
await database.delete(schema.singletons)
await database.delete(schema.media)

/* --- Media ---------------------------------------------------------------- */

const mediaIds = new Map<number, number>()
const mediaDocs = await findAll('media')

for (const doc of mediaDocs) {
  const sizes: Json = {}
  for (const [name, size] of Object.entries((doc.sizes ?? {}) as Record<string, Json>)) {
    const url = toPath(size?.url)
    if (url && size.width && size.height) {
      sizes[name] = { url, width: size.width, height: size.height }
    }
  }

  const [row] = await database
    .insert(schema.media)
    .values({
      filename: doc.filename,
      url: toPath(doc.url) ?? `/api/media/file/${doc.filename}`,
      mimeType: doc.mimeType ?? 'application/octet-stream',
      width: doc.width ?? null,
      height: doc.height ?? null,
      filesize: doc.filesize ?? null,
      sizes,
      alt: cleanLocalized(doc.alt) ?? {},
      caption: cleanLocalized(doc.caption) ?? {},
      credit: doc.credit ?? null,
    })
    .returning({ id: schema.media.id })

  mediaIds.set(doc.id, row.id)
}
console.log(`  media: ${mediaIds.size}`)

/* --- Documents ------------------------------------------------------------ */

/** Old `collection:id` to new document id, filled in as collections import. */
const relations = new Map<string, number>()

type Converter = (doc: Json) => Json

async function importCollection(
  source: string,
  type: string,
  convert: Converter,
  slugOf: (doc: Json) => string,
) {
  const docs = await findAll(source)
  for (const doc of docs) {
    const [row] = await database
      .insert(schema.documents)
      .values({
        type,
        slug: slugOf(doc),
        order: typeof doc.order === 'number' ? doc.order : 100,
        featured: doc.featured === true,
        status: doc._status === 'draft' ? 'draft' : 'published',
        data: dropEmpty(convert(doc)),
      })
      .returning({ id: schema.documents.id })
    relations.set(`${source}:${doc.id}`, row.id)
  }
  console.log(`  ${type}: ${docs.length}`)
}

// Doctors and services first: later collections point at them.
await importCollection(
  'doctors',
  'doctors',
  (doc) => ({
    name: cleanLocalized(doc.name),
    specialty: cleanLocalized(doc.specialty),
    role: cleanLocalized(doc.role),
    photo: mapMedia(doc.photo, mediaIds),
    bio: localizedMarkdown(doc.bio),
    experienceSince: clean(doc.experienceSince),
    languages: clean(doc.languages),
    credentials: zipLocalizedList(doc.credentials, ['text'])?.map((row) => row.text),
    seo: convertSeo(doc.seo, mediaIds),
  }),
  (doc) => doc.slug,
)

await importCollection(
  'services',
  'services',
  (doc) => ({
    title: cleanLocalized(doc.title),
    shortTitle: cleanLocalized(doc.shortTitle),
    excerpt: cleanLocalized(doc.excerpt),
    body: localizedMarkdown(doc.body),
    highlights: zipLocalizedList(doc.highlights, ['text'], ['icon']),
    faq: convertFaq(doc.faq),
    image: mapMedia(doc.image, mediaIds),
    gallery: mapMediaList(doc.gallery, mediaIds),
    icon: clean(doc.icon),
    priceFrom: clean(doc.priceFrom),
    priceTo: clean(doc.priceTo),
    priceNote: cleanLocalized(doc.priceNote),
    duration: cleanLocalized(doc.duration),
    relatedDoctors: mapRelationList(doc.relatedDoctors, relations, 'doctors'),
    seo: convertSeo(doc.seo, mediaIds),
  }),
  (doc) => doc.slug,
)

await importCollection(
  'cases',
  'cases',
  (doc) => ({
    title: cleanLocalized(doc.title),
    beforeImage: mapMedia(doc.beforeImage, mediaIds),
    afterImage: mapMedia(doc.afterImage, mediaIds),
    description: cleanLocalized(doc.description),
    treatment: mapRelation(doc.treatment, relations, 'services'),
    doctor: mapRelation(doc.doctor, relations, 'doctors'),
    duration: cleanLocalized(doc.duration),
    patientConsent: doc.patientConsent === true,
  }),
  (doc) => `case-${doc.id}`,
)

await importCollection(
  'testimonials',
  'testimonials',
  (doc) => ({
    patientName: cleanLocalized(doc.patientName),
    quote: cleanLocalized(doc.quote),
    country: cleanLocalized(doc.country),
    countryCode: clean(doc.countryCode),
    rating: clean(doc.rating),
    treatment: mapRelation(doc.treatment, relations, 'services'),
    doctor: mapRelation(doc.doctor, relations, 'doctors'),
    photo: mapMedia(doc.photo, mediaIds),
    videoUrl: clean(doc.videoUrl),
    source: clean(doc.source),
    isPublicFigure: doc.isPublicFigure === true,
  }),
  (doc) => `testimonial-${doc.id}`,
)

await importCollection(
  'gallery-items',
  'gallery',
  (doc) => ({
    title: cleanLocalized(doc.title),
    image: mapMedia(doc.image, mediaIds),
    category: clean(doc.category),
    description: cleanLocalized(doc.description),
  }),
  (doc) => `gallery-${doc.id}`,
)

await importCollection(
  'pages',
  'pages',
  (doc) => ({
    title: cleanLocalized(doc.title),
    subtitle: cleanLocalized(doc.subtitle),
    heroImage: mapMedia(doc.heroImage, mediaIds),
    layout: convertLayout(doc.layout),
    faq: convertFaq(doc.faq),
    showInSitemap: doc.showInSitemap !== false,
    seo: convertSeo(doc.seo, mediaIds),
  }),
  (doc) => doc.slug,
)

await importCollection(
  'posts',
  'posts',
  (doc) => ({
    title: cleanLocalized(doc.title),
    excerpt: cleanLocalized(doc.excerpt),
    coverImage: mapMedia(doc.coverImage, mediaIds),
    body: localizedMarkdown(doc.body),
    faq: convertFaq(doc.faq),
    publishedAt: clean(doc.publishedAt),
    author: mapRelation(doc.author, relations, 'doctors'),
    relatedServices: mapRelationList(doc.relatedServices, relations, 'services'),
    seo: convertSeo(doc.seo, mediaIds),
  }),
  (doc) => doc.slug,
)

function convertLayout(layout: Json[] | null | undefined): Json[] | undefined {
  if (!Array.isArray(layout) || !layout.length) return undefined

  return layout.map((block) => {
    const out: Json = { type: block.blockType, id: block.id }
    const heading = cleanLocalized(block.heading)
    if (heading) out.heading = heading

    switch (block.blockType) {
      case 'richText': {
        const content = localizedMarkdown(block.content)
        if (content) out.content = content
        if (block.width) out.width = block.width
        break
      }
      case 'imageText': {
        const content = localizedMarkdown(block.content)
        if (content) out.content = content
        const image = mapMedia(block.image, mediaIds)
        if (image) out.image = image
        if (block.imagePosition) out.imagePosition = block.imagePosition
        break
      }
      case 'featureGrid': {
        const items = zipLocalizedList(block.items, ['title', 'description'])
        if (items) out.items = items
        break
      }
      case 'gallery': {
        const images = mapMediaList(block.images, mediaIds)
        if (images) out.images = images
        break
      }
      case 'cta': {
        const text = cleanLocalized(block.text)
        const buttonLabel = cleanLocalized(block.buttonLabel)
        if (text) out.text = text
        if (buttonLabel) out.buttonLabel = buttonLabel
        if (block.buttonHref) out.buttonHref = block.buttonHref
        break
      }
    }

    return out
  })
}

/* --- Singletons ----------------------------------------------------------- */

async function importSingleton(key: string, data: Json) {
  await database.insert(schema.singletons).values({ key, data: dropEmpty(data) })
  console.log(`  ${key}`)
}

const home = (await payload.findGlobal({ slug: 'home', locale: 'all', depth: 0 })) as Json
await importSingleton('home', {
  heroEyebrow: cleanLocalized(home.heroEyebrow),
  heroTitle: cleanLocalized(home.heroTitle),
  heroSubtitle: cleanLocalized(home.heroSubtitle),
  heroImage: mapMedia(home.heroImage, mediaIds),
  heroVideoUrl: clean(home.heroVideoUrl),
  heroBullets: zipLocalizedList(home.heroBullets, ['text'])?.map((row) => row.text),
  primaryCtaLabel: cleanLocalized(home.primaryCtaLabel),
  primaryCtaHref: clean(home.primaryCtaHref),
  sections: cleanList(home.sections, ['heading', 'subheading']),
  advantages: zipLocalizedList(home.advantages, ['title', 'description'], ['icon']),
  seo: convertSeo(home.seo, mediaIds),
})

const settings = (await payload.findGlobal({ slug: 'settings', locale: 'all', depth: 0 })) as Json
await importSingleton('settings', {
  identity: dropEmpty({
    clinicName: cleanLocalized(settings.clinicName),
    tagline: cleanLocalized(settings.tagline),
    logo: mapMedia(settings.logo, mediaIds),
    favicon: mapMedia(settings.favicon, mediaIds),
    defaultShareImage: mapMedia(settings.defaultShareImage, mediaIds),
  }),
  contact: dropEmpty({
    phonePrimary: clean(settings.phonePrimary),
    phoneSecondary: clean(settings.phoneSecondary),
    whatsapp: clean(settings.whatsapp),
    email: clean(settings.email),
    addressLine: cleanLocalized(settings.addressLine),
    city: cleanLocalized(settings.city),
    latitude: clean(settings.latitude),
    longitude: clean(settings.longitude),
    mapUrl: clean(settings.mapUrl),
  }),
  hours: dropEmpty({
    openEveryDay: settings.openEveryDay !== false,
    opensAt: clean(settings.opensAt),
    closesAt: clean(settings.closesAt),
    hoursNote: cleanLocalized(settings.hoursNote),
  }),
  social: dropEmpty({
    facebook: clean(settings.facebook),
    instagram: clean(settings.instagram),
    youtube: clean(settings.youtube),
    tiktok: clean(settings.tiktok),
  }),
  stats: zipLocalizedList(settings.stats, ['label'], ['value', 'suffix']),
  insurancePartners: cleanList(settings.insurancePartners, [], (row, out) => {
    const logo = mapMedia(row.logo, mediaIds)
    if (logo) out.logo = logo
    else delete out.logo
  }),
  awards: zipLocalizedList(settings.awards, ['title'], ['year', 'image'])?.map((row) => ({
    ...row,
    image: mapMedia(row.image, mediaIds),
  })),
  analytics: dropEmpty({
    googleAnalyticsId: clean(settings.googleAnalyticsId),
    googleSiteVerification: clean(settings.googleSiteVerification),
    metaPixelId: clean(settings.metaPixelId),
  }),
})

const navigation = (await payload.findGlobal({ slug: 'navigation', locale: 'all', depth: 0 })) as Json
await importSingleton('navigation', {
  header: cleanList(navigation.header, ['label'], (row, out) => {
    const children = cleanList(row.children, ['label'])
    if (children) out.children = children
    else delete out.children
  }),
  footerColumns: cleanList(navigation.footerColumns, ['title'], (row, out) => {
    const links = cleanList(row.links, ['label'])
    if (links) out.links = links
    else delete out.links
  }),
})

const theme = (await payload.findGlobal({ slug: 'theme', depth: 0 })) as Json
await importSingleton('theme', {
  primary: clean(theme.primary),
  accent: clean(theme.accent),
  gold: clean(theme.gold),
  background: clean(theme.background),
  surface: clean(theme.surface),
  text: clean(theme.text),
  headingScale: clean(theme.headingScale),
  radius: clean(theme.radius),
  motionLevel: clean(theme.motionLevel),
})

/* --- Bookings ------------------------------------------------------------- */

const oldBookings = await findAll('bookings')
if (oldBookings.length) {
  const serviceSlugs = new Map<number, string>()
  for (const service of await findAll('services')) serviceSlugs.set(service.id, service.slug)

  await database.insert(schema.bookings).values(
    oldBookings.map((booking) => ({
      name: booking.name,
      phone: booking.phone,
      email: booking.email ?? null,
      message: booking.message ?? null,
      serviceSlug: typeof booking.service === 'number' ? (serviceSlugs.get(booking.service) ?? null) : null,
      locale: booking.locale ?? null,
      sourcePath: booking.sourcePath ?? null,
      status: booking.status ?? 'new',
      notes: booking.notes ?? null,
      createdAt: booking.createdAt ? new Date(booking.createdAt) : new Date(),
    })),
  )
}
console.log(`  bookings: ${oldBookings.length}`)

console.log(`\nDone. Default locale stays ${defaultLocale}.`)
process.exit(0)
