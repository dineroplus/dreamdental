import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, locales, type Locale } from '../../../../i18n/config'
import { getDictionary } from '../../../../i18n/dictionaries'
import { getServices, getSettings } from '../../../../lib/data'
import { buildMetadata } from '../../../../lib/metadata'
import { CLINIC, SITE_URL } from '../../../../lib/site'
import { PageHeader } from '../../../../components/PageHeader'
import { ContactSection } from '../../../../components/sections/ContactSection'
import { JsonLd } from '../../../../components/JsonLd'

export const revalidate = 300

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

const INTRO: Record<Locale, string> = {
  ka: 'ბარათაშვილის #10, თბილისის ცენტრი. ვმუშაობთ ყოველდღე 10:00-დან 22:00-მდე. დაგვირეკეთ, მოგვწერეთ WhatsApp-ზე ან შეავსეთ ფორმა - დაგიკავშირდებით უმოკლეს დროში.',
  en: 'Baratashvili St. 10, central Tbilisi. Open every day from 10:00 to 22:00. Call us, message us on WhatsApp or fill in the form and we will get back to you shortly.',
  ru: 'Ул. Бараташвили 10, центр Тбилиси. Работаем ежедневно с 10:00 до 22:00. Позвоните, напишите в WhatsApp или заполните форму - мы свяжемся с вами в ближайшее время.',
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
    path: '/contact',
    title: `${dict.nav.contact} - Dream Dental Group Tbilisi`,
    description: INTRO[locale],
  })
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const dict = getDictionary(locale)

  const [settings, services] = await Promise.all([
    getSettings(locale).catch(() => null),
    getServices(locale).catch(() => []),
  ])

  const addressLine = settings?.addressLine || CLINIC.street
  const city = settings?.city || CLINIC.city
  const phonePrimary = settings?.phonePrimary || CLINIC.phonePrimary
  const phoneSecondary = settings?.phoneSecondary || CLINIC.phoneSecondary
  const email = settings?.email || CLINIC.email
  const opensAt = settings?.opensAt || CLINIC.opensAt
  const closesAt = settings?.closesAt || CLINIC.closesAt

  return (
    <>
      <PageHeader
        locale={locale}
        eyebrow={dict.nav.contact}
        title={dict.cta.bookNow}
        subtitle={INTRO[locale]}
        breadcrumbs={[{ label: dict.nav.home, href: '/' }, { label: dict.nav.contact }]}
      />

      <ContactSection
        locale={locale}
        dict={dict}
        services={services.flatMap((s) => {
          const title = s.shortTitle || s.title
          return title ? [{ id: s.slug, title }] : []
        })}
        heading={dict.cta.bookNow}
        addressLine={addressLine}
        city={city}
        phonePrimary={phonePrimary}
        phoneSecondary={phoneSecondary}
        email={email}
        hours={`${dict.labels.openEveryDay} ${opensAt}–${closesAt}`}
        hoursNote={settings?.hoursNote}
        latitude={settings?.latitude ?? CLINIC.latitude}
        longitude={settings?.longitude ?? CLINIC.longitude}
        mapUrl={settings?.mapUrl}
      />

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Dentist',
          '@id': `${SITE_URL}/#clinic`,
          name: settings?.clinicName || CLINIC.legalName,
          url: `${SITE_URL}/${locale}/contact`,
          telephone: phonePrimary,
          email,
          address: {
            '@type': 'PostalAddress',
            streetAddress: addressLine,
            addressLocality: city,
            postalCode: CLINIC.postalCode,
            addressCountry: CLINIC.country,
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: settings?.latitude ?? CLINIC.latitude,
            longitude: settings?.longitude ?? CLINIC.longitude,
          },
          openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday',
            ],
            opens: opensAt,
            closes: closesAt,
          },
          // Local SEO: the clinic also draws patients from these areas.
          areaServed: ['Tbilisi', 'Tskneti', 'Kojori'],
        }}
      />
    </>
  )
}
