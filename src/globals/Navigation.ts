import type { GlobalConfig } from 'payload'

const linkFields = [
  { name: 'label', type: 'text' as const, required: true, localized: true },
  {
    name: 'href',
    type: 'text' as const,
    required: true,
    admin: {
      description: 'Path without the language prefix, e.g. /services or /contact.',
    },
  },
]

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Menus',
  admin: { group: 'Appearance' },
  access: { read: () => true },
  fields: [
    {
      name: 'header',
      type: 'array',
      label: 'Header menu',
      fields: [
        ...linkFields,
        {
          name: 'children',
          type: 'array',
          label: 'Dropdown items',
          fields: linkFields,
        },
      ],
    },
    {
      name: 'footerColumns',
      type: 'array',
      label: 'Footer columns',
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'links', type: 'array', fields: linkFields },
      ],
    },
  ],
}
