import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'
import { faqField, seoField } from '../fields/seo'

/**
 * Editorial articles. This is the main lever for ranking on informational
 * searches ("how much does an implant cost in Tbilisi") that service pages
 * cannot target without diluting their own intent.
 */
export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Article', plural: 'Blog' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', '_status'],
  },
  access: { read: () => true },
  versions: { drafts: true },
  fields: [
    slugField(),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', required: true, localized: true },
            { name: 'excerpt', type: 'textarea', required: true, localized: true },
            { name: 'coverImage', type: 'upload', relationTo: 'media' },
            { name: 'body', type: 'richText', localized: true },
            faqField,
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    { name: 'author', type: 'relationship', relationTo: 'doctors', admin: { position: 'sidebar' } },
    {
      name: 'relatedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
  ],
}
