import type { GlobalConfig } from 'payload'
import { seoField } from '../fields/seo'

/**
 * The home page is a fixed set of well-designed sections rather than a free
 * block builder: editors reorder and toggle them, which keeps the layout from
 * ever degrading while still giving full control over what is shown.
 */
export const HomePage: GlobalConfig = {
  slug: 'home',
  label: 'Home page',
  admin: { group: 'Pages' },
  access: { read: () => true },
  versions: { drafts: true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            { name: 'heroEyebrow', type: 'text', localized: true },
            { name: 'heroTitle', type: 'text', required: true, localized: true },
            { name: 'heroSubtitle', type: 'textarea', localized: true },
            { name: 'heroImage', type: 'upload', relationTo: 'media' },
            {
              name: 'heroVideoUrl',
              type: 'text',
              admin: { description: 'Optional background video. Keep it under 5 seconds and muted.' },
            },
            {
              name: 'heroBullets',
              type: 'array',
              localized: true,
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            {
              type: 'row',
              fields: [
                { name: 'primaryCtaLabel', type: 'text', localized: true, admin: { width: '50%' } },
                { name: 'primaryCtaHref', type: 'text', admin: { width: '50%' } },
              ],
            },
          ],
        },
        {
          label: 'Sections',
          fields: [
            {
              name: 'sections',
              type: 'array',
              label: 'Section order',
              admin: {
                description:
                  'Drag to reorder. Uncheck "enabled" to hide a section without deleting its content.',
              },
              defaultValue: [
                { blockType: 'stats', enabled: true },
                { blockType: 'services', enabled: true },
                { blockType: 'whyUs', enabled: true },
                { blockType: 'cases', enabled: true },
                { blockType: 'doctors', enabled: true },
                { blockType: 'testimonials', enabled: true },
                { blockType: 'kids', enabled: true },
                { blockType: 'tourism', enabled: true },
                { blockType: 'gallery', enabled: true },
                { blockType: 'contact', enabled: true },
              ],
              fields: [
                {
                  name: 'blockType',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Trust counters', value: 'stats' },
                    { label: 'Services grid', value: 'services' },
                    { label: 'Why choose us', value: 'whyUs' },
                    { label: 'Before / after slider', value: 'cases' },
                    { label: 'Our doctors', value: 'doctors' },
                    { label: 'Patient testimonials', value: 'testimonials' },
                    { label: 'Kids dentistry', value: 'kids' },
                    { label: 'Dental tourism', value: 'tourism' },
                    { label: 'Gallery strip', value: 'gallery' },
                    { label: 'Contact & map', value: 'contact' },
                  ],
                },
                { name: 'enabled', type: 'checkbox', defaultValue: true },
                { name: 'heading', type: 'text', localized: true },
                { name: 'subheading', type: 'textarea', localized: true },
              ],
            },
          ],
        },
        {
          label: 'Why choose us',
          fields: [
            {
              name: 'advantages',
              type: 'array',
              localized: true,
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea' },
                {
                  name: 'icon',
                  type: 'select',
                  defaultValue: 'sparkle',
                  options: [
                    { label: 'Sparkle', value: 'sparkle' },
                    { label: 'Shield', value: 'shield' },
                    { label: 'Clock', value: 'clock' },
                    { label: 'Globe', value: 'globe' },
                    { label: 'Heart', value: 'heart' },
                    { label: 'Microscope', value: 'microscope' },
                    { label: 'Wallet', value: 'wallet' },
                    { label: 'Pin', value: 'pin' },
                    { label: 'Laboratory', value: 'lab' },
                    { label: 'Child', value: 'child' },
                    { label: 'Check', value: 'check' },
                    { label: 'Tooth', value: 'tooth' },
                  ],
                },
              ],
            },
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
  ],
}
