import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Inter, Outfit, Noto_Sans_Georgian } from 'next/font/google'
import '../globals.css'

import { locales, htmlLang, isLocale, type Locale } from '../../../i18n/config'
import { getDictionary } from '../../../i18n/dictionaries'
import { getNavigation, getSettings } from '../../../lib/data'
import { CLINIC, SITE_NAME, SITE_URL } from '../../../lib/site'
import { mediaUrl } from '../../../lib/utils'
import { ThemeStyle } from '../../../components/ThemeStyle'
import { Header, type NavItem } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import { MobileActionBar } from '../../../components/MobileActionBar'
import { JsonLd } from '../../../components/JsonLd'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

/** Georgian glyphs come from a dedicated subset so Latin/Cyrillic pages never download them. */
const georgian = Noto_Sans_Georgian({
  subsets: ['georgian'],
  variable: '--font-georgian',
  display: 'swap',
})

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const settings = await getSettings(locale).catch(() => null)

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: settings?.clinicName || SITE_NAME,
      template: `%s - ${settings?.clinicName || SITE_NAME}`,
    },
    verification: settings?.googleSiteVerification
      ? { google: settings.googleSiteVerification }
      : undefined,
    icons: mediaUrl(settings?.favicon) ? { icon: mediaUrl(settings?.favicon)! } : undefined,
  }
}

const FALLBACK_NAV: Array<{ key: keyof ReturnType<typeof getDictionary>['nav']; href: string }> = [
  { key: 'about', href: '/about' },
  { key: 'services', href: '/services' },
  { key: 'doctors', href: '/doctors' },
  { key: 'cases', href: '/cases' },
  { key: 'gallery', href: '/gallery' },
  { key: 'contact', href: '/contact' },
]

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const dict = getDictionary(locale)

  const [settings, navigation] = await Promise.all([
    getSettings(locale).catch(() => null),
    getNavigation(locale).catch(() => null),
  ])

  // A menu row exists in the admin as soon as it is added, so entries without
  // both a label and a link are skipped rather than rendered empty.
  const isLink = <T extends { label?: string; href?: string }>(
    item: T,
  ): item is T & { label: string; href: string } => Boolean(item.label && item.href)

  const cmsNav: NavItem[] = (navigation?.header ?? []).flatMap((item) =>
    isLink(item)
      ? [
          {
            label: item.label,
            href: item.href,
            children: item.children?.filter(isLink).map((child) => ({
              label: child.label,
              href: child.href,
            })),
          },
        ]
      : [],
  )

  const navItems: NavItem[] =
    cmsNav.length > 0 ? cmsNav : FALLBACK_NAV.map(({ key, href }) => ({ label: dict.nav[key], href }))

  const clinicName = settings?.clinicName || SITE_NAME
  const phonePrimary = settings?.phonePrimary || CLINIC.phonePrimary
  const phoneSecondary = settings?.phoneSecondary || CLINIC.phoneSecondary
  const opensAt = settings?.opensAt || CLINIC.opensAt
  const closesAt = settings?.closesAt || CLINIC.closesAt
  const addressLine = settings?.addressLine || CLINIC.street
  const city = settings?.city || CLINIC.city
  const hoursText = `${dict.labels.openEveryDay} ${opensAt}–${closesAt}`

  const footerColumns =
    settings && navigation?.footerColumns?.length
      ? navigation.footerColumns.flatMap((column) => {
          const links = (column.links ?? []).filter(isLink)
          if (!column.title || links.length === 0) return []
          return [{ title: column.title, links }]
        })
      : [
          {
            title: dict.nav.services,
            links: [
              { label: dict.nav.services, href: '/services' },
              { label: dict.nav.cases, href: '/cases' },
              { label: dict.nav.gallery, href: '/gallery' },
            ],
          },
          {
            title: dict.nav.about,
            links: [
              { label: dict.nav.about, href: '/about' },
              { label: dict.nav.doctors, href: '/doctors' },
              { label: dict.nav.blog, href: '/blog' },
            ],
          },
        ]

  const organisationLd = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    '@id': `${SITE_URL}/#clinic`,
    name: clinicName,
    legalName: CLINIC.legalName,
    url: `${SITE_URL}/${locale}`,
    telephone: phonePrimary,
    email: settings?.email || CLINIC.email,
    foundingDate: String(CLINIC.foundedYear),
    image: mediaUrl(settings?.defaultShareImage) ?? undefined,
    logo: mediaUrl(settings?.logo) ?? undefined,
    priceRange: '$$',
    currenciesAccepted: 'GEL',
    paymentAccepted: 'Cash, Credit Card, Debit Card',
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
    openingHoursSpecification: [
      {
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
    ],
    availableLanguage: ['ka', 'en', 'ru'],
    sameAs: [settings?.facebook || CLINIC.facebook, settings?.instagram || CLINIC.instagram, settings?.youtube].filter(
      Boolean,
    ),
  }

  return (
    <html
      lang={htmlLang[locale]}
      className={`${inter.variable} ${outfit.variable} ${georgian.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeStyle />
      </head>
      <body>
        <a
          href="#main"
          className="focus:bg-brand sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:px-4 focus:py-2 focus:text-white"
        >
          {dict.misc.skipToContent}
        </a>

        <Header
          locale={locale}
          dict={dict}
          items={navItems}
          logoUrl={mediaUrl(settings?.logo)}
          clinicName={clinicName}
          phone={phonePrimary}
        />

        <main id="main" className="pt-16 lg:pt-20">
          {children}
        </main>

        <Footer
          locale={locale}
          dict={dict}
          columns={footerColumns}
          clinicName={clinicName}
          addressLine={addressLine}
          city={city}
          phonePrimary={phonePrimary}
          phoneSecondary={phoneSecondary}
          email={settings?.email || CLINIC.email}
          hours={hoursText}
          facebook={settings?.facebook || CLINIC.facebook}
          instagram={settings?.instagram || CLINIC.instagram}
          youtube={settings?.youtube || undefined}
        />

        <MobileActionBar
          locale={locale}
          dict={dict}
          phone={phonePrimary}
          whatsapp={settings?.whatsapp || CLINIC.whatsapp}
        />

        <JsonLd data={organisationLd} />
      </body>
    </html>
  )
}
