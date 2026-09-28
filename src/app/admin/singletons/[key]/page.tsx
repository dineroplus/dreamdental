import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { requireUser } from '../../../../admin/auth'
import { StudioShell } from '../../../../components/studio/StudioShell'
import { SingletonEditor } from '../../../../components/studio/SingletonEditor'
import { StudioPageHeader } from '../../../../components/studio/StudioPageHeader'
import { singletons, type SingletonName } from '../../../../content/schema'
import { emptyShape } from '../../../../content/fields'
import { db, schema } from '../../../../db/client'

const SUBTITLES: Record<SingletonName, string> = {
  home: 'მთავარი გვერდის სათაური, ფოტო და სექციების რიგი.',
  settings: 'ტელეფონი, მისამართი, სამუშაო საათები და სოციალური ქსელები. ჩანს საიტზე ყველგან.',
  navigation: 'ზედა და ქვედა მენიუს ბმულები.',
  theme: 'საიტის ფერები.',
}

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
      <StudioPageHeader
        back={{ href: '/admin', label: 'მთავარი' }}
        title={definition.label}
        subtitle={SUBTITLES[key]}
      />
      <SingletonEditor singletonKey={key} fields={definition.fields} initialData={data} />
    </StudioShell>
  )
}
