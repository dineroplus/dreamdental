import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db, schema } from '../../../../../db/client'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

export const runtime = 'nodejs'

/**
 * Serves clinic uploads stored in Postgres. Existing `/media/*.webp` files
 * stay on disk; new Studio uploads live in `cms.media.blob`.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id)
  if (!Number.isFinite(id) || id <= 0) {
    return new NextResponse('Not found', { status: 404 })
  }

  const rows = await db()
    .select({
      blob: schema.media.blob,
      mimeType: schema.media.mimeType,
      filename: schema.media.filename,
      url: schema.media.url,
    })
    .from(schema.media)
    .where(eq(schema.media.id, id))
    .limit(1)

  const row = rows[0]
  if (!row) return new NextResponse('Not found', { status: 404 })

  if (row.blob) {
    return new NextResponse(Buffer.from(row.blob, 'base64'), {
      headers: {
        'Content-Type': row.mimeType || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Disposition': `inline; filename="${row.filename}"`,
      },
    })
  }

  if (row.url.startsWith('/media/') || row.url.startsWith('/uploads/') || row.url.startsWith('/team/')) {
    try {
      const file = await readFile(path.join(process.cwd(), 'public', row.url))
      return new NextResponse(file, {
        headers: {
          'Content-Type': row.mimeType || 'application/octet-stream',
          'Cache-Control': 'public, max-age=86400',
        },
      })
    } catch {
      return new NextResponse('Not found', { status: 404 })
    }
  }

  if (/^https?:\/\//i.test(row.url)) {
    return NextResponse.redirect(row.url)
  }

  return new NextResponse('Not found', { status: 404 })
}
