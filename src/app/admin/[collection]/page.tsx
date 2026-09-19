import Link from 'next/link'
import { notFound } from 'next/navigation'
import { asc, eq, inArray } from 'drizzle-orm'
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
    return text(raw as Parameters<typeof text>[0], defaultLocale) || 'უსათაურო'
  }
  return 'უსათაურო'
}

function thumbId(data: Record<string, unknown>): number | null {
  for (const key of ['photo', 'image', 'coverImage', 'heroImage', 'beforeImage']) {
    const value = data[key]
    if (typeof value === 'number') return value
  }
  return null
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

  const mediaIds = rows
    .map((row) => thumbId((row.data ?? {}) as Record<string, unknown>))
    .filter((id): id is number => id != null)

  const uniqueIds = [...new Set(mediaIds)]
  const mediaRows =
    uniqueIds.length > 0
      ? await db()
          .select({ id: schema.media.id, url: schema.media.url })
          .from(schema.media)
          .where(inArray(schema.media.id, uniqueIds))
      : []
  const mediaMap = new Map(mediaRows.map((row) => [row.id, row.url]))

  return (
    <StudioShell user={user}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{definition.label}</h1>
            <p className="text-ink-muted mt-1 text-sm">{rows.length} ჩანაწერი</p>
          </div>
          <Link
            href={`/admin/${collection}/new`}
            className="bg-brand rounded-full px-4 py-2 text-sm font-semibold text-white"
          >
            ახალი {definition.singular}
          </Link>
        </div>

        {rows.length === 0 ? (
          <p className="text-ink-muted text-sm">ჯერ არაფერია. დაამატე პირველი {definition.singular}.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {rows.map((row) => {
              const data = (row.data ?? {}) as Record<string, unknown>
              const image = mediaMap.get(thumbId(data) ?? -1)
              return (
                <Link
                  key={row.id}
                  href={`/admin/${collection}/${row.id}`}
                  className="border-hairline hover:border-brand flex gap-3 overflow-hidden rounded-2xl border bg-surface p-3 transition"
                >
                  <div className="bg-brand-soft h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                    {image ? (
                      <img src={image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="text-brand/40 grid h-full place-items-center text-lg font-semibold">
                        {titleOf(row, definition.titleKey).charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 py-1">
                    <p className="truncate font-medium">{titleOf(row, definition.titleKey)}</p>
                    <p className="text-ink-muted mt-1 text-xs">
                      {row.status === 'published' ? 'საიტზე ჩანს' : 'დამალულია'}
                      {row.featured ? ' · მთავარზე' : ''}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </StudioShell>
  )
}
