import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { isLocale, locales, htmlLang, type Locale } from '../../../../../i18n/config'
import { getDictionary } from '../../../../../i18n/dictionaries'
import { getAllSlugs, getPostBySlug, getSettings } from '../../../../../lib/data'
import { buildMetadata } from '../../../../../lib/metadata'
import { CLINIC, SITE_URL } from '../../../../../lib/site'
import { mediaAlt, mediaDimensions, mediaUrl, truncate } from '../../../../../lib/utils'
import { PageHeader } from '../../../../../components/PageHeader'
import { RichText } from '../../../../../components/RichText'
import { Faq } from '../../../../../components/Faq'
import { JsonLd } from '../../../../../components/JsonLd'
import { ServicesGrid } from '../../../../../components/sections/ServicesGrid'

export const revalidate = 300

export async function generateStaticParams() {
  const slugs = await getAllSlugs('posts').catch(() => [])
  return locales.flatMap((locale) => slugs.map(({ slug }) => ({ locale, slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale: raw, slug } = await params
  if (!isLocale(raw)) return {}
  const locale = raw as Locale

  const post = await getPostBySlug(locale, slug).catch(() => null)
  if (!post) return {}

  const title = post.seo?.title || post.title || slug
  return buildMetadata({
    locale,
    path: `/blog/${slug}`,
    title,
    description: post.seo?.description || (post.excerpt ? truncate(post.excerpt, 158) : undefined),
    image: mediaUrl(post.seo?.image) || mediaUrl(post.coverImage),
    noindex: post.seo?.noindex ?? false,
    type: 'article',
    publishedTime: post.publishedAt,
  })
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: raw, slug } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const dict = getDictionary(locale)

  const post = await getPostBySlug(locale, slug).catch(() => null)
  if (!post) notFound()

  const settings = await getSettings(locale).catch(() => null)

  const title = post.title || slug
  const cover = mediaUrl(post.coverImage, 'wide')
  const coverDims = mediaDimensions(post.coverImage)
  const author = typeof post.author === 'object' && post.author !== null ? post.author : null
  const related = (post.relatedServices ?? []).filter(
    (s): s is Exclude<typeof s, number> => typeof s === 'object' && s !== null,
  )
  const published = post.publishedAt
    ? new Intl.DateTimeFormat(htmlLang[locale], {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(post.publishedAt))
    : null

  return (
    <>
      <PageHeader
        locale={locale}
        eyebrow={[published, author?.name].filter(Boolean).join(' · ') || undefined}
        title={title}
        subtitle={post.excerpt}
        breadcrumbs={[
          { label: dict.nav.home, href: '/' },
          { label: dict.nav.blog, href: '/blog' },
          { label: truncate(title, 40) },
        ]}
      />

      <article className="container-page">
        {cover && (
          <Image
            src={cover}
            alt={mediaAlt(post.coverImage, post.title)}
            width={coverDims.width}
            height={coverDims.height}
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="shadow-soft mx-auto mb-10 w-full max-w-3xl rounded-[var(--radius-card)] object-cover"
          />
        )}

        <div className="mx-auto max-w-3xl">
          <RichText value={post.body} />
        </div>
      </article>

      {post.faq && post.faq.length > 0 && <Faq title={dict.labels.faq} items={post.faq} />}

      <ServicesGrid
        locale={locale}
        dict={dict}
        services={related}
        heading={dict.labels.relatedServices}
        showAllLink={false}
      />

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.excerpt,
          inLanguage: htmlLang[locale],
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          mainEntityOfPage: `${SITE_URL}/${locale}/blog/${post.slug}`,
          ...(cover ? { image: cover.startsWith('http') ? cover : `${SITE_URL}${cover}` } : {}),
          author: author
            ? { '@type': 'Person', name: author.name }
            : { '@type': 'Organization', name: settings?.clinicName || CLINIC.legalName },
          publisher: {
            '@type': 'Organization',
            name: settings?.clinicName || CLINIC.legalName,
            url: SITE_URL,
          },
        }}
      />
    </>
  )
}
