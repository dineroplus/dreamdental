import Link from 'next/link'
import { logoutAction } from '../../admin/actions'
import { collections, singletons } from '../../content/schema'
import type { SessionUser } from '../../admin/session'

export function StudioShell({
  user,
  children,
}: {
  user: SessionUser
  children: React.ReactNode
}) {
  return (
    <div className="bg-canvas text-ink min-h-screen lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="border-hairline border-b lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-b-0">
        <div className="p-5">
          <p className="text-brand text-xs font-semibold tracking-wide uppercase">Dream Studio</p>
          <p className="text-ink mt-1 text-sm font-medium">{user.name || user.email}</p>
        </div>

        <nav className="space-y-6 px-3 pb-6 text-sm">
          <div>
            <Link href="/studio" className="hover:bg-brand-soft block rounded-xl px-3 py-2">
              მთავარი
            </Link>
            <Link href="/studio/bookings" className="hover:bg-brand-soft block rounded-xl px-3 py-2">
              ჯავშნები
            </Link>
          </div>

          <div>
            <p className="text-ink-muted px-3 pb-1 text-xs tracking-wide uppercase">კონტენტი</p>
            {Object.entries(collections).map(([key, definition]) => (
              <Link
                key={key}
                href={`/studio/${key}`}
                className="hover:bg-brand-soft block rounded-xl px-3 py-2"
              >
                {definition.label}
              </Link>
            ))}
          </div>

          <div>
            <p className="text-ink-muted px-3 pb-1 text-xs tracking-wide uppercase">გლობალური</p>
            {Object.entries(singletons).map(([key, definition]) => (
              <Link
                key={key}
                href={`/studio/singletons/${key}`}
                className="hover:bg-brand-soft block rounded-xl px-3 py-2"
              >
                {definition.label}
              </Link>
            ))}
          </div>

          <form action={logoutAction}>
            <button type="submit" className="text-ink-muted hover:text-brand px-3 py-2 text-left">
              გასვლა
            </button>
          </form>
        </nav>
      </aside>

      <main className="min-w-0 p-5 md:p-8">{children}</main>
    </div>
  )
}
