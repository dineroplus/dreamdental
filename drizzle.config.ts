import { defineConfig } from 'drizzle-kit'

/**
 * `schemaFilter` keeps drizzle-kit scoped to the `cms` schema. Without it the
 * diff would also see the previous CMS tables in `public` and offer to drop
 * them, which must stay a deliberate, separate step.
 */
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  schemaFilter: ['cms'],
  dbCredentials: { url: process.env.DATABASE_URI ?? '' },
})
