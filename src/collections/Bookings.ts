import type { CollectionConfig } from 'payload'

/**
 * Appointment requests submitted from the site. Written by the public booking
 * endpoint, readable only inside /admin.
 */
export const Bookings: CollectionConfig = {
  slug: 'bookings',
  labels: { singular: 'Booking request', plural: 'Booking requests' },
  admin: {
    group: 'Inbox',
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'service', 'status', 'createdAt'],
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === 'admin',
    create: () => false,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'email', type: 'email' },
    { name: 'message', type: 'textarea' },
    { name: 'service', type: 'relationship', relationTo: 'services' },
    { name: 'preferredDate', type: 'date' },
    {
      name: 'locale',
      type: 'text',
      admin: { readOnly: true, description: 'Language the visitor was browsing in.' },
    },
    {
      name: 'sourcePath',
      type: 'text',
      admin: { readOnly: true, description: 'Page the request came from.' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Booked', value: 'booked' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'notes', type: 'textarea', admin: { position: 'sidebar' } },
  ],
}
