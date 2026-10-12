import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale, locales, type Locale } from '../../../../i18n/config'
import { getDictionary } from '../../../../i18n/dictionaries'
import { getGallery, getHome } from '../../../../lib/data'
import { buildMetadata } from '../../../../lib/metadata'
import { cn, localePath, mediaAlt, mediaUrl } from '../../../../lib/utils'
import { PageHeader } from '../../../../components/PageHeader'
import { PhotoLightbox, type GalleryPhoto } from '../../../../components/PhotoLightbox'

export const revalidate = 300

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

const CATEGORIES = ['exterior', 'interior', 'vip', 'premium', 'kids', 'equipment'] as const
type Category = (typeof CATEGORIES)[number]

const CATEGORY_LABELS: Record<Locale, Record<Category | 'all', string>> = {
  ka: {
    all: 'ყველა',
    exterior: 'კლინიკის ექსტერიერი',
    interior: 'კლინიკის ინტერიერი',
    vip: 'VIP ოთახი',
    premium: 'Premium ოთახი',
    kids: 'ბავშვთა ოთახი',
    equipment: 'აპარატურა',
  },
  en: {
    all: 'All',
    exterior: 'Clinic exterior',
    interior: 'Clinic interior',
    vip: 'VIP room',
    premium: 'Premium room',
    kids: "Children's room",
    equipment: 'Equipment',
  },
  ru: {
    all: 'Все',
    exterior: 'Экстерьер клиники',
    interior: 'Интерьер клиники',
    vip: 'VIP-комната',
    premium: 'Premium-комната',
    kids: 'Детская комната',
    equipment: 'Оборудование',
  },
  he: {
    all: 'הכול',
    exterior: 'חזית המרפאה',
    interior: 'פנים המרפאה',
    vip: 'חדר VIP',
    premium: 'חדר Premium',
    kids: 'חדר ילדים',
    equipment: 'ציוד',
  },
  ar: {
    all: 'الكل',
    exterior: 'الواجهة الخارجية للعيادة',
    interior: 'داخل العيادة',
    vip: 'غرفة VIP',
    premium: 'غرفة Premium',
    kids: 'غرفة الأطفال',
    equipment: 'الأجهزة',
  },
}

const INTRO: Record<Locale, string> = {
  ka: 'გაეცანით ჩვენს სივრცეს ვიზიტამდე: თქვენ გელოდებათ სრულიად დამოუკიდებელი 5 კაბინეტი — მათ შორის Premium, VIP და სპეციალურად მოწყობილი საბავშვო ოთახი. მაქსიმალური უსაფრთხოებისა და კომფორტისთვის, კლინიკა აღჭურვილია ცალკე სასტერილიზაციო და თანამედროვე რენტგენო-დიაგნოსტიკური სივრცეებით.',
  en: "Explore our space before your visit: Five fully independent treatment rooms await you — including our Premium, VIP, and specially designed children's rooms. For your ultimate safety and comfort, our clinic features a dedicated sterilization suite and modern X-ray diagnostic facilities.",
  ru: 'Познакомьтесь с нашей клиникой до визита: Вас ждут 5 полностью независимых кабинетов — в том числе Premium, VIP и специально обустроенный детский кабинет. Для вашей максимальной безопасности и комфорта клиника оснащена отдельной стерилизационной и современной рентген-диагностической зоной.',
  he: 'הכירו את המרפאה לפני הביקור: מחכים לכם 5 חדרי טיפול עצמאיים לגמרי, ובהם חדרי Premium, VIP וחדר ילדים שעוצב במיוחד. לבטיחות ולנוחות מרביות יש במרפאה חדר עיקור נפרד ומתחם דימות רנטגן מודרני.',
  ar: 'تعرّفوا على عيادتنا قبل الزيارة: بانتظاركم 5 غرف علاج مستقلة تمامًا، منها غرف Premium وVIP وغرفة أطفال مُجهَّزة خصيصًا. ولأقصى درجات الأمان والراحة تضم العيادة جناح تعقيم منفصلًا ومساحة حديثة للتشخيص بالأشعة.',
}

function toPhoto(
  item: { image: Parameters<typeof mediaUrl>[0]; title?: string | null },
  fallback: string,
): GalleryPhoto {
  return {
    src: mediaUrl(item.image, 'card')!,
    full: mediaUrl(item.image) || mediaUrl(item.image, 'card')!,
    alt: mediaAlt(item.image, item.title ?? fallback),
    title: item.title,
  }
}

/** The gallery page uses the same text as Admin → მთავარი → გალერეის სექცია. */
async function galleryIntro(locale: Locale): Promise<string> {
  const home = await getHome(locale).catch(() => null)
  const section = home?.sections?.find((item) => item.blockType === 'gallery')
  const text = [section?.heading, section?.subheading].filter(Boolean).join(': ')
  return text || INTRO[locale]
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
  const intro = await galleryIntro(locale)

  return buildMetadata({
    locale,
    path: '/gallery',
    title: `${dict.nav.gallery} - Dream Dental Group`,
    description: intro,
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
  const intro = await galleryIntro(locale)

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
        subtitle={intro}
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
          <PhotoLightbox
            layout="masonry"
            photos={shown.map((item) => toPhoto(item, labels[item.category as Category] ?? ''))}
            labels={{ close: dict.nav.close, previous: dict.labels.previous, next: dict.labels.next }}
          />
        )}
      </section>
    </>
  )
}
