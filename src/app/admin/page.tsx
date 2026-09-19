import Link from 'next/link'
import { count, eq } from 'drizzle-orm'
import { requireUser } from '../../admin/auth'
import { StudioShell } from '../../components/studio/StudioShell'
import { db, schema } from '../../db/client'

const TILES = [
  { href: '/admin/bookings', title: 'ჯავშნები', text: 'ახალი მოთხოვნები ფორმიდან' },
  { href: '/admin/doctors', title: 'ექიმები', text: 'ფოტოები, სპეციალობა, ბიოგრაფია' },
  { href: '/admin/services', title: 'სერვისები', text: 'ფასები და აღწერები' },
  { href: '/admin/gallery', title: 'გალერეა', text: 'კლინიკის სურათები' },
  { href: '/admin/testimonials', title: 'შეფასებები', text: 'პაციენტების გამოხმაურება' },
  { href: '/admin/cases', title: 'მდე / შემდეგ', text: 'მკურნალობის ფოტოები' },
  { href: '/admin/singletons/home', title: 'მთავარი გვერდი', text: 'სათაური და სექციები' },
  { href: '/admin/singletons/settings', title: 'კლინიკის მონაცემები', text: 'ტელეფონი, მისამართი, საათები' },
]

export default async function StudioDashboardPage() {
  const user = await requireUser()
  const [{ value: newBookings }] = await db()
    .select({ value: count() })
    .from(schema.bookings)
    .where(eq(schema.bookings.status, 'new'))

  return (
    <StudioShell user={user}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">გამარჯობა</h1>
          <p className="text-ink-muted mt-2 text-sm">აირჩიე, რისი შეცვლა გინდა საიტზე.</p>
        </div>

        {Number(newBookings) > 0 ? (
          <Link
            href="/admin/bookings"
            className="bg-brand-soft text-brand block rounded-2xl px-5 py-4 text-sm font-medium"
          >
            {Number(newBookings)} ახალი ჯავშანი — ნახვა
          </Link>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {TILES.map((tile) => (
            <Link
              key={tile.href}
              href={tile.href}
              className="border-hairline hover:border-brand rounded-2xl border bg-surface px-5 py-5 transition"
            >
              <p className="text-base font-semibold">{tile.title}</p>
              <p className="text-ink-muted mt-1 text-sm">{tile.text}</p>
            </Link>
          ))}
        </div>
      </div>
    </StudioShell>
  )
}
