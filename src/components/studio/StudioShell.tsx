import { count, eq } from 'drizzle-orm'
import { db, schema } from '../../db/client'
import { StudioNav } from './StudioNav'
import type { SessionUser } from '../../admin/session'

export async function StudioShell({
  user,
  children,
}: {
  user: SessionUser
  children: React.ReactNode
}) {
  const [{ value: newBookings }] = await db()
    .select({ value: count() })
    .from(schema.bookings)
    .where(eq(schema.bookings.status, 'new'))

  return (
    <div className="bg-canvas text-ink min-h-screen lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <StudioNav userName={user.name || user.email} newBookings={Number(newBookings) || 0} />
      <main className="min-w-0 p-5 md:p-8">{children}</main>
    </div>
  )
}
