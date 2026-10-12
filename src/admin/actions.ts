'use server'

import { and, asc, eq } from 'drizzle-orm'
import { revalidatePath, updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import sharp from 'sharp'
import { z } from 'zod'
import { db, schema } from '../db/client'
import { collections, singletons, type CollectionName, type SingletonName } from '../content/schema'
import { emptyShape, zodForMap, type FieldMap } from '../content/fields'
import { locales } from '../i18n/config'
import { CONTENT_TAG } from '../lib/data'
import { login, logout, requireUser } from './auth'
import { logoWithoutFlatBackground } from './logoMark'
import { slugFromTitle, titleFromStored } from './slug'

/**
 * `updateTag` expires the cached content before the response returns, so the
 * next refresh shows the save. `revalidateTag(..., 'max')` kept serving the
 * previous page while a refresh ran in the background.
 */
function revalidateContent() {
  try {
    updateTag(CONTENT_TAG)
    for (const locale of locales) {
      revalidatePath(`/${locale}`, 'layout')
    }
  } catch (error) {
    console.error('content revalidation failed', error)
  }
}

/** The next logo upload must not bring a white square back onto the site. */
async function clearLogoBackground(data: Record<string, unknown>) {
  const identity = data.identity
  if (!identity || typeof identity !== 'object') return
  const record = identity as Record<string, unknown>
  if (typeof record.logo !== 'number') return

  const rows = await db()
    .select({ blob: schema.media.blob })
    .from(schema.media)
    .where(eq(schema.media.id, record.logo))
    .limit(1)
  const blob = rows[0]?.blob
  if (!blob) return

  const png = await logoWithoutFlatBackground(Buffer.from(blob, 'base64'))
  if (!png) return
  const meta = await sharp(png).metadata()
  const filename = `logo-mark-${Date.now().toString(36)}.png`

  const [created] = await db()
    .insert(schema.media)
    .values({
      filename,
      url: '/api/media/file/pending',
      mimeType: 'image/png',
      width: meta.width ?? null,
      height: meta.height ?? null,
      filesize: png.length,
      blob: png.toString('base64'),
      sizes: {},
      alt: {},
      caption: {},
    })
    .returning({ id: schema.media.id })

  await db()
    .update(schema.media)
    .set({ url: `/api/media/file/${created.id}` })
    .where(eq(schema.media.id, created.id))
  record.logo = created.id
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const user = await login(email, password)
  if (!user) return { error: 'ელფოსტა ან პაროლი არასწორია' }
  redirect('/admin')
}

export async function logoutAction() {
  await logout()
  redirect('/admin/login')
}

const metaSchema = z.object({
  slug: z.string().trim(),
  order: z.number().int(),
  featured: z.boolean(),
  status: z.enum(['draft', 'published']),
})

export type DocumentMeta = z.infer<typeof metaSchema>

async function uniqueSlug(type: CollectionName, desired: string, ignoreId: number | null) {
  const base = desired || `item-${Date.now().toString(36)}`
  let slug = base
  let n = 2
  for (;;) {
    const rows = await db()
      .select({ id: schema.documents.id })
      .from(schema.documents)
      .where(and(eq(schema.documents.type, type), eq(schema.documents.slug, slug)))
      .limit(1)
    if (!rows[0] || rows[0].id === ignoreId) return slug
    slug = `${base}-${n}`
    n += 1
  }
}

function stripEmpty(value: unknown): unknown {
  if (value === '' || value === null) return undefined
  if (Array.isArray(value)) return value.map(stripEmpty)
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
      out[key] = stripEmpty(entry)
    }
    return out
  }
  return value
}

const TEXT_KINDS = new Set(['text', 'textarea', 'markdown', 'slug', 'url'])

function hasAnyText(value: unknown): boolean {
  if (typeof value === 'string') return value.trim() !== ''
  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).some(
      (part) => typeof part === 'string' && part.trim() !== '',
    )
  }
  return false
}

function rowIsBlank(fields: FieldMap, item: unknown): boolean {
  if (!item || typeof item !== 'object') return true
  const record = item as Record<string, unknown>
  const required = Object.entries(fields).filter(([, field]) => field.required)
  if (required.length === 0) return false
  return required.every(([key, field]) => {
    if (TEXT_KINDS.has(field.kind)) return !hasAnyText(record[key])
    return record[key] == null || record[key] === ''
  })
}

/** Drop rows that were added and never filled. Half-written rows are kept. */
function prepareFields(fields: FieldMap, data: Record<string, unknown>): Record<string, unknown> {
  const next = { ...data }
  for (const [name, field] of Object.entries(fields)) {
    if (field.kind === 'objectList' && Array.isArray(next[name])) {
      next[name] = next[name].filter((item) => !rowIsBlank(field.fields, item))
    } else if (field.kind === 'list' && Array.isArray(next[name])) {
      const textual =
        field.of.localized || field.of.kind === 'text' || field.of.kind === 'textarea' || field.of.kind === 'markdown'
      next[name] = next[name].filter((item) => (textual ? hasAnyText(item) : item != null && item !== ''))
    } else if (field.kind === 'blocks' && Array.isArray(next[name])) {
      next[name] = next[name].filter((block) => {
        if (!block || typeof block !== 'object') return false
        const record = block as Record<string, unknown>
        const definition = field.blocks[String(record.type)]
        if (!definition) return false
        return !rowIsBlank(definition.fields, record)
      })
    } else if (
      field.kind === 'group' &&
      next[name] &&
      typeof next[name] === 'object' &&
      !Array.isArray(next[name])
    ) {
      next[name] = prepareFields(field.fields, next[name] as Record<string, unknown>)
    }
  }
  return next
}

const FIELD_LABELS: Record<string, string> = {
  title: 'დასახელება',
  shortTitle: 'მოკლე დასახელება',
  excerpt: 'მოკლე აღწერა',
  body: 'აღწერა',
  highlights: 'უპირატესობა',
  faq: 'კითხვა',
  question: 'კითხვა',
  answer: 'პასუხი',
  text: 'ტექსტი',
  icon: 'იკონი',
  image: 'სურათი',
  ka: 'ქართული',
  en: 'ინგლისური',
  ru: 'რუსული',
  he: 'ებრაული',
  ar: 'არაბული',
  name: 'სახელი',
  specialty: 'სპეციალობა',
  beforeImage: 'მდე',
  afterImage: 'შემდეგ',
  patientName: 'პაციენტის სახელი',
  quote: 'გამოხმაურება',
  heading: 'სათაური',
  content: 'ტექსტი',
  label: 'წარწერა',
  value: 'მნიშვნელობა',
  description: 'აღწერა',
  photo: 'ფოტო',
  heroTitle: 'მთავარი სათაური',
  phone: 'ტელეფონი',
  address: 'მისამართი',
  email: 'ელფოსტა',
  category: 'კატეგორია',
  publishedAt: 'თარიღი',
}

/** The red bar used to say only “fill required fields”, with no hint which one. */
function requiredFieldsMessage(error: z.ZodError): string {
  const issue = error.issues[0]
  if (!issue) return 'შეავსე აუცილებელი ველები'
  const parts = issue.path.flatMap((part) => {
    if (typeof part === 'number') return [String(part + 1)]
    const label = FIELD_LABELS[String(part)]
    return label ? [label] : []
  })
  if (parts.length === 0) return 'შეავსე აუცილებელი ველები'
  return `შეავსე აუცილებელი ველი: ${parts.join(', ')}`
}

export async function saveDocument(
  type: CollectionName,
  id: number | null,
  data: Record<string, unknown>,
  meta: DocumentMeta,
) {
  const user = await requireUser()
  const definition = collections[type]
  if (!definition) throw new Error('unknown collection')

  let parsed: Record<string, unknown>
  try {
    const prepared = prepareFields(definition.fields, stripEmpty(data) as Record<string, unknown>)
    parsed = zodForMap(definition.fields).parse(prepared) as Record<string, unknown>
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(requiredFieldsMessage(error))
    }
    throw error
  }
  const safeMeta = metaSchema.parse(meta)
  const now = new Date()

  const title = titleFromStored(parsed[definition.titleKey])
  const typedSlug = safeMeta.slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  const slugNeedsFill = !typedSlug || safeMeta.slug.startsWith('new-')
  const slug = await uniqueSlug(type, slugNeedsFill ? slugFromTitle(title) : typedSlug, id)

  if (id) {
    await db()
      .update(schema.documents)
      .set({
        slug,
        order: safeMeta.order,
        featured: safeMeta.featured,
        status: safeMeta.status,
        data: parsed,
        updatedAt: now,
        updatedBy: user.id,
      })
      .where(and(eq(schema.documents.id, id), eq(schema.documents.type, type)))

    await db().insert(schema.revisions).values({
      target: type,
      documentId: id,
      data: parsed,
      createdBy: user.id,
    })

    revalidateContent()
    return { ok: true as const, id }
  }

  const [created] = await db()
    .insert(schema.documents)
    .values({
      type,
      slug,
      order: safeMeta.order,
      featured: safeMeta.featured,
      status: safeMeta.status,
      data: parsed,
      updatedBy: user.id,
    })
    .returning({ id: schema.documents.id })

  await db().insert(schema.revisions).values({
    target: type,
    documentId: created.id,
    data: parsed,
    createdBy: user.id,
  })

  revalidateContent()
  redirect(`/admin/${type}/${created.id}`)
}

/** Move a card up or down in the clinic list. The top card is first on the site. */
export async function moveDocument(type: CollectionName, id: number, direction: 'up' | 'down') {
  const user = await requireUser()
  if (!collections[type]) throw new Error('unknown collection')
  const docs = await db()
    .select({ id: schema.documents.id })
    .from(schema.documents)
    .where(eq(schema.documents.type, type))
    .orderBy(asc(schema.documents.order), asc(schema.documents.id))
  const index = docs.findIndex((doc) => doc.id === id)
  const target = direction === 'up' ? index - 1 : index + 1
  if (index < 0 || target < 0 || target >= docs.length) return { ok: true as const }

  const next = [...docs]
  const [item] = next.splice(index, 1)
  next.splice(target, 0, item)
  const now = new Date()
  for (const [position, doc] of next.entries()) {
    await db()
      .update(schema.documents)
      .set(
        doc.id === id
          ? { order: (position + 1) * 10, updatedAt: now, updatedBy: user.id }
          : { order: (position + 1) * 10 },
      )
      .where(eq(schema.documents.id, doc.id))
  }
  revalidateContent()
  return { ok: true as const }
}

/** A hidden copy, so a similar service or doctor does not start from a blank page. */
export async function duplicateDocument(type: CollectionName, id: number) {
  const user = await requireUser()
  const definition = collections[type]
  if (!definition) throw new Error('unknown collection')
  const rows = await db()
    .select()
    .from(schema.documents)
    .where(and(eq(schema.documents.id, id), eq(schema.documents.type, type)))
    .limit(1)
  const source = rows[0]
  if (!source) throw new Error('ჩანაწერი ვერ მოიძებნა')

  const data = { ...(source.data as Record<string, unknown>) }
  const titleValue = data[definition.titleKey]
  if (titleValue && typeof titleValue === 'object') {
    const map = { ...(titleValue as Record<string, unknown>) }
    if (typeof map.ka === 'string' && !map.ka.endsWith('(ასლი)')) map.ka = `${map.ka} (ასლი)`
    data[definition.titleKey] = map
  }

  const orders = await db()
    .select({ order: schema.documents.order })
    .from(schema.documents)
    .where(eq(schema.documents.type, type))
  const maxOrder = orders.reduce((max, row) => Math.max(max, row.order ?? 0), 0)
  const slug = await uniqueSlug(type, slugFromTitle(titleFromStored(data[definition.titleKey])), null)

  const [created] = await db()
    .insert(schema.documents)
    .values({
      type,
      slug,
      order: maxOrder + 10,
      featured: false,
      status: 'draft',
      data,
      updatedBy: user.id,
    })
    .returning({ id: schema.documents.id })

  await db().insert(schema.revisions).values({
    target: type,
    documentId: created.id,
    data,
    createdBy: user.id,
  })
  revalidateContent()
  redirect(`/admin/${type}/${created.id}`)
}

export async function deleteDocument(type: CollectionName, id: number) {
  await requireUser()
  await db()
    .delete(schema.documents)
    .where(and(eq(schema.documents.id, id), eq(schema.documents.type, type)))
  revalidateContent()
  redirect(`/admin/${type}`)
}

export async function saveSingleton(key: SingletonName, data: Record<string, unknown>) {
  const user = await requireUser()
  const definition = singletons[key]
  if (!definition) throw new Error('unknown singleton')

  let parsed: Record<string, unknown>
  try {
    const prepared = prepareFields(definition.fields, stripEmpty(data) as Record<string, unknown>)
    parsed = zodForMap(definition.fields).parse(prepared) as Record<string, unknown>
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(requiredFieldsMessage(error))
    }
    throw error
  }
  const now = new Date()
  if (key === 'settings') await clearLogoBackground(parsed)

  await db()
    .insert(schema.singletons)
    .values({
      key,
      data: parsed,
      updatedAt: now,
      updatedBy: user.id,
    })
    .onConflictDoUpdate({
      target: schema.singletons.key,
      set: {
        data: parsed,
        updatedAt: now,
        updatedBy: user.id,
      },
    })

  await db().insert(schema.revisions).values({
    target: key,
    documentId: null,
    data: parsed,
    createdBy: user.id,
  })

  revalidateContent()
  return { ok: true as const }
}

export async function updateBookingStatus(
  id: number,
  status: 'new' | 'contacted' | 'booked' | 'closed',
  notes?: string,
) {
  await requireUser()
  await db()
    .update(schema.bookings)
    .set({ status, notes: notes ?? null })
    .where(eq(schema.bookings.id, id))
  revalidateContent()
  return { ok: true as const }
}

/** Blank document shape used by the "new" editor route. */
export async function newDocumentDefaults(type: CollectionName) {
  const definition = collections[type]
  return {
    data: emptyShape(definition.fields),
    meta: {
      slug: `new-${Date.now()}`,
      order: 100,
      featured: false,
      // A saved before/after result is meant for the results page. Other
      // documents stay hidden until "საიტზე ჩანს" is turned on.
      status: (type === 'cases' ? 'published' : 'draft') as 'draft' | 'published',
    },
  }
}

export type RelationOption = { id: number; title: string }

export async function listRelated(type: CollectionName): Promise<RelationOption[]> {
  await requireUser()
  const definition = collections[type]
  const rows = await db()
    .select({
      id: schema.documents.id,
      data: schema.documents.data,
      slug: schema.documents.slug,
      status: schema.documents.status,
    })
    .from(schema.documents)
    .where(eq(schema.documents.type, type))
    .orderBy(asc(schema.documents.order), asc(schema.documents.id))

  return rows.map((row) => ({
    id: row.id,
    title:
      titleFromStored((row.data as Record<string, unknown>)[definition.titleKey]) ||
      row.slug ||
      `#${row.id}`,
  }))
}
