/**
 * Populates an empty database with the clinic's real content in all three
 * languages. Safe to re-run: existing documents are matched by slug and
 * updated rather than duplicated.
 *
 *   npm run seed
 *   npm run seed -- --cleanup-media
 */
import { existsSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { getPayload, type Payload } from 'payload'
import config from '@payload-config'
import { locales, defaultLocale, type Locale } from '../i18n/config'
import { CLINIC } from '../lib/site'
import { richText } from './lexical'
import { services } from './data/services'
import { doctors } from './data/doctors'
import { advantages, home, navigation, settings } from './data/site'
import { pages, posts } from './data/pages'
import { testimonials } from './data/testimonials'
import type { Localized } from './data/services'

/** Folder the clinic's original assets live in, alongside the app. */
const ASSETS = resolve(import.meta.dirname, '../../../Old Project\\')

type GalleryCategory = 'interior' | 'equipment' | 'team' | 'kids' | 'vip'

/** Assets worth importing. Screenshots and low-resolution files are skipped. */
const MEDIA: Array<{
  key: string
  file: string
  alt: Localized<string>
  gallery?: GalleryCategory
}> = [
  {
    key: 'reception',
    file: '01. Home/465071157_1104863268314154_5482511713967508175_n.png',
    alt: {
      ka: 'Dream Dental Group-ის რეცეფცია თბილისში',
      en: 'The reception at Dream Dental Group in Tbilisi',
      ru: 'Ресепшен Dream Dental Group в Тбилиси',
    },
    gallery: 'interior',
  },
  {
    key: 'interior-collage',
    file: '01. Home/03.png',
    alt: {
      ka: 'კლინიკის ინტერიერი და „Dream & Smile" კედელი',
      en: 'The clinic interior and the “Dream & Smile” wall',
      ru: 'Интерьер клиники и стена «Dream & Smile»',
    },
    gallery: 'interior',
  },
  {
    key: 'facade',
    file: '02. About Us/001.png',
    alt: {
      ka: 'კლინიკის შენობა ბარათაშვილის #10-ზე',
      en: 'The clinic building at Baratashvili St. 10',
      ru: 'Здание клиники на ул. Бараташвили 10',
    },
    gallery: 'interior',
  },
  {
    key: 'reception-logo',
    file: '02. About Us/002.png',
    alt: {
      ka: 'რეცეფცია კლინიკის ლოგოთი',
      en: 'The reception desk with the clinic logo',
      ru: 'Стойка ресепшен с логотипом клиники',
    },
    gallery: 'interior',
  },
  {
    key: 'implants',
    file: '03. Services/03.1 - Dental Implants/15061.jpg',
    alt: {
      ka: 'დენტალური იმპლანტის ილუსტრაცია',
      en: 'Illustration of a dental implant',
      ru: 'Иллюстрация дентального импланта',
    },
  },
  {
    key: 'veneers',
    file: '03. Services/03.2 - Veneers/Veneer-Belmont.png',
    alt: { ka: 'კერამიკული ვინირები', en: 'Ceramic veneers', ru: 'Керамические виниры' },
  },
  {
    key: 'whitening',
    file: '03. Services/03.3 - Teeth Whitening/22.png',
    alt: { ka: 'კბილების გათეთრება', en: 'Teeth whitening', ru: 'Отбеливание зубов' },
  },
  {
    key: 'orthodontics',
    file: '03. Services/03.4 - Orthodontics/blanchiment-6.jpg',
    alt: { ka: 'ორთოდონტიული მკურნალობა', en: 'Orthodontic treatment', ru: 'Ортодонтическое лечение' },
  },
  {
    key: 'surgery',
    file: '03. Services/03.5 - Oral Surgery/extraction-thumb1.png',
    alt: { ka: 'სტომატოლოგიური ქირურგია', en: 'Oral surgery', ru: 'Стоматологическая хирургия' },
  },
  {
    key: 'restoration',
    file: '03. Services/03.6 - Restoration& Fillings/Untitled design.png',
    alt: { ka: 'ესთეტიკური რესტავრაცია', en: 'Aesthetic restoration', ru: 'Эстетическая реставрация' },
  },
  ...['005', '006', '007', '008', '009', '010', '011', '012'].map((n) => ({
    key: `equipment-${n}`,
    file: `04. Galery/02. Equipment/equipment/${n}.png`,
    alt: {
      ka: 'Dream Dental Group-ის სტომატოლოგიური აპარატურა',
      en: 'Dental equipment at Dream Dental Group',
      ru: 'Стоматологическое оборудование Dream Dental Group',
    },
    gallery: 'equipment' as const,
  })),
]

const GALLERY_TITLES: Record<string, Localized<string>> = {
  interior: { ka: 'კლინიკის ინტერიერი', en: 'Clinic interior', ru: 'Интерьер клиники' },
  equipment: { ka: 'თანამედროვე აპარატურა', en: 'Modern equipment', ru: 'Современное оборудование' },
}

/**
 * Locales other than the first must reuse the row IDs Payload generated,
 * otherwise each write recreates the rows and wipes the translations stored
 * against the previous locale. Only arrays that are not themselves `localized`
 * need this — `localized: true` arrays keep a separate copy per language.
 */
const withIds = <T extends object>(rows: T[], existing?: Array<{ id?: string | null }> | null) =>
  rows.map((row, index) => {
    const id = existing?.[index]?.id
    return id ? { ...row, id } : row
  })

/** Applies a localised value across every locale for a single document. */
async function localize<T>(
  write: (locale: Locale, value: T) => Promise<unknown>,
  value: Localized<T>,
) {
  for (const locale of locales) {
    await write(locale, value[locale])
  }
}

async function upsert(
  payload: Payload,
  collection: 'services' | 'doctors' | 'pages' | 'posts',
  slug: string,
  base: Record<string, unknown>,
) {
  const existing = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })

  if (existing.docs[0]) {
    return payload.update({
      collection,
      id: existing.docs[0].id,
      locale: defaultLocale,
      data: base as never,
    })
  }

  return payload.create({
    collection,
    locale: defaultLocale,
    data: { ...base, slug } as never,
  })
}

/**
 * Payload appends `-1`, `-2`… when the same file is uploaded again
 * (`005.png` → `005-8.png`, `blanchiment-6.jpg` → `blanchiment-15.jpg`).
 * Group those copies so re-running seed does not create another set.
 */
function uploadFamily(filename?: string | null): string {
  if (!filename) return ''
  return filename
    .replace(/\.[^.]+$/, '')
    .replace(/-\d+x\d+$/, '')
    .replace(/-\d+$/, '')
    .toLowerCase()
}

async function mediaByFamily(payload: Payload) {
  const res = await payload.find({ collection: 'media', limit: 1000, depth: 0 })
  const map = new Map<string, number>()
  for (const doc of res.docs) {
    const family = uploadFamily(doc.filename)
    if (family && !map.has(family)) map.set(family, doc.id)
  }
  return map
}

const MEDIA_FIELD_NAMES = new Set([
  'image',
  'images',
  'photo',
  'coverImage',
  'heroImage',
  'beforeImage',
  'afterImage',
  'logo',
  'favicon',
  'defaultShareImage',
])

function collectMediaIds(value: unknown, into: Set<number>, key?: string) {
  if (value == null) return
  if (typeof value === 'number') {
    if (key && MEDIA_FIELD_NAMES.has(key)) into.add(value)
    return
  }
  if (Array.isArray(value)) {
    for (const item of value) collectMediaIds(item, into, key)
    return
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    if (typeof obj.id === 'number' && typeof obj.url === 'string') into.add(obj.id)
    for (const [nextKey, next] of Object.entries(obj)) collectMediaIds(next, into, nextKey)
  }
}

async function referencedMediaIds(payload: Payload) {
  const ids = new Set<number>()
  for (const collection of [
    'gallery-items',
    'services',
    'doctors',
    'cases',
    'testimonials',
    'posts',
    'pages',
  ] as const) {
    const res = await payload.find({ collection, limit: 500, depth: 2 })
    for (const doc of res.docs) collectMediaIds(doc, ids)
  }
  for (const slug of ['settings', 'home'] as const) {
    collectMediaIds(await payload.findGlobal({ slug, depth: 2 }), ids)
  }
  return ids
}

/** Drop gallery rows and unused upload copies created by earlier seed runs. */
async function dedupeGalleryAndMedia(payload: Payload) {
  const gallery = await payload.find({
    collection: 'gallery-items',
    limit: 500,
    depth: 1,
    sort: 'id',
  })
  const seen = new Set<string>()
  let removedGallery = 0
  for (const item of gallery.docs) {
    const filename = typeof item.image === 'object' && item.image ? item.image.filename : ''
    const family = uploadFamily(filename)
    if (!family || seen.has(family)) {
      await payload.delete({ collection: 'gallery-items', id: item.id })
      removedGallery += 1
    } else {
      seen.add(family)
    }
  }

  const referenced = await referencedMediaIds(payload)
  const media = await payload.find({ collection: 'media', limit: 1000, depth: 0 })
  let removedMedia = 0
  for (const doc of media.docs) {
    if (referenced.has(doc.id)) continue
    await payload.delete({ collection: 'media', id: doc.id })
    removedMedia += 1
  }

  console.log(`  deduped gallery: -${removedGallery}, unused media: -${removedMedia}`)
}

async function seedMedia(payload: Payload) {
  const map = new Map<string, number>()
  const existing = await mediaByFamily(payload)

  for (const item of MEDIA) {
    const filePath = resolve(ASSETS, item.file)
    if (!existsSync(filePath)) {
      console.warn(`  skipped (missing): ${item.file}`)
      continue
    }

    const family = uploadFamily(basename(item.file))
    let id = existing.get(family)
    if (!id) {
      const created = await payload.create({
        collection: 'media',
        locale: defaultLocale,
        data: { alt: item.alt[defaultLocale] },
        filePath,
      })
      id = created.id
      existing.set(family, id)
    }

    await localize(
      (locale, alt) => payload.update({ collection: 'media', id: id!, locale, data: { alt } }),
      item.alt,
    )

    map.set(item.key, id)
  }

  console.log(`  media: ${map.size}`)
  return map
}

async function seedGallery(payload: Payload, media: Map<string, number>) {
  let order = 10
  let count = 0

  for (const item of MEDIA) {
    if (!item.gallery) continue
    const imageId = media.get(item.key)
    if (!imageId) continue

    const existing = await payload.find({
      collection: 'gallery-items',
      where: { image: { equals: imageId } },
      limit: 1,
      depth: 0,
    })

    const title = GALLERY_TITLES[item.gallery] ?? item.alt
    const id =
      existing.docs[0]?.id ??
      (
        await payload.create({
          collection: 'gallery-items',
          locale: defaultLocale,
          data: { image: imageId, category: item.gallery, order, title: title[defaultLocale] },
        })
      ).id

    await localize(
      (locale, value) =>
        payload.update({
          collection: 'gallery-items',
          id,
          locale,
          data: { title: value, category: item.gallery!, order },
        }),
      title,
    )

    order += 10
    count += 1
  }

  console.log(`  gallery items: ${count}`)
}

async function seedServices(payload: Payload, media: Map<string, number>) {
  for (const service of services) {
    const doc = await upsert(payload, 'services', service.slug, {
      title: service.title[defaultLocale],
      shortTitle: service.shortTitle[defaultLocale],
      excerpt: service.excerpt[defaultLocale],
      icon: service.icon,
      order: service.order,
      featured: service.featured,
      priceFrom: service.priceFrom,
      priceTo: service.priceTo,
      image: service.image ? media.get(service.image) : undefined,
      _status: 'published',
    })

    for (const locale of locales) {
      await payload.update({
        collection: 'services',
        id: doc.id,
        locale,
        data: {
          title: service.title[locale],
          shortTitle: service.shortTitle[locale],
          excerpt: service.excerpt[locale],
          duration: service.duration[locale],
          priceNote: service.priceNote[locale],
          highlights: service.highlights[locale],
          body: richText(service.body[locale]),
          faq: service.faq[locale],
          _status: 'published',
        } as never,
      })
    }
  }

  console.log(`  services: ${services.length}`)
}

async function seedDoctors(payload: Payload) {
  for (const doctor of doctors) {
    const doc = await upsert(payload, 'doctors', doctor.slug, {
      name: doctor.name[defaultLocale],
      specialty: doctor.specialty[defaultLocale],
      order: doctor.order,
      featured: doctor.featured,
      experienceSince: doctor.experienceSince,
      languages: doctor.languages,
      _status: 'published',
    })

    for (const locale of locales) {
      await payload.update({
        collection: 'doctors',
        id: doc.id,
        locale,
        data: {
          name: doctor.name[locale],
          specialty: doctor.specialty[locale],
          role: doctor.role?.[locale],
          bio: richText(doctor.bio[locale]),
          _status: 'published',
        } as never,
      })
    }
  }

  console.log(`  doctors: ${doctors.length}`)
}

async function seedPages(payload: Payload, media: Map<string, number>) {
  for (const page of pages) {
    const doc = await upsert(payload, 'pages', page.slug, {
      title: page.title[defaultLocale],
      heroImage: page.heroImage ? media.get(page.heroImage) : undefined,
      _status: 'published',
    })

    let blockIds: Array<{ id?: string | null }> | null = null

    for (const locale of locales) {
      const layout = page.layout.map((block) => {
        if (block.type === 'richText') {
          return {
            blockType: 'richText',
            heading: block.heading?.[locale],
            content: richText(block.content[locale]),
            width: block.width ?? 'narrow',
          }
        }
        if (block.type === 'featureGrid') {
          return {
            blockType: 'featureGrid',
            heading: block.heading[locale],
            items: block.items[locale],
          }
        }
        return {
          blockType: 'cta',
          heading: block.heading[locale],
          text: block.text[locale],
          buttonLabel: block.buttonLabel[locale],
          buttonHref: block.buttonHref,
        }
      })

      const updated = await payload.update({
        collection: 'pages',
        id: doc.id,
        locale,
        data: {
          title: page.title[locale],
          subtitle: page.subtitle[locale],
          faq: page.faq[locale],
          layout: withIds(layout, blockIds),
          _status: 'published',
        } as never,
      })

      blockIds ??= (updated.layout ?? []) as Array<{ id?: string | null }>
    }
  }

  console.log(`  pages: ${pages.length}`)
}

async function seedPosts(payload: Payload) {
  for (const post of posts) {
    const doc = await upsert(payload, 'posts', post.slug, {
      title: post.title[defaultLocale],
      excerpt: post.excerpt[defaultLocale],
      publishedAt: new Date(post.publishedAt).toISOString(),
      _status: 'published',
    })

    for (const locale of locales) {
      await payload.update({
        collection: 'posts',
        id: doc.id,
        locale,
        data: {
          title: post.title[locale],
          excerpt: post.excerpt[locale],
          body: richText(post.body[locale]),
          _status: 'published',
        } as never,
      })
    }
  }

  console.log(`  posts: ${posts.length}`)
}

async function seedTestimonials(payload: Payload) {
  for (const item of testimonials) {
    const existing = await payload.find({
      collection: 'testimonials',
      locale: defaultLocale,
      where: { patientName: { equals: item.patientName[defaultLocale] } },
      limit: 1,
      depth: 0,
    })

    const base = {
      patientName: item.patientName[defaultLocale],
      quote: item.quote[defaultLocale],
      country: item.country[defaultLocale],
      countryCode: item.countryCode || undefined,
      rating: item.rating,
      source: item.source,
      featured: item.featured,
      order: item.order,
      _status: 'published' as const,
    }

    const id = existing.docs[0]
      ? (
          await payload.update({
            collection: 'testimonials',
            id: existing.docs[0].id,
            locale: defaultLocale,
            data: base as never,
          })
        ).id
      : (
          await payload.create({
            collection: 'testimonials',
            locale: defaultLocale,
            data: base as never,
          })
        ).id

    for (const locale of locales) {
      await payload.update({
        collection: 'testimonials',
        id,
        locale,
        data: {
          patientName: item.patientName[locale],
          quote: item.quote[locale],
          country: item.country[locale],
          _status: 'published',
        } as never,
      })
    }
  }

  console.log(`  testimonials: ${testimonials.length}`)
}

type RowIds = Array<{ id?: string | null }>
type ColumnIds = Array<{ id?: string | null; links?: RowIds | null }>

async function seedGlobals(payload: Payload, media: Map<string, number>) {
  let headerIds: RowIds | null = null
  let footerIds: ColumnIds | null = null
  let sectionIds: RowIds | null = null

  for (const locale of locales) {
    await payload.updateGlobal({
      slug: 'settings',
      locale,
      data: {
        clinicName: settings.clinicName[locale],
        tagline: settings.tagline[locale],
        addressLine: settings.addressLine[locale],
        city: settings.city[locale],
        hoursNote: settings.hoursNote[locale],
        mapUrl: settings.mapUrl,
        phonePrimary: CLINIC.phonePrimary,
        phoneSecondary: CLINIC.phoneSecondary,
        whatsapp: CLINIC.whatsapp,
        email: CLINIC.email,
        latitude: CLINIC.latitude,
        longitude: CLINIC.longitude,
        openEveryDay: true,
        opensAt: CLINIC.opensAt,
        closesAt: CLINIC.closesAt,
        facebook: CLINIC.facebook,
        instagram: CLINIC.instagram,
        stats: settings.stats[locale],
        defaultShareImage: media.get('reception'),
      } as never,
    })

    const nav: { header?: RowIds | null; footerColumns?: ColumnIds | null } = await payload.updateGlobal({
      slug: 'navigation',
      locale,
      data: {
        header: withIds(
          navigation.header.map((link) => ({ label: link.label[locale], href: link.href })),
          headerIds,
        ),
        footerColumns: withIds(
          navigation.footer.map((column, index) => ({
            title: column.title[locale],
            links: withIds(
              column.links.map((link) => ({ label: link.label[locale], href: link.href })),
              footerIds?.[index]?.links,
            ),
          })),
          footerIds,
        ),
      } as never,
    })

    headerIds ??= nav.header ?? []
    footerIds ??= nav.footerColumns ?? []

    const homeDoc = await payload.updateGlobal({
      slug: 'home',
      locale,
      data: {
        heroEyebrow: home.heroEyebrow[locale],
        heroTitle: home.heroTitle[locale],
        heroSubtitle: home.heroSubtitle[locale],
        heroImage: media.get('reception'),
        heroBullets: home.heroBullets[locale].map((text) => ({ text })),
        primaryCtaLabel: home.primaryCtaLabel[locale],
        primaryCtaHref: '/contact',
        advantages: advantages[locale],
        sections: withIds(
          [
            'stats',
            'services',
            'whyUs',
            'cases',
            'doctors',
            'testimonials',
            'kids',
            'tourism',
            'gallery',
            'contact',
          ].map((blockType) => ({
            blockType,
            enabled: true,
            heading: home.sectionHeadings[blockType]?.[locale]?.heading,
            subheading: home.sectionHeadings[blockType]?.[locale]?.subheading,
          })),
          sectionIds,
        ),
        seo: home.seo[locale],
        _status: 'published',
      } as never,
    })

    sectionIds ??= (homeDoc.sections ?? []) as Array<{ id?: string | null }>
  }

  console.log(`  globals: settings, navigation, home`)
}

async function seedAdmin(payload: Payload) {
  const existing = await payload.find({ collection: 'users', limit: 1, depth: 0 })
  if (existing.totalDocs > 0) {
    console.log('  admin user: already exists')
    return
  }

  const email = process.env.SEED_ADMIN_EMAIL || CLINIC.email
  const password = process.env.SEED_ADMIN_PASSWORD
  if (!password) {
    console.log('  admin user: skipped (set SEED_ADMIN_PASSWORD to create one)')
    return
  }

  await payload.create({
    collection: 'users',
    data: { email, password, name: 'Dream Dental', role: 'admin' },
  })
  console.log(`  admin user: ${email}`)
}

async function main() {
  const payload = await getPayload({ config })

  if (process.argv.includes('--cleanup-media')) {
    console.log('Removing duplicate gallery photos…')
    await dedupeGalleryAndMedia(payload)
    console.log('Done.')
    process.exit(0)
  }

  console.log('Seeding Dream Dental content…')
  await seedAdmin(payload)
  await dedupeGalleryAndMedia(payload)
  const media = await seedMedia(payload)
  await seedGallery(payload, media)
  await seedServices(payload, media)
  await seedDoctors(payload)
  await seedTestimonials(payload)
  await seedPages(payload, media)
  await seedPosts(payload)
  await seedGlobals(payload, media)
  console.log('Done.')

  process.exit(0)
}

main().catch((error) => {
  // Payload nests field-level problems here; without this a validation failure
  // only ever prints "[Object]".
  const fields = (error as { data?: { errors?: unknown[] } })?.data?.errors
  if (fields) console.error(JSON.stringify(fields, null, 2))
  console.error(error)
  process.exit(1)
})
