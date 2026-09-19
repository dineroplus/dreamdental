import { NextResponse } from 'next/server'
import { db, schema } from '../../../db/client'

/**
 * Public endpoint behind the booking form. Writes into `cms.bookings` so Dream
 * Studio can manage them without going through Payload.
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

  const email = typeof body.email === 'string' && body.email.includes('@') ? body.email.trim() : null
  const message = typeof body.message === 'string' ? body.message.slice(0, 2000) : null
  const locale = typeof body.locale === 'string' ? body.locale.slice(0, 5) : null
  const sourcePath = typeof body.sourcePath === 'string' ? body.sourcePath.slice(0, 300) : null

  // Accept either a slug string or a legacy numeric id (ignored — slug only).
  let serviceSlug: string | null = null
  if (typeof body.service === 'string' && body.service.trim()) {
    serviceSlug = body.service.trim().slice(0, 120)
  }

  try {
    await db().insert(schema.bookings).values({
      name,
      phone,
      email,
      message,
      locale,
      sourcePath,
      serviceSlug,
      status: 'new',
    })

    // Fire-and-forget notify. Booking success must not depend on email delivery.
    void notifyBooking({ name, phone, email, message, serviceSlug, locale, sourcePath })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'could not save' }, { status: 500 })
  }
}

async function notifyBooking(payload: {
  name: string
  phone: string
  email: string | null
  message: string | null
  serviceSlug: string | null
  locale: string | null
  sourcePath: string | null
}) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.BOOKING_NOTIFY_TO
  if (!apiKey || !to) return

  const from = process.env.BOOKING_NOTIFY_FROM || 'Dream Dental <onboarding@resend.dev>'
  const lines = [
    `სახელი: ${payload.name}`,
    `ტელეფონი: ${payload.phone}`,
    payload.email ? `ელფოსტა: ${payload.email}` : null,
    payload.serviceSlug ? `სერვისი: ${payload.serviceSlug}` : null,
    payload.locale ? `ენა: ${payload.locale}` : null,
    payload.sourcePath ? `გვერდი: ${payload.sourcePath}` : null,
    payload.message ? `შეტყობინება:\n${payload.message}` : null,
  ].filter(Boolean)

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `ახალი ჯავშანი — ${payload.name}`,
        text: lines.join('\n'),
      }),
    })
  } catch {
    // Notification failures are logged nowhere on purpose — the booking row is
    // already saved and Studio will show it regardless.
  }
}
