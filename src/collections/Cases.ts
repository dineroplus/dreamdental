import type { CollectionConfig } from 'payload'

/**
 * Before/after treatment results. These drive the interactive comparison
 * slider, which is consistently the highest-converting element on a dental
 * site, so the imagery requirements are enforced here.
 */
export const Cases: CollectionConfig = {
  slug: 'cases',
  labels: { singular: 'Before / After case', plural: 'Before / After' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'treatment', 'doctor', 'featured'],
  },
  access: { read: () => true },
  versions: { drafts: true },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'For example: Upper jaw implants and zirconia crowns.' },
    },
    {
      name: 'beforeImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { description: 'Shoot before and after from the same angle so the slider lines up.' },
    },
    { name: 'afterImage', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: { description: 'What the problem was and how it was solved.' },
    },
    { name: 'treatment', type: 'relationship', relationTo: 'services' },
    { name: 'doctor', type: 'relationship', relationTo: 'doctors' },
    {
      name: 'duration',
      type: 'text',
      localized: true,
      admin: { description: 'For example: 6 months, 3 visits.' },
    },
    {
      name: 'patientConsent',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Confirm the patient agreed in writing to publish these photos.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show on the home page.' },
    },
    { name: 'order', type: 'number', defaultValue: 100, admin: { position: 'sidebar' } },
  ],
}
