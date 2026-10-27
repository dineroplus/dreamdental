import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, locales, type Locale } from '../../../../i18n/config'
import { getDictionary } from '../../../../i18n/dictionaries'
import { getHome, getSettings } from '../../../../lib/data'
import { buildMetadata } from '../../../../lib/metadata'
import { CLINIC } from '../../../../lib/site'
import { mediaUrl, truncate } from '../../../../lib/utils'
import { HomeView } from '../../../../components/home/HomeView'

export const revalidate = 60
export const dynamic = 'force-dynamic'

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

  const [home, settings] = await Promise.all([
    getHome(locale).catch(() => null),
    getSettings(locale).catch(() => null),
  ])

  const clinic = settings?.clinicName || CLINIC.legalName
  return buildMetadata({
    locale,
    path: '/about',
    title: `${dict.nav.about} - ${clinic}`,
    description: home?.heroSubtitle ? truncate(home.heroSubtitle, 158) : undefined,
    image: mediaUrl(home?.heroImage) || mediaUrl(settings?.defaultShareImage),
    noindex: false,
  })
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  return <HomeView locale={raw as Locale} />
}
