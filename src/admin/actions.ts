'use server'

import { and, eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { db, schema } from '../db/client'
import { collections, singletons, type CollectionName, type SingletonName } from '../content/schema'
import { emptyShape, zodForMap } from '../content/fields'
import { CONTENT_TAG } from '../lib/data'
import { login, logout, requireUser } from './auth'

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

export async function saveDocument(
  type: CollectionName,
  id: number | null,
  data: Record<string, unknown>,
  meta: DocumentMeta,
) {
  const user = await requireUser()
  const definition = collections[type]
  if (!definition) throw new Error('unknown collection')

  const parsed = zodForMap(definition.fields).parse(data) as Record<string, unknown>
  const safeMeta = metaSchema.parse(meta)
  const now = new Date()

  if (id) {
    await db()
      .update(schema.documents)
      .set({
        slug: safeMeta.slug,
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
      slug: safeMeta.slug,
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

  const parsed = zodForMap(definition.fields).parse(data) as Record<string, unknown>
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
