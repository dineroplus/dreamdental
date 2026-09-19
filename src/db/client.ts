import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

/**
 * A single pool per process, created on first query rather than on import so a
 * build without database access still succeeds. Next reloads modules on every
 * edit in dev, so both the pool and the Drizzle instance are parked on
 * `globalThis` to avoid leaking a connection per reload.
 */
const globalForDb = globalThis as unknown as {
  dreamPool?: Pool
  dreamDb?: NodePgDatabase<typeof schema>
}

export function db(): NodePgDatabase<typeof schema> {
  if (!globalForDb.dreamDb) {
    const connectionString = process.env.DATABASE_URI || process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error('DATABASE_URI is not set - content cannot be loaded without it.')
    }
    globalForDb.dreamPool ??= new Pool({ connectionString, max: 4 })
    globalForDb.dreamDb = drizzle(globalForDb.dreamPool, { schema })
  }
  return globalForDb.dreamDb
}

export { schema }
