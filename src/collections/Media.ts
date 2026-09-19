import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media', plural: 'Media' },
  admin: { group: 'Library', useAsTitle: 'filename' },
  access: { read: () => true },
  upload: {
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumb', width: 400, height: 400, position: 'centre' },
      { name: 'card', width: 768 },
      { name: 'wide', width: 1440 },
      { name: 'hero', width: 2000 },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
      admin: {
        description:
          'Describes the image for screen readers and Google Images. Leave empty for purely decorative images.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
    },
    {
      name: 'credit',
      type: 'text',
      admin: { description: 'Photographer or source, if attribution is required.' },
    },
  ],
}
