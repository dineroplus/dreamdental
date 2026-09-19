import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Testimonial', plural: 'Testimonials' },
  admin: {
    group: 'Content',
    useAsTitle: 'patientName',
    defaultColumns: ['patientName', 'country', 'rating', 'featured'],
  },
  access: { read: () => true },
  versions: { drafts: true },
  fields: [
    { name: 'patientName', type: 'text', required: true, localized: true },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      localized: true,
      admin: { description: 'The patient’s own words. Keep it verbatim where possible.' },
    },
    {
      name: 'country',
      type: 'text',
      localized: true,
      admin: { description: 'For example: Israel. Shown with a flag on the card.' },
    },
    {
      name: 'countryCode',
      type: 'text',
      maxLength: 2,
      admin: {
        description: 'Two-letter ISO code used to pick the flag, e.g. IL, DE, ES, GE.',
      },
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      defaultValue: 5,
      admin: { description: 'Feeds the aggregate rating shown to Google.' },
    },
    { name: 'treatment', type: 'relationship', relationTo: 'services' },
    { name: 'doctor', type: 'relationship', relationTo: 'doctors' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'videoUrl',
      type: 'text',
      admin: { description: 'YouTube link, if there is a video version of this testimonial.' },
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'clinic',
      options: [
        { label: 'Collected at the clinic', value: 'clinic' },
        { label: 'Instagram', value: 'instagram' },
        { label: 'Facebook', value: 'facebook' },
        { label: 'Google', value: 'google' },
        { label: 'Madloba', value: 'madloba' },
      ],
    },
    {
      name: 'isPublicFigure',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Highlights the card, for well-known guests such as athletes or chefs.',
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
