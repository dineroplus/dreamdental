import type { Block, CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'
import { faqField, seoField } from '../fields/seo'

const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Text', plural: 'Text' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    { name: 'content', type: 'richText', localized: true },
    {
      name: 'width',
      type: 'select',
      defaultValue: 'narrow',
      options: [
        { label: 'Narrow (best for reading)', value: 'narrow' },
        { label: 'Wide', value: 'wide' },
      ],
    },
  ],
}

const ImageTextBlock: Block = {
  slug: 'imageText',
  labels: { singular: 'Image + text', plural: 'Image + text' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    { name: 'content', type: 'richText', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'right',
      options: [
        { label: 'Image on the right', value: 'right' },
        { label: 'Image on the left', value: 'left' },
      ],
    },
  ],
}

const FeatureGridBlock: Block = {
  slug: 'featureGrid',
  labels: { singular: 'Feature grid', plural: 'Feature grids' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    {
      name: 'items',
      type: 'array',
      localized: true,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}

const GalleryBlock: Block = {
  slug: 'gallery',
  labels: { singular: 'Image gallery', plural: 'Image galleries' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    { name: 'images', type: 'upload', relationTo: 'media', hasMany: true, required: true },
  ],
}

const CtaBlock: Block = {
  slug: 'cta',
  labels: { singular: 'Call to action', plural: 'Calls to action' },
  fields: [
    { name: 'heading', type: 'text', required: true, localized: true },
    { name: 'text', type: 'textarea', localized: true },
    { name: 'buttonLabel', type: 'text', localized: true },
    { name: 'buttonHref', type: 'text' },
  ],
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  admin: { group: 'Pages', useAsTitle: 'title', defaultColumns: ['title', 'slug', '_status'] },
  access: { read: () => true },
  versions: { drafts: true },
  fields: [
    slugField(),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', required: true, localized: true },
            { name: 'subtitle', type: 'textarea', localized: true },
            { name: 'heroImage', type: 'upload', relationTo: 'media' },
            {
              name: 'layout',
              type: 'blocks',
              blocks: [RichTextBlock, ImageTextBlock, FeatureGridBlock, GalleryBlock, CtaBlock],
            },
            faqField,
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
    {
      name: 'showInSitemap',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
}
