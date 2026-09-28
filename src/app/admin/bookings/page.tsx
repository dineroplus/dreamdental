import Link from 'next/link'
import { count, desc, eq } from 'drizzle-orm'
import { requireUser } from '../../../admin/auth'
import { serviceNameMap } from '../../../admin/serviceNames'
import { StudioShell } from '../../../components/studio/StudioShell'
import { StudioPageHeader } from '../../../components/studio/StudioPageHeader'
import { BookingCard, type BookingView } from '../../../components/studio/BookingCard'
import { BOOKING_STATUSES, isBookingStatus, type BookingStatus } from '../../../components/studio/bookingStatus'
import { card } from '../../../components/studio/ui'
import { db, schema } from '../../../db/client'

type Tab = BookingStatus | 'all'

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const user = await requireUser()
  const { status: rawStatus } = await searchParams
  const tab: Tab = rawStatus === 'all' ? 'all' : isBookingStatus(rawStatus) ? rawStatus : 'new'

  const baseQuery = db().select().from(schema.bookings)
  const [bookings, grouped, serviceNames] = await Promise.all([
    (tab === 'all' ? baseQuery : baseQuery.where(eq(schema.bookings.status, tab)))
      .orderBy(desc(schema.bookings.createdAt))
      .limit(200),
    db()
      .select({ status: schema.bookings.status, value: count() })
      .from(schema.bookings)
      .groupBy(schema.bookings.status),
    serviceNameMap(),
  ])

  const counts: Record<Tab, number> = { all: 0, new: 0, contacted: 0, booked: 0, closed: 0 }
  for (const row of grouped) {
    const value = Number(row.value) || 0
    counts.all += value
    if (isBookingStatus(row.status)) counts[row.status] = value
  }

  const tabs: { value: Tab; label: string }[] = [...BOOKING_STATUSES, { value: 'all', label: 'ყველა' }]

  const views: BookingView[] = bookings.map((booking) => ({
    id: booking.id,
    name: booking.name,
    phone: booking.phone,
    email: booking.email,
    service: booking.serviceSlug ? (serviceNames[booking.serviceSlug] ?? booking.serviceSlug) : null,
    message: booking.message,
    notes: booking.notes,
    status: isBookingStatus(booking.status) ? booking.status : 'new',
    createdAt: booking.createdAt.toISOString(),
  }))

  return (
    <StudioShell user={user}>
      <StudioPageHeader
        title="ჯავშნები"
        subtitle="საიტის ფორმიდან შემოსული მოთხოვნები. სტატუსი ინახება დაჭერისთანავე."
      />

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="სტატუსის ფილტრი">
        {tabs.map((item) => {
          const active = item.value === tab
          return (
            <Link
              key={item.value}
              href={item.value === 'new' ? '/admin/bookings' : `/admin/bookings?status=${item.value}`}
              className={
                active
                  ? 'bg-ink inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-white'
                  : 'border-hairline text-ink hover:border-brand inline-flex min-h-11 items-center gap-2 rounded-xl border bg-surface px-4 text-sm font-medium'
              }
            >
              {item.label}
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  active ? 'bg-white/20' : item.value === 'new' && counts.new > 0 ? 'bg-accent text-white' : 'bg-canvas'
                }`}
              >
                {counts[item.value]}
              </span>
            </Link>
          )
        })}
      </nav>

      {views.length === 0 ? (
        <div className={`${card} text-ink-muted px-6 py-14 text-center text-base`}>
          {tab === 'new' ? 'ახალი ჯავშნები არ არის. ყველაფერი დამუშავებულია.' : 'ამ სტატუსით ჯავშნები არ არის.'}
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {views.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </StudioShell>
  )
}
