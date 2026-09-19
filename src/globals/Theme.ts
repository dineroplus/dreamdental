import type { GlobalConfig } from 'payload'

/**
 * Design controls exposed to the client. Every value here is emitted as a CSS
 * custom property on <html>, so changing a colour in /admin restyles the whole
 * site without a deploy.
 */
export const Theme: GlobalConfig = {
  slug: 'theme',
  label: 'Design & theme',
  admin: { group: 'Appearance' },
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Colours',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'primary',
                  type: 'text',
                  defaultValue: '#8B1220',
                  admin: { width: '50%', description: 'Headings and primary buttons.' },
                },
                {
                  name: 'accent',
                  type: 'text',
                  defaultValue: '#E8534A',
                  admin: { width: '50%', description: 'Highlights, badges, hover states.' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'gold',
                  type: 'text',
                  defaultValue: '#C9A227',
                  admin: { width: '50%', description: 'Logo accent and dividers.' },
                },
                {
                  name: 'background',
                  type: 'text',
                  defaultValue: '#FDF8EF',
                  admin: { width: '50%', description: 'Warm page background.' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'surface',
                  type: 'text',
                  defaultValue: '#FFFFFF',
                  admin: { width: '50%', description: 'Cards and panels.' },
                },
                {
                  name: 'text',
                  type: 'text',
                  defaultValue: '#2A1A1C',
                  admin: { width: '50%', description: 'Body copy.' },
                },
              ],
            },
          ],
        },
        {
          label: 'Typography & shape',
          fields: [
            {
              name: 'headingScale',
              type: 'select',
              defaultValue: 'balanced',
              options: [
                { label: 'Compact', value: 'compact' },
                { label: 'Balanced', value: 'balanced' },
                { label: 'Bold and large', value: 'bold' },
              ],
            },
            {
              name: 'radius',
              type: 'select',
              defaultValue: 'soft',
              options: [
                { label: 'Sharp', value: 'sharp' },
                { label: 'Soft', value: 'soft' },
                { label: 'Pill', value: 'pill' },
              ],
            },
          ],
        },
        {
          label: 'Motion',
          fields: [
            {
              name: 'motionLevel',
              type: 'select',
              defaultValue: 'full',
              options: [
                { label: 'Full - parallax, reveals, counters', value: 'full' },
                { label: 'Subtle - fades only', value: 'subtle' },
                { label: 'Off', value: 'off' },
              ],
              admin: {
                description:
                  'Visitors who set "reduce motion" in their device always get the reduced version regardless of this setting.',
              },
            },
          ],
        },
      ],
    },
  ],
}
