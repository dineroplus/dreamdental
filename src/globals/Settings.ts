import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Clinic settings',
  admin: { group: 'Appearance' },
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identity',
          fields: [
            { name: 'clinicName', type: 'text', localized: true, defaultValue: 'Dream Dental Group' },
            { name: 'tagline', type: 'text', localized: true },
            { name: 'logo', type: 'upload', relationTo: 'media' },
            { name: 'favicon', type: 'upload', relationTo: 'media' },
            {
              name: 'defaultShareImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Fallback preview image for pages without their own.' },
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'phonePrimary', type: 'text', defaultValue: '+995579501010', admin: { width: '50%' } },
                { name: 'phoneSecondary', type: 'text', defaultValue: '+995322991200', admin: { width: '50%' } },
              ],
            },
            {
              name: 'whatsapp',
              type: 'text',
              defaultValue: '995579501010',
              admin: { description: 'Digits only, including country code.' },
            },
            { name: 'email', type: 'email', defaultValue: 'info@dream.com.ge' },
            { name: 'addressLine', type: 'text', localized: true },
            { name: 'city', type: 'text', localized: true },
            {
              type: 'row',
              fields: [
                { name: 'latitude', type: 'number', defaultValue: 41.6977, admin: { width: '50%' } },
                { name: 'longitude', type: 'number', defaultValue: 44.8015, admin: { width: '50%' } },
              ],
            },
            {
              name: 'mapUrl',
              type: 'text',
              admin: { description: 'Google Maps link used by the "Get directions" button.' },
            },
          ],
        },
        {
          label: 'Hours',
          fields: [
            {
              name: 'openEveryDay',
              type: 'checkbox',
              defaultValue: true,
              admin: { description: 'Uncheck to define different hours per weekday.' },
            },
            {
              type: 'row',
              fields: [
                { name: 'opensAt', type: 'text', defaultValue: '10:00', admin: { width: '50%' } },
                { name: 'closesAt', type: 'text', defaultValue: '22:00', admin: { width: '50%' } },
              ],
            },
            {
              name: 'hoursNote',
              type: 'text',
              localized: true,
              admin: { description: 'For example: emergency care available outside these hours.' },
            },
          ],
        },
        {
          label: 'Social',
          fields: [
            { name: 'facebook', type: 'text', defaultValue: 'https://www.facebook.com/DreamTbilisi' },
            { name: 'instagram', type: 'text', defaultValue: 'https://www.instagram.com/dreamtbilisi/' },
            { name: 'youtube', type: 'text' },
            { name: 'tiktok', type: 'text' },
          ],
        },
        {
          label: 'Trust',
          fields: [
            {
              name: 'stats',
              type: 'array',
              localized: true,
              admin: { description: 'The animated counters shown on the home page.' },
              fields: [
                { name: 'value', type: 'text', required: true, admin: { description: 'e.g. 13' } },
                { name: 'suffix', type: 'text', admin: { description: 'e.g. + or %' } },
                { name: 'label', type: 'text', required: true },
              ],
            },
            {
              name: 'insurancePartners',
              type: 'array',
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'logo', type: 'upload', relationTo: 'media' },
              ],
            },
            {
              name: 'awards',
              type: 'array',
              localized: true,
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'year', type: 'text' },
                { name: 'image', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
        {
          label: 'Analytics',
          fields: [
            {
              name: 'googleAnalyticsId',
              type: 'text',
              admin: { description: 'Measurement ID, e.g. G-XXXXXXXXXX.' },
            },
            {
              name: 'googleSiteVerification',
              type: 'text',
              admin: { description: 'Verification token from Google Search Console.' },
            },
            { name: 'metaPixelId', type: 'text' },
          ],
        },
      ],
    },
  ],
}
