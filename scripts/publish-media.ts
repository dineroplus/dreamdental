/**
 * Copies CMS media out of the gitignored Payload `media/` folder into
 * `public/media/` as compressed WebP, then rewrites `cms.media` URLs so the
 * site no longer depends on `/api/media/file/...` (which 500s on Vercel).
 *
 *   node --env-file=.env --import=tsx/esm scripts/publish-media.ts
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { eq } from 'drizzle-orm'
import { db, schema } from '../src/db/client'

const SRC = path.resolve('media')
const DEST = path.resolve('public/media')

const SIZES = {
  thumb: 400,
  card: 768,
  wide: 1200,
  hero: 1600,
} as const

async function exists(file: string) {
  try {
    await fs.access(file)
    return true
  } catch {
    return false
  }
}

await fs.mkdir(DEST, { recursive: true })

const rows = await db().select().from(schema.media)
console.log(`Publishing ${rows.length} media records…`)

for (const row of rows) {
  const source = path.join(SRC, row.filename)
  if (!(await exists(source))) {
    console.warn(`  skip missing source: ${row.filename}`)
    continue
  }

  const base = path.parse(row.filename).name.replace(/[^a-zA-Z0-9._-]+/g, '-')
  const mainName = `${base}.webp`
  const mainPath = path.join(DEST, mainName)

  const mainInfo = await sharp(source)
    .rotate()
    .resize({ width: SIZES.wide, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(mainPath)

  const sizes: Record<string, { url: string; width: number; height: number }> = {}
  for (const [name, width] of Object.entries(SIZES)) {
    const fileName = `${base}-${name}.webp`
    const info = await sharp(source)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: name === 'thumb' ? 72 : 78 })
      .toFile(path.join(DEST, fileName))
    sizes[name] = { url: `/media/${fileName}`, width: info.width, height: info.height }
  }

  await db()
    .update(schema.media)
    .set({
      filename: mainName,
      url: `/media/${mainName}`,
      mimeType: 'image/webp',
      width: mainInfo.width,
      height: mainInfo.height,
      sizes,
    })
    .where(eq(schema.media.id, row.id))

  console.log(`  ${row.filename} → /media/${mainName}`)
}

console.log('Done. Commit public/media and redeploy.')
process.exit(0)
