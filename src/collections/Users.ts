import type { CollectionConfig } from 'payload'

const isAdmin = ({ req }: { req: { user?: { role?: string } | null } }) =>
  req.user?.role === 'admin'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { group: 'System', useAsTitle: 'email', defaultColumns: ['name', 'email', 'role'] },
  auth: true,
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'editor',
      required: true,
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: { update: isAdmin },
      admin: { description: 'Editors manage content. Administrators can also manage users.' },
    },
  ],
  access: {
    create: isAdmin,
    delete: isAdmin,
    update: ({ req, id }) => req.user?.role === 'admin' || req.user?.id === id,
  },
}
