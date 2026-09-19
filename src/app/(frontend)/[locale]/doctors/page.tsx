import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, locales, type Locale } from '../../../../i18n/config'
import { getDictionary } from '../../../../i18n/dictionaries'
import { getDoctors } from '../../../../lib/data'
import { buildMetadata } from '../../../../lib/metadata'
import { PageHeader } from '../../../../components/PageHeader'
import { DoctorsSection } from '../../../../components/sections/DoctorsSection'

export const revalidate = 300

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

const INTRO: Record<Locale, string> = {
  ka: 'თერაპევტები, ქირურგები, იმპლანტოლოგები, ორთოდონტები და რადიოლოგები - ერთ გუნდში. ვმუშაობთ ქართულად, ინგლისურად, რუსულად, გერმანულად, თურქულად და არაბულად.',
  en: 'Therapists, surgeons, implantologists, orthodontists and radiologists in one team. We work in Georgian, English, Russian, German, Turkish and Arabic.',
  ru: 'Терапевты, хирурги, имплантологи, ортодонты и рентгенологи в одной команде. Мы работаем на грузинском, английском, русском, немецком, турецком и арабском.',
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
    path: '/doctors',
    title: `${dict.nav.doctors} - Dream Dental Group`,
    description: INTRO[locale],
  })
}

export default async function DoctorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const dict = getDictionary(locale)
  const doctors = await getDoctors(locale).catch(() => [])

  return (
    <>
      <PageHeader
        locale={locale}
        eyebrow={dict.labels.ourDoctors}
        title={dict.nav.doctors}
        subtitle={INTRO[locale]}
        breadcrumbs={[{ label: dict.nav.home, href: '/' }, { label: dict.nav.doctors }]}
      />
      <DoctorsSection locale={locale} dict={dict} doctors={doctors} hideHeading />
    </>
  )
}
