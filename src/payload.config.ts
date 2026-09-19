import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Services } from './collections/Services'
import { Doctors } from './collections/Doctors'
import { Cases } from './collections/Cases'
import { Testimonials } from './collections/Testimonials'
import { GalleryItems } from './collections/GalleryItems'
import { Posts } from './collections/Posts'
import { Pages } from './collections/Pages'
import { Bookings } from './collections/Bookings'

import { Settings } from './globals/Settings'
import { Theme } from './globals/Theme'
import { Navigation } from './globals/Navigation'
import { HomePage } from './globals/HomePage'

import { locales, defaultLocale, localeLabels } from './i18n/config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * SQLite keeps local development zero-setup; production points DATABASE_URI at
 * Neon. Both adapters are configured here so switching is only an env change.
 */
const databaseURI = process.env.DATABASE_URI || ''
const usePostgres = databaseURI.startsWith('postgres')

const db = usePostgres
  ? postgresAdapter({ pool: { connectionString: databaseURI } })
  : sqliteAdapter({
      client: { url: databaseURI || `file:${path.resolve(dirname, '../dreamdental.db')}` },
    })

/**
 * Media lives on Cloudflare R2 (S3-compatible) in production. Without R2
 * credentials Payload falls back to local disk, which is what we want in dev.
 */
const storagePlugins = process.env.S3_BUCKET
  ? [
      s3Storage({
        collections: { media: true },
        bucket: process.env.S3_BUCKET,
        // Vercel caps server request bodies at 4.5 MB, so large clinic photos
        // and videos are uploaded straight from the browser to R2.
        clientUploads: true,
        config: {
          region: process.env.S3_REGION || 'auto',
          endpoint: process.env.S3_ENDPOINT,
          forcePathStyle: true,
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
          },
        },
      }),
    ]
  : []

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL,
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: '- Dream Dental Group',
    },
  },
  collections: [
    Pages,
    Services,
    Doctors,
    Cases,
    Testimonials,
    GalleryItems,
    Posts,
    Bookings,
    Media,
    Users,
  ],
  globals: [HomePage, Settings, Navigation, Theme],
  localization: {
    locales: locales.map((code) => ({ code, label: localeLabels[code] })),
    defaultLocale,
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-only-insecure-secret-change-me',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db,
  sharp,
  plugins: [...storagePlugins],
})
