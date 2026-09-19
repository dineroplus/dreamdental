import Link from 'next/link'
import { notFound } from 'next/navigation'
import { asc, eq } from 'drizzle-orm'
import { requireUser } from '../../../admin/auth'
import { StudioShell } from '../../../components/studio/StudioShell'
import { collections, type CollectionName } from '../../../content/schema'
import { text } from '../../../content/fields'
import { db, schema } from '../../../db/client'
import { defaultLocale } from '../../../i18n/config'

function isCollection(value: string): value is CollectionName {
  return value in collections
}

function titleOf(row: typeof schema.documents.$inferSelect, titleKey: string): string {
  const raw = (row.data as Record<string, unknown>)[titleKey]
  if (typeof raw === 'string') return raw
  if (raw && typeof raw === 'object') {
    return text(raw as Parameters<typeof text>[0], defaultLocale) || row.slug
  }
  return row.slug
}

export default async function CollectionListPage({
  params,
}: {
  params: Promise<{ collection: string }>
}) {
  const user = await requireUser()
  const { collection } = await params
  if (!isCollection(collection)) notFound()

  const definition = collections[collection]
  const rows = await db()
    .select()
    .from(schema.documents)
    .where(eq(schema.documents.type, collection))
    .orderBy(asc(schema.documents.order), asc(schema.documents.id))

  return (
    <StudioShell user={user}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{definition.label}</h1>
            <p className="text-ink-muted mt-1 text-sm">{rows.length} ჩანაწერი</p>
          </div>
          <Link
            href={`/studio/${collection}/new`}
            className="bg-brand rounded-full px-4 py-2 text-sm font-semibold text-white"
          >
            ახალი {definition.singular}
          </Link>
        </div>

        <div className="border-hairline overflow-hidden rounded-2xl border">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-soft/40 text-ink-muted text-xs uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">სათაური</th>
                <th className="px-4 py-3 font-medium">სტატუსი</th>
                <th className="px-4 py-3 font-medium">რიგი</th>
              </tr>
            </thead>
            <tbody className="divide-hairline divide-y">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-brand-soft/20">
                  <td className="px-4 py-3">
                    <Link href={`/studio/${collection}/${row.id}`} className="font-medium">
                      {titleOf(row, definition.titleKey)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-xs uppercase">{row.status}</td>
                  <td className="px-4 py-3">{row.order}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </StudioShell>
  )
}
