import type { Field } from 'payload'

/**
 * Per-document SEO overrides. Everything is localised so each language ranks on
 * its own copy rather than on a translated duplicate. When a field is left
 * empty the page falls back to the document's own title/excerpt, so editors
 * only fill these in when they want to deviate.
 */
export const seoField: Field = {
  name: 'seo',
  type: 'group',
  label: 'SEO',
  admin: {
    description: 'Overrides what Google and social networks show. Leave blank to auto-generate.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      admin: { description: 'Browser tab and Google result headline. Aim for 50–60 characters.' },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: { description: 'Google result snippet. Aim for 140–160 characters.' },
    },
    {
      name: 'keywords',
      type: 'text',
      localized: true,
      admin: { description: 'Comma separated. Minor ranking value, useful as an internal note.' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Preview image for Facebook, WhatsApp and X. 1200×630 works best.' },
    },
    {
      name: 'noindex',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Hide this page from search engines.' },
    },
  ],
}

/** FAQ entries render as visible content and as FAQPage structured data. */
export const faqField: Field = {
  name: 'faq',
  type: 'array',
  label: 'FAQ',
  localized: true,
  admin: {
    description:
      'Shown on the page and submitted to Google as FAQ structured data, which can win extra space in search results.',
  },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
  ],
}
