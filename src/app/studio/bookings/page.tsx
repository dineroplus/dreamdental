import { desc } from 'drizzle-orm'
import { requireUser } from '../../../admin/auth'
import { updateBookingStatus } from '../../../admin/actions'
import { StudioShell } from '../../../components/studio/StudioShell'
import { db, schema } from '../../../db/client'

const STATUSES = ['new', 'contacted', 'booked', 'closed'] as const

export default async function BookingsPage() {
  const user = await requireUser()
  const bookings = await db()
    .select()
    .from(schema.bookings)
    .orderBy(desc(schema.bookings.createdAt))
    .limit(200)

  return (
    <StudioShell user={user}>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">ჯავშნები</h1>
        <p className="text-ink-muted text-sm">ფორმიდან შემოსული მოთხოვნები.</p>
      </div>

      <div className="space-y-3">
        {bookings.length === 0 ? (
          <p className="text-ink-muted text-sm">ჯავშნები ჯერ არ არის.</p>
        ) : (
          bookings.map((booking) => (
            <article key={booking.id} className="card space-y-3 p-5 text-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold">{booking.name}</p>
                  <p className="text-ink-muted">
                    {booking.phone}
                    {booking.email ? ` · ${booking.email}` : ''}
                  </p>
                  {booking.serviceSlug ? (
                    <p className="text-ink-muted mt-1">სერვისი: {booking.serviceSlug}</p>
                  ) : null}
                </div>
                <time className="text-ink-muted text-xs">
                  {booking.createdAt.toLocaleString('ka-GE')}
                </time>
              </div>

              {booking.message ? <p className="text-ink-muted">{booking.message}</p> : null}

              <form
                action={async (formData) => {
                  'use server'
                  const status = String(formData.get('status')) as (typeof STATUSES)[number]
                  const notes = String(formData.get('notes') ?? '')
                  await updateBookingStatus(booking.id, status, notes)
                }}
                className="flex flex-wrap items-end gap-3"
              >
                <label className="space-y-1">
                  <span className="text-xs">სტატუსი</span>
                  <select
                    name="status"
                    defaultValue={booking.status}
                    className="border-hairline block rounded-xl border bg-surface px-3 py-2"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="min-w-[200px] flex-1 space-y-1">
                  <span className="text-xs">შენიშვნა</span>
                  <input
                    name="notes"
                    defaultValue={booking.notes ?? ''}
                    className="border-hairline w-full rounded-xl border bg-surface px-3 py-2"
                  />
                </label>
                <button
                  type="submit"
                  className="bg-brand rounded-full px-4 py-2 text-xs font-semibold text-white"
                >
                  განახლება
                </button>
              </form>
            </article>
          ))
        )}
      </div>
    </StudioShell>
  )
}
