import type { CollectionConfig } from 'payload'

export const GalleryItems: CollectionConfig = {
  slug: 'gallery-items',
  labels: { singular: 'Gallery item', plural: 'Gallery' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'order'],
  },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'interior',
      options: [
        { label: 'Clinic interior', value: 'interior' },
        { label: 'Equipment', value: 'equipment' },
        { label: 'Team', value: 'team' },
        { label: 'Kids room (Dream Land)', value: 'kids' },
        { label: 'VIP room (Dream Box)', value: 'vip' },
      ],
    },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'order', type: 'number', defaultValue: 100, admin: { position: 'sidebar' } },
  ],
}
