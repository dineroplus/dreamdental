import { and, eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { requireUser } from '../../../../admin/auth'
import { newDocumentDefaults } from '../../../../admin/actions'
import { StudioShell } from '../../../../components/studio/StudioShell'
import { DocumentEditor } from '../../../../components/studio/DocumentEditor'
import { collections, type CollectionName } from '../../../../content/schema'
import { db, schema } from '../../../../db/client'

function isCollection(value: string): value is CollectionName {
  return value in collections
}

export default async function DocumentEditPage({
  params,
}: {
  params: Promise<{ collection: string; id: string }>
}) {
  const user = await requireUser()
  const { collection, id } = await params
  if (!isCollection(collection)) notFound()

  const definition = collections[collection]
  const isNew = id === 'new'

  let data: Record<string, unknown>
  let meta: {
    slug: string
    order: number
    featured: boolean
    status: 'draft' | 'published'
  } = {
    slug: `new-${Date.now()}`,
    order: 100,
    featured: false,
    status: 'draft',
  }
  let documentId: number | null = null

  if (isNew) {
    const defaults = await newDocumentDefaults(collection)
    data = defaults.data
    meta = defaults.meta
  } else {
    const numericId = Number(id)
    if (!Number.isFinite(numericId)) notFound()

    const rows = await db()
      .select()
      .from(schema.documents)
      .where(and(eq(schema.documents.id, numericId), eq(schema.documents.type, collection)))
      .limit(1)

    const row = rows[0]
    if (!row) notFound()

    documentId = row.id
    data = (row.data ?? {}) as Record<string, unknown>
    meta = {
      slug: row.slug,
      order: row.order,
      featured: row.featured,
      status: row.status,
    }
  }

  return (
    <StudioShell user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {isNew ? `ახალი ${definition.singular}` : `რედაქტირება · ${definition.singular}`}
          </h1>
        </div>

        <DocumentEditor
          type={collection}
          id={documentId}
          fields={definition.fields}
          initialData={data}
          initialMeta={meta}
          showSlug={definition.slug}
          showOrder={definition.ordered}
          showFeatured={definition.featurable}
          singular={definition.singular}
        />
      </div>
    </StudioShell>
  )
}
