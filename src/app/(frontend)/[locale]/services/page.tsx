import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, locales, type Locale } from '../../../../i18n/config'
import { getDictionary } from '../../../../i18n/dictionaries'
import { getServices } from '../../../../lib/data'
import { buildMetadata } from '../../../../lib/metadata'
import { PageHeader } from '../../../../components/PageHeader'
import { ServicesGrid } from '../../../../components/sections/ServicesGrid'

export const revalidate = 300

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
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

  const descriptions: Record<Locale, string> = {
    ka: 'დენტალური მომსახურების სრული სპექტრი თბილისში - იმპლანტაცია, ვინირები, ორთოდონტია, თეთრება და ესთეტიკური სტომატოლოგია.',
    en: 'The full range of dental treatments in Tbilisi - implants, veneers, orthodontics, whitening and aesthetic dentistry.',
    ru: 'Полный спектр стоматологических услуг в Тбилиси - импланты, виниры, ортодонтия, отбеливание и эстетическая стоматология.',
  }

  return buildMetadata({
    locale,
    path: '/services',
    title: dict.nav.services,
    description: descriptions[locale],
  })
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const dict = getDictionary(locale)
  const services = await getServices(locale).catch(() => [])

  return (
    <>
      <PageHeader
        locale={locale}
        title={dict.nav.services}
        breadcrumbs={[{ label: dict.nav.home, href: '/' }, { label: dict.nav.services }]}
      />
      <ServicesGrid locale={locale} dict={dict} services={services} hideHeading showAllLink={false} />
    </>
  )
}
