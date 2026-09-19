/**
 * Derives every logo asset the site needs from the single source PNG the
 * clinic provided. Re-run with `node scripts/build-logo.mjs` after replacing
 * public/brand/logo-source.png.
 */
import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import sharp from 'sharp'

const root = resolve(import.meta.dirname, '..')
const source = resolve(root, 'public/brand/logo-source.png')

/** Warm cream from the brand palette, used where transparency is not allowed. */
const CREAM = { r: 253, g: 248, b: 239, alpha: 1 }
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 }

async function write(path, pipeline) {
  const out = resolve(root, path)
  await mkdir(dirname(out), { recursive: true })
  await pipeline.toFile(out)
  const { width, height } = await sharp(out).metadata()
  console.log(`${path.padEnd(38)} ${width}×${height}`)
}

/** Trims transparent edges, then centres the mark on a square canvas. */
async function square(size, background, padding = 0.1) {
  const inner = Math.round(size * (1 - padding * 2))
  const trimmed = await sharp(source).trim().toBuffer()
  return sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([
      {
        input: await sharp(trimmed)
          .resize(inner, inner, { fit: 'contain', background: CLEAR })
          .toBuffer(),
        gravity: 'centre',
      },
    ])
    .png()
}

const trimmed = await sharp(source).trim().toBuffer()

// Header / footer mark. Kept transparent and generously sized for retina.
await write('public/brand/logo.png', sharp(trimmed).resize({ width: 640 }).png())

// Favicons. Next.js picks these up from src/app automatically.
await write('src/app/icon.png', await square(512, CLEAR, 0.06))
await write('src/app/apple-icon.png', await square(180, CREAM, 0.12))

// Default social share card.
await write(
  'public/brand/og-default.png',
  sharp({ create: { width: 1200, height: 630, channels: 4, background: CREAM } })
    .composite([
      {
        input: await sharp(trimmed).resize({ height: 340, fit: 'contain' }).toBuffer(),
        gravity: 'centre',
      },
    ])
    .png(),
)
