import Link from 'next/link'
import { and, count, desc, eq, gte } from 'drizzle-orm'
import { requireUser } from '../../admin/auth'
import { serviceNameMap, startOfClinicDay } from '../../admin/serviceNames'
import { StudioShell } from '../../components/studio/StudioShell'
import { StudioPageHeader } from '../../components/studio/StudioPageHeader'
import { StudioIcon, type StudioIconName } from '../../components/studio/StudioIcon'
import { badge, btnSecondary, card } from '../../components/studio/ui'
import { phoneDigits, relativeTime } from '../../components/studio/time'
import { db, schema } from '../../db/client'

const QUICK: { href: string; label: string; icon: StudioIconName; external?: boolean }[] = [
  { href: '/admin/doctors/new', label: 'ახალი ექიმი', icon: 'plus' },
  { href: '/admin/singletons/home', label: 'მთავარი გვერდის შეცვლა', icon: 'home' },
  { href: '/admin/singletons/settings', label: 'კლინიკის მონაცემები', icon: 'settings' },
  { href: '/ka', label: 'საიტის ნახვა', icon: 'external', external: true },
]

async function publishedCount(type: string) {
  const [{ value }] = await db()
    .select({ value: count() })
    .from(schema.documents)
    .where(and(eq(schema.documents.type, type), eq(schema.documents.status, 'published')))
  return Number(value) || 0
}

export default async function StudioDashboardPage() {
  const user = await requireUser()

  const [[{ value: newBookings }], [{ value: todayBookings }], doctors, services, latest, serviceNames] =
    await Promise.all([
      db().select({ value: count() }).from(schema.bookings).where(eq(schema.bookings.status, 'new')),
      db()
        .select({ value: count() })
        .from(schema.bookings)
        .where(gte(schema.bookings.createdAt, startOfClinicDay())),
      publishedCount('doctors'),
      publishedCount('services'),
      db().select().from(schema.bookings).orderBy(desc(schema.bookings.createdAt)).limit(5),
      serviceNameMap(),
    ])

  const stats: { label: string; value: number; href: string; icon: StudioIconName; highlight?: boolean }[] = [
    { label: 'ახალი ჯავშნები', value: Number(newBookings) || 0, href: '/admin/bookings', icon: 'inbox', highlight: true },
    { label: 'დღეს შემოვიდა', value: Number(todayBookings) || 0, href: '/admin/bookings?status=all', icon: 'calendar' },
    { label: 'ექიმი საიტზე', value: doctors, href: '/admin/doctors', icon: 'user' },
    { label: 'სერვისი საიტზე', value: services, href: '/admin/services', icon: 'list' },
  ]

  const firstName = (user.name || '').split(' ')[0]
  const now = new Date()

  return (
    <StudioShell user={user}>
      <StudioPageHeader
        title={firstName ? `გამარჯობა, ${firstName}` : 'გამარჯობა'}
        subtitle="აქ ჩანს ახალი ჯავშნები და ყველაზე ხშირი მოქმედებები."
      />

      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className={`${card} hover:border-brand group p-5 transition ${
                stat.highlight && stat.value > 0 ? 'ring-accent/40 ring-2' : ''
              }`}
            >
              <span
                className={`grid h-10 w-10 place-items-center rounded-xl ${
                  stat.highlight && stat.value > 0 ? 'bg-accent text-white' : 'bg-brand-soft text-brand'
                }`}
              >
                <StudioIcon name={stat.icon} />
              </span>
              <p className="text-ink mt-4 text-3xl font-semibold tabular-nums">{stat.value}</p>
              <p className="text-ink-muted mt-1 text-sm">{stat.label}</p>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <section className={`${card} p-5`}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">ბოლო ჯავშნები</h2>
              <Link href="/admin/bookings?status=all" className="text-brand text-sm font-semibold">
                ყველა →
              </Link>
            </div>

            {latest.length === 0 ? (
              <p className="text-ink-muted py-6 text-center text-base">ჯავშნები ჯერ არ არის.</p>
            ) : (
              <ul className="divide-hairline divide-y">
                {latest.map((booking) => (
                  <li key={booking.id} className="flex flex-wrap items-center gap-3 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-center gap-2 text-base font-semibold">
                        {booking.name}
                        {booking.status === 'new' ? <span className={badge('new')}>ახალი</span> : null}
                      </p>
                      <p className="text-ink-muted mt-0.5 text-sm">
                        {booking.serviceSlug ? `${serviceNames[booking.serviceSlug] ?? booking.serviceSlug} · ` : ''}
                        {relativeTime(booking.createdAt, now)}
                      </p>
                    </div>
                    <a href={`tel:${phoneDigits(booking.phone)}`} className={btnSecondary}>
                      <StudioIcon name="phone" className="h-4 w-4" />
                      დარეკვა
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className={`${card} p-5`}>
            <h2 className="mb-4 text-lg font-semibold">სწრაფი მოქმედებები</h2>
            <div className="space-y-2">
              {QUICK.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className="border-hairline hover:border-brand hover:text-brand flex min-h-12 items-center gap-3 rounded-xl border px-4 text-base font-medium transition"
                >
                  <span className="bg-brand-soft text-brand grid h-8 w-8 place-items-center rounded-lg">
                    <StudioIcon name={item.icon} className="h-4 w-4" />
                  </span>
                  {item.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </StudioShell>
  )
}
