import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { isLocale, locales, type Locale } from '../../../../i18n/config'
import { getDictionary } from '../../../../i18n/dictionaries'
import { getAllSlugs, getPageBySlug } from '../../../../lib/data'
import { buildMetadata } from '../../../../lib/metadata'
import { mediaAlt, mediaDimensions, mediaUrl, truncate } from '../../../../lib/utils'
import { PageHeader } from '../../../../components/PageHeader'
import { PageBlocks } from '../../../../components/PageBlocks'
import { Faq } from '../../../../components/Faq'

export const revalidate = 300

/**
 * Catch-all for pages built in /admin - dental tourism, kids dentistry,
 * pricing, privacy and anything the clinic adds later. Fixed routes such as
 * /services and /contact take precedence over this segment in Next.js routing,
 * so a CMS page can never shadow a real section of the site.
 */
export async function generateStaticParams() {
  const slugs = await getAllSlugs('pages').catch(() => [])
  return locales.flatMap((locale) =>
    slugs.filter(({ slug }) => slug !== 'about').map(({ slug }) => ({ locale, slug })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale: raw, slug } = await params
  if (!isLocale(raw)) return {}
  const locale = raw as Locale

  const page = await getPageBySlug(locale, slug).catch(() => null)
  if (!page) return {}

  return buildMetadata({
    locale,
    path: `/${slug}`,
    title: page.seo?.title || page.title,
    description: page.seo?.description || (page.subtitle ? truncate(page.subtitle, 158) : undefined),
    image: mediaUrl(page.seo?.image) || mediaUrl(page.heroImage),
    noindex: page.seo?.noindex ?? false,
  })
}

export default async function CmsPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: raw, slug } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const dict = getDictionary(locale)

  const page = await getPageBySlug(locale, slug).catch(() => null)
  if (!page) notFound()

  const hero = mediaUrl(page.heroImage, 'hero')
  const heroDims = mediaDimensions(page.heroImage)

  return (
    <>
      <PageHeader
        locale={locale}
        title={page.title}
        subtitle={page.subtitle}
        breadcrumbs={[{ label: dict.nav.home, href: '/' }, { label: page.title }]}
      />

      {hero && (
        <div className="container-page">
          <Image
            src={hero}
            alt={mediaAlt(page.heroImage, page.title)}
            width={heroDims.width}
            height={heroDims.height}
            priority
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="shadow-soft w-full rounded-[var(--radius-card)] object-cover"
          />
        </div>
      )}

      <PageBlocks locale={locale} blocks={page.layout} />

      {page.faq && page.faq.length > 0 && <Faq title={dict.labels.faq} items={page.faq} />}
    </>
  )
}
