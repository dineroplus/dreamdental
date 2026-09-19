'use server'

import { desc, eq, sql } from 'drizzle-orm'
import { db, schema } from '../db/client'
import { requireUser } from './auth'
import { revalidateTag } from 'next/cache'
import { CONTENT_TAG } from '../lib/data'

const MAX_BYTES = 6 * 1024 * 1024
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])

export type MediaOption = {
  id: number
  url: string
  filename: string
}

function sanitizeFilename(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120)
}

function uniqueName(original: string) {
  const safe = sanitizeFilename(original) || 'upload'
  const stamp = Date.now().toString(36)
  const ext = safe.includes('.') ? `.${safe.split('.').pop()}` : '.jpg'
  const base = safe.replace(/\.[^.]+$/, '')
  return `${base}-${stamp}${ext}`
}

async function ensureBlobColumn() {
  await db().execute(sql`ALTER TABLE cms.media ADD COLUMN IF NOT EXISTS blob text`)
}

function publicUrl(id: number) {
  return `/api/media/file/${id}`
}

/**
 * Stores the file in Postgres. Vercel’s filesystem does not keep writes, so
 * clinic photos have to live in the database and be served from `/api/media`.
 */
export async function uploadMedia(formData: FormData): Promise<MediaOption> {
  await requireUser()
  await ensureBlobColumn()

  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) {
    throw new Error('აირჩიე სურათი')
  }
  if (file.size > MAX_BYTES) {
    throw new Error('სურათი 6MB-ზე დიდია')
  }

  const mimeType = file.type || 'application/octet-stream'
  if (!ALLOWED.has(mimeType)) {
    throw new Error('მხოლოდ JPG, PNG, WEBP ან GIF')
  }

  const filename = uniqueName(file.name)
  const bytes = Buffer.from(await file.arrayBuffer())
  const blob = bytes.toString('base64')

  const [row] = await db()
    .insert(schema.media)
    .values({
      filename,
      url: '/api/media/file/pending',
      mimeType,
      filesize: bytes.length,
      blob,
      sizes: {},
      alt: {},
      caption: {},
    })
    .returning({ id: schema.media.id })

  const url = publicUrl(row.id)
  await db().update(schema.media).set({ url }).where(eq(schema.media.id, row.id))

  revalidateTag(CONTENT_TAG, 'max')
  return { id: row.id, url, filename }
}

export async function listMedia(): Promise<MediaOption[]> {
  await requireUser()
  await ensureBlobColumn()
  const rows = await db()
    .select({
      id: schema.media.id,
      url: schema.media.url,
      filename: schema.media.filename,
    })
    .from(schema.media)
    .orderBy(desc(schema.media.id))
    .limit(80)

  return rows.map((row) => ({
    id: row.id,
    url: row.url.startsWith('/api/media') || row.url.startsWith('/media') || row.url.startsWith('http')
      ? row.url
      : publicUrl(row.id),
    filename: row.filename,
  }))
}

export async function getMedia(id: number): Promise<MediaOption | null> {
  await requireUser()
  const rows = await db()
    .select({
      id: schema.media.id,
      url: schema.media.url,
      filename: schema.media.filename,
    })
    .from(schema.media)
    .where(eq(schema.media.id, id))
    .limit(1)
  const row = rows[0]
  return row ?? null
}
