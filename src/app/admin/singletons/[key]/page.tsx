import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { requireUser } from '../../../../admin/auth'
import { StudioShell } from '../../../../components/studio/StudioShell'
import { SingletonEditor } from '../../../../components/studio/SingletonEditor'
import { singletons, type SingletonName } from '../../../../content/schema'
import { emptyShape } from '../../../../content/fields'
import { db, schema } from '../../../../db/client'

function isSingleton(value: string): value is SingletonName {
  return value in singletons
}

export default async function SingletonEditPage({
  params,
}: {
  params: Promise<{ key: string }>
}) {
  const user = await requireUser()
  const { key } = await params
  if (!isSingleton(key)) notFound()

  const definition = singletons[key]
  const rows = await db().select().from(schema.singletons).where(eq(schema.singletons.key, key)).limit(1)
  const data = (rows[0]?.data as Record<string, unknown> | undefined) ?? emptyShape(definition.fields)

  return (
    <StudioShell user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{definition.label}</h1>
          <p className="text-ink-muted mt-1 text-sm">ეს ტექსტები საიტზე ყველგან ჩანს.</p>
        </div>
        <SingletonEditor singletonKey={key} fields={definition.fields} initialData={data} />
      </div>
    </StudioShell>
  )
}
