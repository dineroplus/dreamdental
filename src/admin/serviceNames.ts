import { eq } from 'drizzle-orm'
import { db, schema } from '../db/client'
import { titleFromStored } from './slug'

/** Service slug → Georgian title, so bookings show "იმპლანტაცია" instead of `implants`. */
export async function serviceNameMap(): Promise<Record<string, string>> {
  const rows = await db()
    .select({ slug: schema.documents.slug, data: schema.documents.data })
    .from(schema.documents)
    .where(eq(schema.documents.type, 'services'))

  const map: Record<string, string> = {}
  for (const row of rows) {
    const data = (row.data ?? {}) as Record<string, unknown>
    map[row.slug] = titleFromStored(data.shortTitle) || titleFromStored(data.title) || row.slug
  }
  return map
}

/** Clinic day boundary: Georgia is UTC+4 all year. */
export function startOfClinicDay(now = new Date()): Date {
  const offset = 4 * 60 * 60 * 1000
  const local = new Date(now.getTime() + offset)
  local.setUTCHours(0, 0, 0, 0)
  return new Date(local.getTime() - offset)
}
