import Link from 'next/link'
import { requireUser } from '../../admin/auth'
import { StudioShell } from '../../components/studio/StudioShell'
import { collections, singletons } from '../../content/schema'

export default async function StudioDashboardPage() {
  const user = await requireUser()

  return (
    <StudioShell user={user}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">მთავარი</h1>
          <p className="text-ink-muted mt-2 text-sm">
            აირჩიე კოლექცია ან გლობალური გვერდი რედაქტირებისთვის.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">კონტენტი</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(collections).map(([key, definition]) => (
              <Link
                key={key}
                href={`/admin/${key}`}
                className="border-hairline hover:border-brand rounded-2xl border bg-surface px-4 py-4 transition"
              >
                <p className="font-medium">{definition.label}</p>
                <p className="text-ink-muted mt-1 text-xs">{definition.singular}</p>
              </Link>
            ))}
            <Link
              href="/admin/bookings"
              className="border-hairline hover:border-brand rounded-2xl border bg-surface px-4 py-4 transition"
            >
              <p className="font-medium">ჯავშნები</p>
              <p className="text-ink-muted mt-1 text-xs">ახალი მოთხოვნები ფორმიდან</p>
            </Link>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">გლობალური</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(singletons).map(([key, definition]) => (
              <Link
                key={key}
                href={`/admin/singletons/${key}`}
                className="border-hairline hover:border-brand rounded-2xl border bg-surface px-4 py-4 transition"
              >
                <p className="font-medium">{definition.label}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </StudioShell>
  )
}
