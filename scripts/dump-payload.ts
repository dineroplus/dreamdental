/* Temporary: verify what the import wrote into the cms schema. */
import { and, eq } from 'drizzle-orm'
import { db, schema } from '../src/db/client'

const database = db()
const show = (label: string, value: unknown, limit = 900) =>
  console.log(`\n=== ${label} ===\n` + JSON.stringify(value, null, 2).slice(0, limit))

const [service] = await database
  .select()
  .from(schema.documents)
  .where(and(eq(schema.documents.type, 'services'), eq(schema.documents.slug, 'implants')))

const data = service.data as Record<string, any>
console.log('=== service.implants body (ka) ===')
console.log(data.body?.ka?.slice(0, 700))
show('service.highlights', data.highlights, 800)
show('service.faq[0]', data.faq?.[0], 700)
show('service.scalars', {
  slug: service.slug,
  order: service.order,
  featured: service.featured,
  status: service.status,
  icon: data.icon,
  priceFrom: data.priceFrom,
  duration: data.duration,
})

const [home] = await database.select().from(schema.singletons).where(eq(schema.singletons.key, 'home'))
const homeData = home.data as Record<string, any>
show('home.sections[1]', homeData.sections?.[1], 600)
show('home.heroBullets', homeData.heroBullets, 700)
show('home.advantages[0]', homeData.advantages?.[0], 500)

const [settings] = await database
  .select()
  .from(schema.singletons)
  .where(eq(schema.singletons.key, 'settings'))
show('settings', settings.data, 1100)

const [nav] = await database.select().from(schema.singletons).where(eq(schema.singletons.key, 'navigation'))
show('navigation.header[0]', (nav.data as any).header?.[0], 400)

const [doctor] = await database
  .select()
  .from(schema.documents)
  .where(eq(schema.documents.type, 'doctors'))
show('doctor', { slug: doctor.slug, data: doctor.data }, 800)

const mediaRows = await database.select().from(schema.media).limit(2)
show('media[0]', mediaRows[0], 700)

process.exit(0)
