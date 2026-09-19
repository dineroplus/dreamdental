import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, locales, type Locale } from '../../../../i18n/config'
import { getDictionary } from '../../../../i18n/dictionaries'
import {
  getDoctors,
  getGallery,
  getHome,
  getPageBySlug,
  getSettings,
} from '../../../../lib/data'
import { buildMetadata } from '../../../../lib/metadata'
import { CLINIC } from '../../../../lib/site'
import { mediaUrl, truncate } from '../../../../lib/utils'
import { PageHeader } from '../../../../components/PageHeader'
import { PageBlocks } from '../../../../components/PageBlocks'
import { Stats } from '../../../../components/sections/Stats'
import { WhyUs } from '../../../../components/sections/WhyUs'
import { DoctorsSection } from '../../../../components/sections/DoctorsSection'
import { GalleryStrip } from '../../../../components/sections/GalleryStrip'
import { Faq } from '../../../../components/Faq'

export const revalidate = 300

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

/** Used when the About page has not been written in /admin yet. */
const FALLBACK: Record<Locale, { subtitle: string; description: string }> = {
  ka: {
    subtitle:
      '2013 წლიდან ვმუშაობთ თბილისის ცენტრში, ბარათაშვილის #10-ში. 13 წელიწადში ჩვენთან ~50 ქვეყნიდან ჩამოვიდნენ პაციენტები - რადგან ღიმილი ჩვენი რეპუტაციაა.',
    description:
      'Dream Dental & Aesthetic Group - სტომატოლოგიური კლინიკა თბილისის ცენტრში. 13 წლიანი გამოცდილება, საკუთარი სატექნიკო ლაბორატორია, ISO სერტიფიცირება და ყოველდღიური მომსახურება 10:00–22:00.',
  },
  en: {
    subtitle:
      'Working in the centre of Tbilisi at Baratashvili St. 10 since 2013. In 13 years patients from around 50 countries have chosen us - because your smile is our reputation.',
    description:
      'Dream Dental & Aesthetic Group is a dental clinic in central Tbilisi. 13 years of practice, an in-house dental laboratory, ISO certification and daily service from 10:00 to 22:00.',
  },
  ru: {
    subtitle:
      'Работаем в центре Тбилиси на ул. Бараташвили 10 с 2013 года. За 13 лет к нам приехали пациенты примерно из 50 стран - потому что ваша улыбка это наша репутация.',
    description:
      'Dream Dental & Aesthetic Group - стоматологическая клиника в центре Тбилиси. 13 лет практики, собственная зуботехническая лаборатория, сертификация ISO и ежедневный приём с 10:00 до 22:00.',
  },
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

  const [page, settings] = await Promise.all([
    getPageBySlug(locale, 'about').catch(() => null),
    getSettings(locale).catch(() => null),
  ])

  return buildMetadata({
    locale,
    path: '/about',
    title: page?.seo?.title || `${dict.nav.about} - ${settings?.clinicName || CLINIC.legalName}`,
    description:
      page?.seo?.description ||
      (page?.subtitle ? truncate(page.subtitle, 158) : FALLBACK[locale].description),
    image: mediaUrl(page?.seo?.image) || mediaUrl(page?.heroImage) || mediaUrl(settings?.defaultShareImage),
    noindex: page?.seo?.noindex ?? false,
  })
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const dict = getDictionary(locale)

  const [page, settings, home, doctors, gallery] = await Promise.all([
    getPageBySlug(locale, 'about').catch(() => null),
    getSettings(locale).catch(() => null),
    getHome(locale).catch(() => null),
    getDoctors(locale).catch(() => []),
    getGallery(locale, 'interior').catch(() => []),
  ])

  const stats = settings?.stats ?? []
  const advantages = home?.advantages ?? []

  return (
    <>
      <PageHeader
        locale={locale}
        eyebrow={settings?.clinicName || CLINIC.legalName}
        title={page?.title || dict.nav.about}
        subtitle={page?.subtitle || FALLBACK[locale].subtitle}
        breadcrumbs={[{ label: dict.nav.home, href: '/' }, { label: dict.nav.about }]}
      />

      {stats.length > 0 && <Stats items={stats} />}

      <PageBlocks locale={locale} blocks={page?.layout} />

      {advantages.length > 0 && (
        <WhyUs heading={dict.nav.about} items={advantages} />
      )}

      <DoctorsSection locale={locale} dict={dict} doctors={doctors.slice(0, 8)} />

      <GalleryStrip locale={locale} dict={dict} items={gallery} />

      {page?.faq && page.faq.length > 0 && <Faq title={dict.labels.faq} items={page.faq} />}
    </>
  )
}
