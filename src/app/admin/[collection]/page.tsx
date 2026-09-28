import Link from 'next/link'
import { notFound } from 'next/navigation'
import { asc, eq, inArray } from 'drizzle-orm'
import { requireUser } from '../../../admin/auth'
import { titleFromStored } from '../../../admin/slug'
import { StudioShell } from '../../../components/studio/StudioShell'
import { StudioPageHeader } from '../../../components/studio/StudioPageHeader'
import { StudioIcon } from '../../../components/studio/StudioIcon'
import { CollectionList, type CollectionRow } from '../../../components/studio/CollectionList'
import { btnPrimary } from '../../../components/studio/ui'
import { collections, type CollectionName } from '../../../content/schema'
import { db, schema } from '../../../db/client'

function isCollection(value: string): value is CollectionName {
  return value in collections
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
  const docs = await db()
    .select()
    .from(schema.documents)
    .where(eq(schema.documents.type, collection))
    .orderBy(asc(schema.documents.order), asc(schema.documents.id))

  const uniqueIds = [
    ...new Set(
      docs
        .map((row) => thumbId((row.data ?? {}) as Record<string, unknown>))
        .filter((id): id is number => id != null),
    ),
  ]
  const mediaRows =
    uniqueIds.length > 0
      ? await db()
          .select({ id: schema.media.id, url: schema.media.url })
          .from(schema.media)
          .where(inArray(schema.media.id, uniqueIds))
      : []
  const mediaMap = new Map(
    mediaRows.map((row) => [
      row.id,
      /^(\/api\/media|\/media|https?:)/.test(row.url) ? row.url : `/api/media/file/${row.id}`,
    ]),
  )

  const rows: CollectionRow[] = docs.map((row) => {
    const data = (row.data ?? {}) as Record<string, unknown>
    return {
      id: row.id,
      title: titleFromStored(data[definition.titleKey]) || 'უსათაურო',
      image: mediaMap.get(thumbId(data) ?? -1) ?? null,
      status: row.status === 'published' ? 'published' : 'draft',
      featured: Boolean(row.featured),
      slug: row.slug,
    }
  })

  return (
    <StudioShell user={user}>
      <StudioPageHeader
        title={definition.label}
        subtitle={`${rows.length} ჩანაწერი · დააჭირე ბარათს შესაცვლელად`}
        actions={
          <Link href={`/admin/${collection}/new`} className={btnPrimary}>
            <StudioIcon name="plus" className="h-5 w-5" />
            ახალი {definition.singular}
          </Link>
        }
      />
      <CollectionList
        collection={collection}
        rows={rows}
        singular={definition.singular}
        showFeatured={Boolean(definition.featurable)}
      />
    </StudioShell>
  )
}
