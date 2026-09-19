import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { isLocale, locales, localeLabels, type Locale } from '../../../../../i18n/config'
import { getDictionary } from '../../../../../i18n/dictionaries'
import {
  getAllSlugs,
  getCases,
  getDoctorBySlug,
  getDoctors,
  getSettings,
} from '../../../../../lib/data'
import { buildMetadata } from '../../../../../lib/metadata'
import { CLINIC, SITE_URL } from '../../../../../lib/site'
import { doctorPhotoUrl } from '../../../../../lib/doctorPhotos'
import { localePath, mediaAlt, mediaUrl, richTextToPlain } from '../../../../../lib/utils'
import { PageHeader } from '../../../../../components/PageHeader'
import { RichText } from '../../../../../components/RichText'
import { JsonLd } from '../../../../../components/JsonLd'
import { ArrowIcon, ButtonLink, Icon, Badge } from '../../../../../components/ui'
import { CasesSection } from '../../../../../components/sections/CasesSection'
import { DoctorsSection } from '../../../../../components/sections/DoctorsSection'

export const revalidate = 300

const LANGUAGE_NAMES: Record<string, string> = {
  ka: localeLabels.ka,
  en: localeLabels.en,
  ru: localeLabels.ru,
  de: 'Deutsch',
  tr: 'Türkçe',
  ar: 'العربية',
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs('doctors').catch(() => [])
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

  const doctor = await getDoctorBySlug(locale, slug).catch(() => null)
  if (!doctor) return {}

  return buildMetadata({
    locale,
    path: `/doctors/${slug}`,
    title: doctor.seo?.title || `${doctor.name} - ${doctor.specialty}`,
    description:
      doctor.seo?.description || richTextToPlain(doctor.bio, 158) || `${doctor.name} - ${doctor.specialty}`,
    image: mediaUrl(doctor.seo?.image) || doctorPhotoUrl(doctor),
    noindex: doctor.seo?.noindex ?? false,
  })
}

export default async function DoctorDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: raw, slug } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const dict = getDictionary(locale)

  const doctor = await getDoctorBySlug(locale, slug).catch(() => null)
  if (!doctor) notFound()

  const [allDoctors, allCases, settings] = await Promise.all([
    getDoctors(locale).catch(() => []),
    getCases(locale).catch(() => []),
    getSettings(locale).catch(() => null),
  ])

  const colleagues = allDoctors.filter((d) => d.slug !== doctor.slug).slice(0, 4)
  const doctorCases = allCases.filter((c) =>
    typeof c.doctor === 'object' && c.doctor !== null ? c.doctor.id === doctor.id : c.doctor === doctor.id,
  )

  const photo = doctorPhotoUrl(doctor, 'card')
  const phone = settings?.phonePrimary || CLINIC.phonePrimary
  const years = doctor.experienceSince ? new Date().getFullYear() - doctor.experienceSince : null

  return (
    <>
      <PageHeader
        locale={locale}
        eyebrow={doctor.role || dict.labels.ourDoctors}
        title={doctor.name}
        subtitle={doctor.specialty}
        breadcrumbs={[
          { label: dict.nav.home, href: '/' },
          { label: dict.nav.doctors, href: '/doctors' },
          { label: doctor.name },
        ]}
      />

      <section className="container-page">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-brand-soft relative aspect-3/4 overflow-hidden rounded-[var(--radius-card)]">
              {photo ? (
                <Image
                  src={photo}
                  alt={mediaAlt(doctor.photo, doctor.name)}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 38vw"
                  className="object-contain object-bottom p-4 pt-8"
                />
              ) : (
                <div className="grid h-full place-items-center">
                  <Icon name="tooth" className="text-brand/25 h-20 w-20" />
                </div>
              )}
            </div>

            <dl className="card divide-hairline mt-4 divide-y p-0 text-sm">
              <div className="p-5">
                <dt className="text-ink-muted text-xs">{dict.labels.specialty}</dt>
                <dd className="text-ink mt-0.5 font-medium">{doctor.specialty}</dd>
              </div>

              {years !== null && (
                <div className="p-5">
                  <dt className="text-ink-muted text-xs">{dict.misc.yearsOfExperience}</dt>
                  <dd className="text-ink mt-0.5 font-medium">{years}+</dd>
                </div>
              )}

              {doctor.languages && doctor.languages.length > 0 && (
                <div className="p-5">
                  <dt className="text-ink-muted text-xs">{dict.labels.languages}</dt>
                  <dd className="mt-2 flex flex-wrap gap-1.5">
                    {doctor.languages.map((code) => (
                      <Badge key={code} tone="brand">
                        {LANGUAGE_NAMES[code] ?? code}
                      </Badge>
                    ))}
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-4 grid gap-2.5">
              <ButtonLink href={localePath(locale, '/contact')}>
                {dict.cta.bookNow}
                <ArrowIcon />
              </ButtonLink>
              <ButtonLink href={`tel:${phone}`} variant="outline" external>
                {dict.cta.callNow}
              </ButtonLink>
            </div>
          </div>

          <div className="min-w-0">
            <RichText data={doctor.bio} />

            {doctor.credentials && doctor.credentials.length > 0 && (
              <ul className="mt-10 space-y-3">
                {doctor.credentials.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <Icon name="check" className="text-accent mt-0.5 h-5 w-5 shrink-0" />
                    <span className="text-ink-muted text-sm leading-relaxed">{item.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <CasesSection dict={dict} cases={doctorCases} heading={dict.nav.cases} />

      <DoctorsSection locale={locale} dict={dict} doctors={colleagues} heading={dict.labels.ourDoctors} />

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Physician',
          name: doctor.name,
          medicalSpecialty: doctor.specialty,
          url: `${SITE_URL}/${locale}/doctors/${doctor.slug}`,
          ...(photo ? { image: photo.startsWith('http') ? photo : `${SITE_URL}${photo}` } : {}),
          worksFor: {
            '@type': 'Dentist',
            name: settings?.clinicName || CLINIC.legalName,
            url: `${SITE_URL}/${locale}`,
          },
        }}
      />
    </>
  )
}
