'use server'

import { desc, eq, sql } from 'drizzle-orm'
import sharp from 'sharp'
import { db, schema } from '../db/client'
import { requireUser } from './auth'
import { revalidateTag } from 'next/cache'
import { CONTENT_TAG } from '../lib/data'

const MAX_BYTES = 8 * 1024 * 1024
const ALLOWED = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/heic',
  'image/heif',
])

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

function uniqueName(original: string, ext?: string | null) {
  const safe = sanitizeFilename(original) || 'upload'
  const stamp = Date.now().toString(36)
  const fallback = safe.includes('.') ? `.${safe.split('.').pop()}` : '.jpg'
  const base = safe.replace(/\.[^.]+$/, '')
  return `${base}-${stamp}${ext || fallback}`
}

async function blobColumnReady() {
  const result = await db().execute(sql`
    select 1 as ok
    from information_schema.columns
    where table_schema = 'cms' and table_name = 'media' and column_name = 'blob'
    limit 1
  `)
  return result.rows.length > 0
}

/**
 * The column is part of the schema. Changing the table needs an owner, so a
 * signed-in editor must still be able to upload when that change is refused.
 */
async function ensureBlobColumn() {
  if (await blobColumnReady()) return
  try {
    await db().execute(sql`ALTER TABLE cms.media ADD COLUMN IF NOT EXISTS blob text`)
  } catch {
    if (await blobColumnReady()) return
    throw new Error('სურათის შენახვა ვერ მოხერხდა')
  }
}

async function preparedImage(bytes: Buffer, mimeType: string) {
  try {
    // fit: 'inside' only shrinks oversized files. It never crops, so a smile
    // photo keeps the lips and teeth the clinic uploaded.
    const output = await sharp(bytes, { failOn: 'none' })
      .rotate()
      .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer()
    const meta = await sharp(output).metadata()
    return {
      bytes: output,
      mimeType: 'image/webp',
      width: meta.width ?? null,
      height: meta.height ?? null,
      ext: '.webp',
    }
  } catch {
    if (!ALLOWED.has(mimeType) || mimeType === 'image/heic' || mimeType === 'image/heif') {
      throw new Error('მხოლოდ JPG, PNG, WEBP ან GIF')
    }
    return { bytes, mimeType, width: null, height: null, ext: null as string | null }
  }
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
    throw new Error('სურათი ძალიან დიდია. უფრო პატარა ფაილი ატვირთე.')
  }

  const mimeType = file.type || 'application/octet-stream'
  if (!ALLOWED.has(mimeType)) {
    throw new Error('მხოლოდ JPG, PNG, WEBP ან GIF')
  }

  const prepared = await preparedImage(Buffer.from(await file.arrayBuffer()), mimeType)
  const filename = uniqueName(file.name, prepared.ext)
  const blob = prepared.bytes.toString('base64')

  const [row] = await db()
    .insert(schema.media)
    .values({
      filename,
      url: '/api/media/file/pending',
      mimeType: prepared.mimeType,
      width: prepared.width,
      height: prepared.height,
      filesize: prepared.bytes.length,
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
  if (!row) return null
  return {
    id: row.id,
    url:
      row.url.startsWith('/api/media') || row.url.startsWith('/media') || row.url.startsWith('http')
        ? row.url
        : publicUrl(row.id),
    filename: row.filename,
  }
}
