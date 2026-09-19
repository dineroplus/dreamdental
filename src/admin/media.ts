'use server'

import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { db, schema } from '../db/client'
import { requireUser } from './auth'
import { revalidateTag } from 'next/cache'
import { CONTENT_TAG } from '../lib/data'

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
  const ext = path.extname(safe)
  const base = path.basename(safe, ext)
  return `${base}-${stamp}${ext}`
}

function s3Client() {
  return new S3Client({
    region: process.env.S3_REGION || 'auto',
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    },
  })
}

/**
 * Stores the file on R2 when `S3_BUCKET` is set, otherwise writes into
 * `public/uploads/` so local development works without Cloudflare credentials.
 * Always inserts a `cms.media` row and returns its id for relation fields.
 */
export async function uploadMedia(file: File): Promise<number> {
  await requireUser()

  const filename = uniqueName(file.name)
  const bytes = Buffer.from(await file.arrayBuffer())
  const mimeType = file.type || 'application/octet-stream'

  let url: string

  if (process.env.S3_BUCKET) {
    const key = `uploads/${filename}`
    await s3Client().send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: bytes,
        ContentType: mimeType,
      }),
    )
    const publicBase = (process.env.NEXT_PUBLIC_S3_PUBLIC_URL || '').replace(/\/$/, '')
    url = publicBase ? `${publicBase}/${key}` : `/${key}`
  } else {
    const dir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(dir, { recursive: true })
    await writeFile(path.join(dir, filename), bytes)
    url = `/uploads/${filename}`
  }

  const [row] = await db()
    .insert(schema.media)
    .values({
      filename,
      url,
      mimeType,
      filesize: bytes.length,
      sizes: {},
      alt: {},
      caption: {},
    })
    .returning({ id: schema.media.id })

  revalidateTag(CONTENT_TAG, 'max')
  return row.id
}
