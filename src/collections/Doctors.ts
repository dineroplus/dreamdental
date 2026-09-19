import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'
import { seoField } from '../fields/seo'

export const Doctors: CollectionConfig = {
  slug: 'doctors',
  labels: { singular: 'Doctor', plural: 'Doctors' },
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'specialty', 'order'],
  },
  access: { read: () => true },
  versions: { drafts: true },
  fields: [
    slugField('name'),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Profile',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              localized: true,
              admin: { description: 'Written in the script of each language.' },
            },
            {
              name: 'specialty',
              type: 'text',
              required: true,
              localized: true,
              admin: { description: 'For example: Orthodontist, Implantologist.' },
            },
            {
              name: 'role',
              type: 'text',
              localized: true,
              admin: { description: 'For example: Chief Doctor. Leave empty for regular staff.' },
            },
            { name: 'photo', type: 'upload', relationTo: 'media' },
            { name: 'bio', type: 'richText', localized: true },
            {
              name: 'experienceSince',
              type: 'number',
              admin: { description: 'Year they started practising. Used to show years of experience.' },
            },
            {
              name: 'languages',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Georgian', value: 'ka' },
                { label: 'English', value: 'en' },
                { label: 'Russian', value: 'ru' },
                { label: 'German', value: 'de' },
                { label: 'Turkish', value: 'tr' },
                { label: 'Arabic', value: 'ar' },
              ],
            },
            {
              name: 'credentials',
              type: 'array',
              localized: true,
              label: 'Education and certifications',
              fields: [{ name: 'text', type: 'text', required: true }],
            },
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 100,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show on the home page.' },
    },
  ],
}
