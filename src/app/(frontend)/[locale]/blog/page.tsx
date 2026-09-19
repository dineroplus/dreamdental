import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale, locales, htmlLang, type Locale } from '../../../../i18n/config'
import { getDictionary } from '../../../../i18n/dictionaries'
import { getPosts } from '../../../../lib/data'
import { buildMetadata } from '../../../../lib/metadata'
import { localePath, mediaAlt, mediaUrl } from '../../../../lib/utils'
import { PageHeader } from '../../../../components/PageHeader'
import { Reveal } from '../../../../components/motion/Reveal'
import { ArrowIcon, Icon } from '../../../../components/ui'

export const revalidate = 300

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

const INTRO: Record<Locale, string> = {
  ka: 'პრაქტიკული სტატიები მკურნალობის, ფასების და პროფილაქტიკის შესახებ - დაწერილი ჩვენი ექიმების მიერ.',
  en: 'Practical articles about treatments, pricing and prevention - written by our own dentists.',
  ru: 'Практические статьи о лечении, ценах и профилактике - написанные нашими врачами.',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  if (!isLocale(raw)) return {}
  const locale = raw as Locale
  const dict = getDictionary(locale)

  return buildMetadata({
    locale,
    path: '/blog',
    title: `${dict.nav.blog} - Dream Dental Group`,
    description: INTRO[locale],
  })
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const dict = getDictionary(locale)
  const posts = await getPosts(locale).catch(() => [])

  return (
    <>
      <PageHeader
        locale={locale}
        eyebrow={dict.nav.blog}
        title={dict.nav.blog}
        subtitle={INTRO[locale]}
        breadcrumbs={[{ label: dict.nav.home, href: '/' }, { label: dict.nav.blog }]}
      />

      <section className="container-page section pt-0">
        {posts.length === 0 ? (
          <p className="text-ink-muted py-16 text-center text-sm">-</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => {
              const cover = mediaUrl(post.coverImage, 'card')
              return (
                <Reveal key={post.id} delay={index % 3} as="article">
                  <Link
                    href={localePath(locale, `/blog/${post.slug}`)}
                    className="card group hover:shadow-lift flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="bg-brand-soft relative aspect-16/10 overflow-hidden">
                      {cover ? (
                        <Image
                          src={cover}
                          alt={mediaAlt(post.coverImage, post.title)}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="grid h-full place-items-center">
                          <Icon name="tooth" className="text-brand/20 h-12 w-12" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <time
                        dateTime={post.publishedAt}
                        className="text-ink-muted text-xs tracking-wide uppercase"
                      >
                        {new Intl.DateTimeFormat(htmlLang[locale], {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        }).format(new Date(post.publishedAt))}
                      </time>

                      <h2 className="text-ink mt-2 text-base leading-snug">{post.title}</h2>

                      <p className="text-ink-muted mt-2 line-clamp-3 flex-1 text-sm leading-relaxed">
                        {post.excerpt}
                      </p>

                      <span className="text-accent mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
                        {dict.cta.readMore}
                        <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
