'use server'

import { and, asc, eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { db, schema } from '../db/client'
import { collections, singletons, type CollectionName, type SingletonName } from '../content/schema'
import { emptyShape, zodForMap } from '../content/fields'
import { CONTENT_TAG } from '../lib/data'
import { login, logout, requireUser } from './auth'
import { slugFromTitle, titleFromStored } from './slug'

/**
 * Next 16 wants a cacheLife profile on `revalidateTag`. `max` marks the tag
 * stale and serves while the next request refreshes in the background.
 */
function revalidateContent() {
  revalidateTag(CONTENT_TAG, 'max')
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
  slug: z.string().trim().min(1),
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
  if (value === '') return undefined
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
    parsed = zodForMap(definition.fields).parse(stripEmpty(data)) as Record<string, unknown>
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error('შეავსე აუცილებელი ველები')
    }
    throw error
  }
  const safeMeta = metaSchema.parse(meta)
  const now = new Date()

  const title = titleFromStored(parsed[definition.titleKey])
  const slugNeedsFill = !safeMeta.slug || safeMeta.slug.startsWith('new-')
  const slug = await uniqueSlug(
    type,
    slugNeedsFill ? slugFromTitle(title) : safeMeta.slug,
    id,
  )

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
    parsed = zodForMap(definition.fields).parse(stripEmpty(data)) as Record<string, unknown>
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error('შეავსე აუცილებელი ველები')
    }
    throw error
  }
  const now = new Date()

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
      status: 'draft' as const,
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
