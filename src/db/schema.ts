import {
  boolean,
  index,
  integer,
  jsonb,
  pgSchema,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import type { Localized } from '../content/fields'

/**
 * Everything lives in its own `cms` Postgres schema so the previous CMS tables
 * in `public` can be dropped independently once the migration is verified.
 *
 * Editable fields are kept in a single `data` JSON column. Only the values the
 * site filters or sorts by get real columns, which is why adding a content
 * field never needs a database migration.
 */
export const cms = pgSchema('cms')

export type Json = Record<string, unknown>

export const documents = cms.table(
  'documents',
  {
    id: serial('id').primaryKey(),
    /** Collection name from `src/content/schema.ts`, e.g. `services`. */
    type: text('type').notNull(),
    /** Collections without their own URL still get a generated slug. */
    slug: text('slug').notNull(),
    order: integer('order').notNull().default(100),
    featured: boolean('featured').notNull().default(false),
    status: text('status').$type<'draft' | 'published'>().notNull().default('published'),
    data: jsonb('data').$type<Json>().notNull().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    updatedBy: integer('updated_by'),
  },
  (table) => [
    uniqueIndex('documents_type_slug_key').on(table.type, table.slug),
    index('documents_type_order_idx').on(table.type, table.order),
  ],
)

export const singletons = cms.table('singletons', {
  /** Singleton name from `src/content/schema.ts`, e.g. `home`. */
  key: text('key').primaryKey(),
  data: jsonb('data').$type<Json>().notNull().default({}),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  updatedBy: integer('updated_by'),
})

/** One row per save, so any document can be rolled back to an earlier state. */
export const revisions = cms.table(
  'revisions',
  {
    id: serial('id').primaryKey(),
    /** Collection name, or singleton key when `documentId` is null. */
    target: text('target').notNull(),
    documentId: integer('document_id'),
    data: jsonb('data').$type<Json>().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    createdBy: integer('created_by'),
  },
  (table) => [index('revisions_target_idx').on(table.target, table.documentId, table.createdAt)],
)

export type MediaSize = { url: string; width: number; height: number }

export const media = cms.table(
  'media',
  {
    id: serial('id').primaryKey(),
    filename: text('filename').notNull(),
    url: text('url').notNull(),
    mimeType: text('mime_type').notNull(),
    width: integer('width'),
    height: integer('height'),
    filesize: integer('filesize'),
    /**
     * Base64 file body. Vercel’s filesystem is ephemeral, so clinic uploads
     * live in Postgres and are served from `/api/media/file/[id]`.
     */
    blob: text('blob'),
    /** Resized variants keyed by name: thumb, card, wide, hero. */
    sizes: jsonb('sizes').$type<Record<string, MediaSize>>().notNull().default({}),
    alt: jsonb('alt').$type<Localized<string>>().notNull().default({}),
    caption: jsonb('caption').$type<Localized<string>>().notNull().default({}),
    credit: text('credit'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('media_filename_key').on(table.filename)],
)

export const users = cms.table(
  'users',
  {
    id: serial('id').primaryKey(),
    email: text('email').notNull(),
    name: text('name'),
    role: text('role').$type<'admin' | 'editor'>().notNull().default('editor'),
    /** scrypt hash produced by `src/admin/password.ts`. */
    passwordHash: text('password_hash').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  },
  (table) => [uniqueIndex('users_email_key').on(table.email)],
)

export const bookings = cms.table(
  'bookings',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    phone: text('phone').notNull(),
    email: text('email'),
    message: text('message'),
    /** Stored as a slug rather than an id so deleting a service keeps history. */
    serviceSlug: text('service_slug'),
    locale: text('locale'),
    sourcePath: text('source_path'),
    status: text('status').$type<'new' | 'contacted' | 'booked' | 'closed'>().notNull().default('new'),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('bookings_status_idx').on(table.status, table.createdAt)],
)
