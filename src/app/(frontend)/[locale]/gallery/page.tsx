import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale, locales, type Locale } from '../../../../i18n/config'
import { getDictionary } from '../../../../i18n/dictionaries'
import { getGallery } from '../../../../lib/data'
import { buildMetadata } from '../../../../lib/metadata'
import { cn, localePath, mediaAlt, mediaUrl } from '../../../../lib/utils'
import { PageHeader } from '../../../../components/PageHeader'
import { Reveal } from '../../../../components/motion/Reveal'

export const revalidate = 300

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

const CATEGORIES = ['interior', 'equipment', 'team', 'kids', 'vip'] as const
type Category = (typeof CATEGORIES)[number]

const CATEGORY_LABELS: Record<Locale, Record<Category | 'all', string>> = {
  ka: {
    all: 'ყველა',
    interior: 'კლინიკის ინტერიერი',
    equipment: 'აპარატურა',
    team: 'გუნდი',
    kids: 'Dream Land - ბავშვთა ოთახი',
    vip: 'Dream Box - VIP კაბინეტი',
  },
  en: {
    all: 'All',
    interior: 'Clinic interior',
    equipment: 'Equipment',
    team: 'Our team',
    kids: 'Dream Land - kids room',
    vip: 'Dream Box - VIP room',
  },
  ru: {
    all: 'Все',
    interior: 'Интерьер клиники',
    equipment: 'Оборудование',
    team: 'Наша команда',
    kids: 'Dream Land - детская',
    vip: 'Dream Box - VIP кабинет',
  },
}

const INTRO: Record<Locale, string> = {
  ka: 'შემოგვიხედეთ ვიზიტამდე - რვა ცალკე ბოქსი, სარენტგენო ოთახი, საკუთარი სატექნიკო ლაბორატორია, ბავშვთა Dream Land და VIP კაბინეტი Dream Box.',
  en: 'Look inside before you visit - eight separate treatment boxes, an X-ray room, our own dental laboratory, the Dream Land kids room and the Dream Box VIP suite.',
  ru: 'Загляните к нам до визита - восемь отдельных боксов, рентген-кабинет, собственная зуботехническая лаборатория, детская Dream Land и VIP-кабинет Dream Box.',
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
    path: '/gallery',
    title: `${dict.nav.gallery} - Dream Dental Group`,
    description: INTRO[locale],
  })
}

export default async function GalleryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ c?: string }>
}) {
  const [{ locale: raw }, { c }] = await Promise.all([params, searchParams])
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const dict = getDictionary(locale)

  const active = CATEGORIES.includes(c as Category) ? (c as Category) : null
  const items = await getGallery(locale).catch(() => [])
  const usable = items.filter((item) => mediaUrl(item.image))

  // Only offer filters for categories that actually have photos.
  const available = CATEGORIES.filter((cat) => usable.some((item) => item.category === cat))
  const shown = active ? usable.filter((item) => item.category === active) : usable
  const labels = CATEGORY_LABELS[locale]

  return (
    <>
      <PageHeader
        locale={locale}
        eyebrow={dict.nav.gallery}
        title={active ? labels[active] : dict.nav.gallery}
        subtitle={INTRO[locale]}
        breadcrumbs={[{ label: dict.nav.home, href: '/' }, { label: dict.nav.gallery }]}
      />

      {available.length > 1 && (
        <nav className="container-page" aria-label={dict.nav.gallery}>
          <div className="rail -mx-5 px-5 pb-1 sm:mx-0 sm:flex sm:flex-wrap sm:gap-2 sm:overflow-visible sm:px-0">
            {[null, ...available].map((cat) => {
              const isActive = cat === active
              return (
                <Link
                  key={cat ?? 'all'}
                  href={localePath(locale, cat ? `/gallery?c=${cat}` : '/gallery')}
                  scroll={false}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand text-white'
                      : 'border-hairline text-ink-muted hover:text-brand hover:border-brand/30 border',
                  )}
                >
                  {cat ? labels[cat] : labels.all}
                </Link>
              )
            })}
          </div>
        </nav>
      )}

      <section className="container-page section pt-8">
        {shown.length === 0 ? (
          <p className="text-ink-muted py-16 text-center text-sm">-</p>
        ) : (
          /* Masonry via CSS columns: rows stay tight regardless of photo ratio. */
          <div className="gap-3 [column-count:2] md:gap-4 md:[column-count:3]">
            {shown.map((item, index) => (
              <Reveal key={item.id} delay={index % 3} className="mb-3 break-inside-avoid md:mb-4">
                <figure className="group relative overflow-hidden rounded-[var(--radius-card)]">
                  <Image
                    src={mediaUrl(item.image, 'card')!}
                    alt={mediaAlt(item.image, item.title ?? labels[item.category as Category] ?? '')}
                    width={800}
                    height={600}
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  {item.title && (
                    <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/75 to-transparent p-4 text-sm font-medium text-white transition-transform duration-300 group-hover:translate-y-0">
                      {item.title}
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
