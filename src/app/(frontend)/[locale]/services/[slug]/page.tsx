import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { isLocale, locales, type Locale } from '../../../../../i18n/config'
import { getDictionary } from '../../../../../i18n/dictionaries'
import {
  getAllSlugs,
  getCases,
  getServiceBySlug,
  getServices,
  getSettings,
} from '../../../../../lib/data'
import { buildMetadata } from '../../../../../lib/metadata'
import { CLINIC, SITE_URL } from '../../../../../lib/site'
import { localePath, mediaAlt, mediaDimensions, mediaUrl, truncate } from '../../../../../lib/utils'
import { PageHeader } from '../../../../../components/PageHeader'
import { RichText } from '../../../../../components/RichText'
import { Faq } from '../../../../../components/Faq'
import { JsonLd } from '../../../../../components/JsonLd'
import { Icon, ButtonLink, ArrowIcon } from '../../../../../components/ui'
import { Reveal } from '../../../../../components/motion/Reveal'
import { CasesSection } from '../../../../../components/sections/CasesSection'
import { DoctorsSection } from '../../../../../components/sections/DoctorsSection'
import { ServicesGrid } from '../../../../../components/sections/ServicesGrid'

export const revalidate = 300

export async function generateStaticParams() {
  const slugs = await getAllSlugs('services').catch(() => [])
  return locales.flatMap((locale) => slugs.map(({ slug }) => ({ locale, slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale: raw, slug } = await params
  if (!isLocale(raw)) return {}
  const locale = raw as Locale

  const service = await getServiceBySlug(locale, slug).catch(() => null)
  if (!service) return {}

  return buildMetadata({
    locale,
    path: `/services/${slug}`,
    title: service.seo?.title || `${service.title} - Dream Dental Group`,
    description: service.seo?.description || truncate(service.excerpt, 158),
    image: mediaUrl(service.seo?.image) || mediaUrl(service.image),
    noindex: service.seo?.noindex ?? false,
  })
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: raw, slug } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const dict = getDictionary(locale)

  const service = await getServiceBySlug(locale, slug).catch(() => null)
  if (!service) notFound()

  const [allServices, allCases, settings] = await Promise.all([
    getServices(locale).catch(() => []),
    getCases(locale).catch(() => []),
    getSettings(locale).catch(() => null),
  ])

  const related = allServices.filter((s) => s.slug !== service.slug).slice(0, 3)
  const relatedCases = allCases.filter((c) =>
    typeof c.treatment === 'object' && c.treatment !== null
      ? c.treatment.id === service.id
      : c.treatment === service.id,
  )
  const doctors = (service.relatedDoctors ?? []).filter(
    (d): d is Exclude<typeof d, number> => typeof d === 'object' && d !== null,
  )

  const hero = mediaUrl(service.image, 'wide')
  const heroDims = mediaDimensions(service.image)
  const phone = settings?.phonePrimary || CLINIC.phonePrimary

  return (
    <>
      <PageHeader
        locale={locale}
        eyebrow={dict.nav.services}
        title={service.title}
        subtitle={service.excerpt}
        breadcrumbs={[
          { label: dict.nav.home, href: '/' },
          { label: dict.nav.services, href: '/services' },
          { label: service.shortTitle || service.title },
        ]}
      />

      <section className="container-page">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
          <div className="min-w-0">
            {hero && (
              <Image
                src={hero}
                alt={mediaAlt(service.image, service.title)}
                width={heroDims.width}
                height={heroDims.height}
                priority
                sizes="(max-width: 1024px) 100vw, 62vw"
                className="shadow-soft mb-10 w-full rounded-[var(--radius-card)] object-cover"
              />
            )}

            <RichText data={service.body} />
          </div>

          {/* Sticky summary: price, duration, key points and the booking CTA. */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <span className="bg-brand-soft text-brand grid h-12 w-12 place-items-center rounded-2xl">
                <Icon name={service.icon} className="h-6 w-6" />
              </span>

              {(service.priceFrom || service.duration) && (
                <dl className="divide-hairline mt-6 divide-y text-sm">
                  {service.priceFrom && (
                    <div className="flex items-baseline justify-between gap-4 py-3">
                      <dt className="text-ink-muted">{dict.labels.from}</dt>
                      <dd className="text-brand text-lg font-semibold">
                        {service.priceFrom}
                        {service.priceTo ? `–${service.priceTo}` : ''} {dict.labels.gel}
                      </dd>
                    </div>
                  )}
                  {service.duration && (
                    <div className="flex items-baseline justify-between gap-4 py-3">
                      <dt className="text-ink-muted">{dict.labels.duration}</dt>
                      <dd className="text-ink font-medium">{service.duration}</dd>
                    </div>
                  )}
                </dl>
              )}

              {service.priceNote && (
                <p className="text-ink-muted mt-3 text-xs leading-relaxed">{service.priceNote}</p>
              )}

              <div className="mt-6 grid gap-2.5">
                <ButtonLink href={localePath(locale, '/contact')}>
                  {dict.cta.bookNow}
                  <ArrowIcon />
                </ButtonLink>
                <ButtonLink href={`tel:${phone}`} variant="outline" external>
                  {dict.cta.callNow}
                </ButtonLink>
              </div>
            </div>

            {service.highlights && service.highlights.length > 0 && (
              <ul className="card mt-4 space-y-3 p-6">
                {service.highlights.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <Icon name={item.icon} className="text-accent mt-0.5 h-5 w-5 shrink-0" />
                    <span className="text-ink-muted text-sm leading-relaxed">{item.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </section>

      {service.gallery && service.gallery.length > 0 && (
        <section className="section">
          <div className="container-page grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {service.gallery
              .filter((img) => mediaUrl(img))
              .map((img, index) => (
                <Reveal key={index} delay={index % 3}>
                  <figure className="relative aspect-4/3 overflow-hidden rounded-[var(--radius-card)]">
                    <Image
                      src={mediaUrl(img, 'card')!}
                      alt={mediaAlt(img, service.title)}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </figure>
                </Reveal>
              ))}
          </div>
        </section>
      )}

      <CasesSection dict={dict} cases={relatedCases} heading={dict.nav.cases} />

      <DoctorsSection locale={locale} dict={dict} doctors={doctors} heading={dict.labels.ourDoctors} />

      {service.faq && service.faq.length > 0 && <Faq title={dict.labels.faq} items={service.faq} />}

      <ServicesGrid
        locale={locale}
        dict={dict}
        services={related}
        heading={dict.labels.relatedServices}
        showAllLink
      />

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'MedicalProcedure',
          name: service.title,
          description: service.excerpt,
          url: `${SITE_URL}/${locale}/services/${service.slug}`,
          procedureType: 'https://schema.org/TherapeuticProcedure',
          ...(hero ? { image: hero.startsWith('http') ? hero : `${SITE_URL}${hero}` } : {}),
          provider: {
            '@type': 'Dentist',
            name: settings?.clinicName || CLINIC.legalName,
            telephone: phone,
            address: {
              '@type': 'PostalAddress',
              streetAddress: settings?.addressLine || CLINIC.street,
              addressLocality: settings?.city || CLINIC.city,
              postalCode: CLINIC.postalCode,
              addressCountry: CLINIC.country,
            },
          },
        }}
      />
    </>
  )
}
