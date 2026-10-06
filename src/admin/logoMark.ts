import sharp from 'sharp'

type Rgb = { r: number; g: number; b: number }

/**
 * Clinic logo files are often exported on a white or cream square. The header
 * and footer need the mark alone, so a flat light background is removed and a
 * wordmark sitting under the symbol is left out. Photos and already
 * transparent marks are returned unchanged.
 */
export async function logoWithoutFlatBackground(input: Buffer): Promise<Buffer | null> {
  const { data, info } = await sharp(input, { failOn: 'none' })
    .rotate()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const width = info.width
  const height = info.height
  if (!width || !height) return null

  const background = flatLightBackground(data, width, height)
  if (!background) return null

  const keyed = Buffer.from(data)
  for (let i = 0; i < data.length; i += 4) {
    const distance = colorDistance(data, i, background)
    if (distance < 22) keyed[i + 3] = 0
    else if (distance < 48) keyed[i + 3] = Math.round(((distance - 22) / 26) * 255)
  }

  const box = opaqueBounds(keyed, width, height)
  if (!box) return null
  const mark = upperMark(keyed, width, height, box)

  return sharp(keyed, { raw: { width, height, channels: 4 } })
    .extract(mark)
    .resize({ width: 640, withoutEnlargement: true })
    .png()
    .toBuffer()
}

function flatLightBackground(data: Buffer, width: number, height: number): Rgb | null {
  const samples = [
    ...block(data, width, height, 2, 2),
    ...block(data, width, height, width - 12, 2),
    ...block(data, width, height, 2, height - 12),
    ...block(data, width, height, width - 12, height - 12),
  ]
  if (samples.length < 8) return null
  const opaque = samples.filter((pixel) => pixel.a > 20)
  if (opaque.length < samples.length * 0.8) return null

  const average = {
    r: mean(opaque.map((pixel) => pixel.r)),
    g: mean(opaque.map((pixel) => pixel.g)),
    b: mean(opaque.map((pixel) => pixel.b)),
  }
  const luminance = 0.2126 * average.r + 0.7152 * average.g + 0.0722 * average.b
  if (luminance < 220) return null

  const uneven = opaque.some((pixel) => colorDistanceOf(pixel, average) > 18)
  if (uneven) return null
  return average
}

function block(data: Buffer, width: number, height: number, left: number, top: number) {
  const pixels: Array<Rgb & { a: number }> = []
  for (let y = top; y < top + 8 && y < height; y++) {
    for (let x = left; x < left + 8 && x < width; x++) {
      if (x < 0 || y < 0) continue
      const index = (y * width + x) * 4
      pixels.push({ r: data[index], g: data[index + 1], b: data[index + 2], a: data[index + 3] })
    }
  }
  return pixels
}

function upperMark(
  data: Buffer,
  width: number,
  height: number,
  box: { left: number; top: number; width: number; height: number },
) {
  const bottom = box.top + box.height
  let gap = bottom
  const start = box.top + Math.floor(box.height * 0.45)
  for (let y = start; y < bottom; y++) {
    let empty = true
    for (let row = 0; row < 16 && y + row < bottom; row++) {
      for (let x = box.left; x < box.left + box.width; x += 2) {
        if (data[((y + row) * width + x) * 4 + 3] > 16) {
          empty = false
          break
        }
      }
      if (!empty) break
    }
    if (empty) {
      gap = y
      break
    }
  }

  const markBottom = gap < bottom ? gap : bottom
  let left = box.left + box.width
  let right = box.left
  for (let y = box.top; y < markBottom; y++) {
    for (let x = box.left; x < box.left + box.width; x++) {
      if (data[(y * width + x) * 4 + 3] <= 16) continue
      if (x < left) left = x
      if (x > right) right = x
    }
  }
  if (right < left) return box

  const pad = 8
  const cropLeft = Math.max(0, left - pad)
  const cropTop = Math.max(0, box.top - pad)
  const cropRight = Math.min(width, right + 1 + pad)
  const cropBottom = Math.min(height, markBottom + pad)
  return {
    left: cropLeft,
    top: cropTop,
    width: Math.max(1, cropRight - cropLeft),
    height: Math.max(1, cropBottom - cropTop),
  }
}

function opaqueBounds(data: Buffer, width: number, height: number) {
  let left = width
  let top = height
  let right = 0
  let bottom = 0
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] <= 16) continue
      if (x < left) left = x
      if (y < top) top = y
      if (x > right) right = x
      if (y > bottom) bottom = y
    }
  }
  if (right < left || bottom < top) return null
  return { left, top, width: right - left + 1, height: bottom - top + 1 }
}

function colorDistance(data: Buffer, index: number, color: Rgb) {
  return colorDistanceOf({ r: data[index], g: data[index + 1], b: data[index + 2] }, color)
}

function colorDistanceOf(pixel: Rgb, color: Rgb) {
  const dr = pixel.r - color.r
  const dg = pixel.g - color.g
  const db = pixel.b - color.b
  return Math.sqrt(dr * dr + dg * dg + db * db)
}

function mean(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length
}
