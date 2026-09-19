import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

/**
 * Public endpoint behind the booking form. The Bookings collection blocks
 * `create` for everyone, so this route writes with `overrideAccess` after
 * validating the payload itself.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''

  if (name.length < 2 || name.length > 120) {
    return NextResponse.json({ error: 'invalid name' }, { status: 400 })
  }
  if (!/^[\d\s+()-]{6,24}$/.test(phone)) {
    return NextResponse.json({ error: 'invalid phone' }, { status: 400 })
  }

  const email = typeof body.email === 'string' && body.email.includes('@') ? body.email.trim() : undefined
  const message = typeof body.message === 'string' ? body.message.slice(0, 2000) : undefined
  const locale = typeof body.locale === 'string' ? body.locale.slice(0, 5) : undefined
  const sourcePath = typeof body.sourcePath === 'string' ? body.sourcePath.slice(0, 300) : undefined
  const serviceId = body.service ? Number(body.service) : undefined

  try {
    const payload = await getPayload({ config: configPromise })
    await payload.create({
      collection: 'bookings',
      overrideAccess: true,
      data: {
        name,
        phone,
        email,
        message,
        locale,
        sourcePath,
        status: 'new',
        ...(serviceId && Number.isFinite(serviceId) ? { service: serviceId } : {}),
      },
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'could not save' }, { status: 500 })
  }
}
