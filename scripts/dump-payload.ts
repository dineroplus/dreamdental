/* Temporary: print the shape Payload returns with `locale: 'all'`. */
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

const service = await payload.find({
  collection: 'services',
  locale: 'all',
  depth: 0,
  limit: 1,
})
console.log('=== SERVICE ===')
console.log(JSON.stringify(service.docs[0], null, 2).slice(0, 4000))

const doctor = await payload.find({ collection: 'doctors', locale: 'all', depth: 0, limit: 1 })
console.log('\n=== DOCTOR ===')
console.log(JSON.stringify(doctor.docs[0], null, 2).slice(0, 2500))

const home = await payload.findGlobal({ slug: 'home', locale: 'all', depth: 0 })
console.log('\n=== HOME ===')
console.log(JSON.stringify(home, null, 2).slice(0, 3000))

const media = await payload.find({ collection: 'media', locale: 'all', depth: 0, limit: 2 })
console.log('\n=== MEDIA ===')
console.log(JSON.stringify(media.docs, null, 2).slice(0, 2000))
console.log('\nmedia total:', media.totalDocs)

process.exit(0)
