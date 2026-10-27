import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, type Locale } from '../../../i18n/config'
import { getHome, getSettings } from '../../../lib/data'
import { buildMetadata } from '../../../lib/metadata'
import { mediaUrl, truncate } from '../../../lib/utils'
import { HomeView } from '../../../components/home/HomeView'

export const revalidate = 60
export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  if (!isLocale(raw)) return {}
  const locale = raw as Locale

  const [home, settings] = await Promise.all([
    getHome(locale).catch(() => null),
    getSettings(locale).catch(() => null),
  ])

  const title = home?.seo?.title || home?.heroTitle || settings?.clinicName || 'Dream Dental Group'
  const description =
    home?.seo?.description || (home?.heroSubtitle ? truncate(home.heroSubtitle, 158) : undefined)

  return buildMetadata({
    locale,
    path: '',
    title,
    description,
    image: mediaUrl(home?.seo?.image) || mediaUrl(settings?.defaultShareImage),
    noindex: home?.seo?.noindex ?? false,
  })
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  return <HomeView locale={raw as Locale} jsonLd />
}
