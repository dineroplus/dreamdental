import { readFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { eq } from 'drizzle-orm'
import { db, schema } from '../db/client'
import { getSettings } from './data'
import { isMedia } from './utils'

async function mediaBytes(id: number): Promise<Buffer | null> {
  const rows = await db()
    .select({
      blob: schema.media.blob,
      url: schema.media.url,
    })
    .from(schema.media)
    .where(eq(schema.media.id, id))
    .limit(1)

  const row = rows[0]
  if (!row) return null
  if (row.blob) return Buffer.from(row.blob, 'base64')

  if (row.url.startsWith('/') && !row.url.startsWith('//')) {
    try {
      return await readFile(path.join(process.cwd(), 'public', row.url))
    } catch {
      return null
    }
  }

  return null
}

/** Square PNG for the browser tab and Apple touch icon. Uses Clinic settings, then the bundled mark. */
export async function renderAppIcon(px: number, fallbackName: string): Promise<Buffer> {
  const settings = await getSettings('ka').catch(() => null)
  const favicon = settings?.favicon
  const fromCms = isMedia(favicon) ? await mediaBytes(favicon.id).catch(() => null) : null
  const source = fromCms ?? (await readFile(path.join(process.cwd(), 'public/brand', fallbackName)))
  return sharp(source)
    .resize(px, px, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()
}
