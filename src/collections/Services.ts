import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'
import { faqField, seoField } from '../fields/seo'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Service', plural: 'Services' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'featured', 'order'],
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
            {
              name: 'shortTitle',
              type: 'text',
              localized: true,
              admin: { description: 'Used in navigation and cards when the full title is long.' },
            },
            {
              name: 'excerpt',
              type: 'textarea',
              localized: true,
              required: true,
              admin: { description: 'One or two sentences shown on cards and in search results.' },
            },
            {
              name: 'body',
              type: 'richText',
              localized: true,
              admin: {
                description:
                  'The main article. Longer, genuinely useful copy ranks better - aim for 600+ words per language.',
              },
            },
            {
              name: 'highlights',
              type: 'array',
              localized: true,
              label: 'Key points',
              fields: [
                { name: 'text', type: 'text', required: true },
                {
                  name: 'icon',
                  type: 'select',
                  defaultValue: 'check',
                  options: [
                    { label: 'Check', value: 'check' },
                    { label: 'Tooth', value: 'tooth' },
                    { label: 'Shield', value: 'shield' },
                    { label: 'Clock', value: 'clock' },
                    { label: 'Sparkle', value: 'sparkle' },
                    { label: 'Heart', value: 'heart' },
                    { label: '3D scan', value: 'scan' },
                    { label: 'Microscope', value: 'microscope' },
                    { label: 'Laboratory', value: 'lab' },
                    { label: 'Child', value: 'child' },
                    { label: 'Braces', value: 'braces' },
                    { label: 'Globe', value: 'globe' },
                    { label: 'Wallet', value: 'wallet' },
                    { label: 'Pin', value: 'pin' },
                  ],
                },
              ],
            },
            faqField,
          ],
        },
        {
          label: 'Media',
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media' },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
            },
            {
              name: 'icon',
              type: 'select',
              defaultValue: 'tooth',
              options: [
                { label: 'Implant', value: 'implant' },
                { label: 'Veneer', value: 'veneer' },
                { label: 'Whitening', value: 'whitening' },
                { label: 'Braces', value: 'braces' },
                { label: 'Surgery', value: 'surgery' },
                { label: 'Filling', value: 'filling' },
                { label: 'Child', value: 'child' },
                { label: 'Crown', value: 'crown' },
                { label: 'Scan', value: 'scan' },
                { label: 'Tooth', value: 'tooth' },
                { label: 'Hygiene (sparkle)', value: 'sparkle' },
                { label: 'Laboratory', value: 'lab' },
                { label: 'Microscope', value: 'microscope' },
              ],
            },
          ],
        },
        {
          label: 'Pricing',
          fields: [
            {
              name: 'priceFrom',
              type: 'number',
              admin: { description: 'Starting price in GEL. Leave empty to hide pricing.' },
            },
            { name: 'priceTo', type: 'number', admin: { description: 'Upper bound in GEL.' } },
            {
              name: 'priceNote',
              type: 'text',
              localized: true,
              admin: { description: 'For example: final price is set after a free consultation.' },
            },
            {
              name: 'duration',
              type: 'text',
              localized: true,
              admin: { description: 'Typical treatment time, e.g. "1–2 visits".' },
            },
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show on the home page services grid.' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 100,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
    {
      name: 'relatedDoctors',
      type: 'relationship',
      relationTo: 'doctors',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
  ],
}
