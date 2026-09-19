import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, type Locale } from '../../../i18n/config'
import { getDictionary } from '../../../i18n/dictionaries'
import {
  getCases,
  getDoctors,
  getGallery,
  getHome,
  getServices,
  getSettings,
  getTestimonials,
} from '../../../lib/data'
import { buildMetadata } from '../../../lib/metadata'
import { CLINIC, SITE_URL } from '../../../lib/site'
import { HERO_COPY } from '../../../lib/heroDefaults'
import { localePath, mediaAlt, mediaUrl, truncate } from '../../../lib/utils'
import { JsonLd } from '../../../components/JsonLd'
import { Hero } from '../../../components/sections/Hero'
import { Stats } from '../../../components/sections/Stats'
import { ServicesGrid } from '../../../components/sections/ServicesGrid'
import { WhyUs } from '../../../components/sections/WhyUs'
import { CasesSection } from '../../../components/sections/CasesSection'
import { DoctorsSection } from '../../../components/sections/DoctorsSection'
import { TestimonialsSection } from '../../../components/sections/TestimonialsSection'
import { GalleryStrip } from '../../../components/sections/GalleryStrip'
import { FeatureBanner } from '../../../components/sections/FeatureBanner'
import { ContactSection } from '../../../components/sections/ContactSection'
import type { Home } from '../../../content/schema'

type HomeSection = NonNullable<Home['sections']>[number]

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
  const locale = raw as Locale
  const dict = getDictionary(locale)

  const [home, settings, services, doctors, cases, testimonials, gallery] = await Promise.all([
    getHome(locale).catch((error) => {
      console.error('getHome failed', error)
      return null
    }),
    getSettings(locale).catch((error) => {
      console.error('getSettings failed', error)
      return null
    }),
    getServices(locale).catch((error) => {
      console.error('getServices failed', error)
      return []
    }),
    getDoctors(locale).catch((error) => {
      console.error('getDoctors failed', error)
      return []
    }),
    getCases(locale, { featured: true }).catch((error) => {
      console.error('getCases failed', error)
      return []
    }),
    getTestimonials(locale).catch((error) => {
      console.error('getTestimonials failed', error)
      return []
    }),
    getGallery(locale).catch((error) => {
      console.error('getGallery failed', error)
      return []
    }),
  ])

  const featuredServices = services.filter((s) => s.featured)
  const featuredTestimonials = testimonials.filter((t) => t.featured)
  const homeTestimonials = featuredTestimonials.length > 0 ? featuredTestimonials : testimonials

  // The booking form identifies a service by slug, so a renamed or deleted
  // service never orphans an existing enquiry.
  const serviceOptions = services.flatMap((service) => {
    const title = service.shortTitle || service.title
    return title ? [{ id: service.slug, title }] : []
  })

  const cmsSections = home?.sections?.filter((s) => s.enabled !== false) ?? []

  /** Used until someone arranges the sections in the admin. */
  const defaultSections: HomeSection[] = [
    'stats',
    'services',
    'whyUs',
    'cases',
    'doctors',
    'testimonials',
    'gallery',
    'contact',
  ].map((blockType) => ({ blockType: blockType as HomeSection['blockType'], enabled: true }))

  const sections = cmsSections.length > 0 ? cmsSections : defaultSections
  const sectionFor = (type: string) => sections.find((s) => s.blockType === type)

  const phonePrimary = settings?.phonePrimary || CLINIC.phonePrimary
  const opensAt = settings?.opensAt || CLINIC.opensAt
  const closesAt = settings?.closesAt || CLINIC.closesAt
  const hours = `${dict.labels.openEveryDay} ${opensAt}–${closesAt}`

  const rated = testimonials.filter((t) => typeof t.rating === 'number')
  const aggregateRating =
    rated.length > 0
      ? {
          '@type': 'AggregateRating',
          ratingValue: (rated.reduce((sum, t) => sum + (t.rating ?? 0), 0) / rated.length).toFixed(1),
          reviewCount: rated.length,
          bestRating: 5,
        }
      : undefined

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/${locale}`,
    name: settings?.clinicName || 'Dream Dental Group',
    inLanguage: locale,
    publisher: { '@id': `${SITE_URL}/#clinic` },
    ...(aggregateRating ? { aggregateRating } : {}),
  }

  const renderers: Record<string, () => React.ReactNode> = {
    stats: () => <Stats items={(settings?.stats ?? []).map((s) => ({ value: s.value, suffix: s.suffix, label: s.label }))} />,

    services: () => {
      const section = sectionFor('services')
      return (
        <ServicesGrid
          locale={locale}
          dict={dict}
          services={featuredServices.length > 0 ? featuredServices : services.slice(0, 6)}
          heading={section?.heading}
          subheading={section?.subheading}
        />
      )
    },

    whyUs: () => {
      const section = sectionFor('whyUs')
      return (
        <WhyUs
          heading={section?.heading || dict.nav.about}
          subheading={section?.subheading}
          items={(home?.advantages ?? []).map((a) => ({
            title: a.title,
            description: a.description,
            icon: a.icon,
          }))}
        />
      )
    },

    cases: () => {
      const section = sectionFor('cases')
      return <CasesSection dict={dict} cases={cases} heading={section?.heading} subheading={section?.subheading} />
    },

    doctors: () => {
      const section = sectionFor('doctors')
      return (
        <DoctorsSection
          locale={locale}
          dict={dict}
          doctors={doctors}
          heading={section?.heading}
          subheading={section?.subheading}
          viewAllHref={localePath(locale, '/doctors')}
        />
      )
    },

    testimonials: () => {
      const section = sectionFor('testimonials')
      return (
        <TestimonialsSection
          dict={dict}
          testimonials={homeTestimonials}
          heading={section?.heading}
          subheading={section?.subheading}
          viewAllHref={localePath(locale, '/cases')}
        />
      )
    },

    kids: () => {
      const section = sectionFor('kids')
      if (!section?.heading) return null
      const image = gallery.find((g) => g.category === 'kids')
      return (
        <FeatureBanner
          eyebrow="Dream Land"
          heading={section.heading}
          text={section.subheading}
          icon="child"
          imageUrl={mediaUrl(image?.image, 'card')}
          imageAlt={mediaAlt(image?.image, section.heading)}
        />
      )
    },

    tourism: () => {
      const section = sectionFor('tourism')
      if (!section?.heading) return null
      return (
        <FeatureBanner
          heading={section.heading}
          text={section.subheading}
          icon="globe"
          tone="brand"
          flip
          imageUrl={mediaUrl(gallery.find((g) => g.category === 'interior')?.image, 'card')}
          imageAlt={section.heading}
        />
      )
    },

    gallery: () => {
      const section = sectionFor('gallery')
      return (
        <GalleryStrip
          locale={locale}
          dict={dict}
          items={gallery}
          heading={section?.heading}
          subheading={section?.subheading}
        />
      )
    },

    contact: () => {
      const section = sectionFor('contact')
      return (
        <ContactSection
          locale={locale}
          dict={dict}
          services={serviceOptions}
          heading={section?.heading}
          subheading={section?.subheading}
          addressLine={settings?.addressLine || CLINIC.street}
          city={settings?.city || CLINIC.city}
          phonePrimary={phonePrimary}
          phoneSecondary={settings?.phoneSecondary || CLINIC.phoneSecondary}
          email={settings?.email || CLINIC.email}
          hours={hours}
          hoursNote={settings?.hoursNote}
          latitude={settings?.latitude ?? CLINIC.latitude}
          longitude={settings?.longitude ?? CLINIC.longitude}
          mapUrl={settings?.mapUrl}
        />
      )
    },
  }

  const hero = HERO_COPY[locale]
  const cmsTitle = home?.heroTitle?.trim()
  const brandOnlyTitle =
    !cmsTitle ||
    cmsTitle === settings?.clinicName ||
    cmsTitle === 'Dream Dental Group' ||
    cmsTitle === CLINIC.legalName
  const heroTitle = brandOnlyTitle ? hero.title : cmsTitle
  const heroSubtitle = home?.heroSubtitle?.trim() || hero.subtitle
  const cmsBullets = (home?.heroBullets ?? []).filter(Boolean)
  const heroBullets = cmsBullets.length > 0 ? cmsBullets : hero.bullets

  return (
    <>
      <Hero
        locale={locale}
        dict={dict}
        brand={hero.brand}
        title={heroTitle}
        subtitle={heroSubtitle}
        bullets={heroBullets}
        phone={phonePrimary}
        whatsapp={settings?.whatsapp || CLINIC.whatsapp}
        mapUrl={settings?.mapUrl}
        ctaLabel={home?.primaryCtaLabel}
        ctaHref={home?.primaryCtaHref}
      />

      {sections.map((section) => {
        const render = section.blockType ? renderers[section.blockType] : undefined
        return render ? <div key={section.blockType}>{render()}</div> : null
      })}

      <JsonLd data={websiteLd} />
    </>
  )
}
