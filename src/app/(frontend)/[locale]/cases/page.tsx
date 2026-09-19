import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, locales, type Locale } from '../../../../i18n/config'
import { getDictionary } from '../../../../i18n/dictionaries'
import { getCases, getTestimonials } from '../../../../lib/data'
import { buildMetadata } from '../../../../lib/metadata'
import { mediaAlt, mediaUrl } from '../../../../lib/utils'
import { PageHeader } from '../../../../components/PageHeader'
import { BeforeAfterSlider } from '../../../../components/BeforeAfterSlider'
import { Reveal } from '../../../../components/motion/Reveal'
import { Badge } from '../../../../components/ui'
import { TestimonialsSection } from '../../../../components/sections/TestimonialsSection'

export const revalidate = 300

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

const REVIEWS_HEADING: Record<Locale, string> = {
  ka: 'რას ამბობენ პაციენტები',
  en: 'What patients say',
  ru: 'Что говорят пациенты',
}

const INTRO: Record<Locale, string> = {
  ka: 'რეალური პაციენტების რეალური შედეგები - იმპლანტაცია, ვინირები, ორთოდონტია და ესთეტიკური რესტავრაცია. ყველა ფოტო გამოქვეყნებულია პაციენტის წერილობითი თანხმობით.',
  en: 'Real results from real patients - implants, veneers, orthodontics and aesthetic restoration. Every photo is published with the patient’s written consent.',
  ru: 'Реальные результаты реальных пациентов - импланты, виниры, ортодонтия и эстетическая реставрация. Каждое фото опубликовано с письменного согласия пациента.',
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
    path: '/cases',
    title: `${dict.nav.cases} - Before / After - Dream Dental Group`,
    description: INTRO[locale],
  })
}

export default async function CasesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const dict = getDictionary(locale)

  const [cases, testimonials] = await Promise.all([
    getCases(locale).catch(() => []),
    getTestimonials(locale).catch(() => []),
  ])

  const usable = cases.filter((c) => mediaUrl(c.beforeImage) && mediaUrl(c.afterImage))

  return (
    <>
      <PageHeader
        locale={locale}
        eyebrow="Before / After"
        title={dict.nav.cases}
        subtitle={INTRO[locale]}
        breadcrumbs={[{ label: dict.nav.home, href: '/' }, { label: dict.nav.cases }]}
      />

      {usable.length > 0 && (
        <section className="container-page section pt-0">
          <div className="grid gap-10 md:grid-cols-2 md:gap-8">
            {usable.map((item, index) => {
              const treatment =
                typeof item.treatment === 'object' && item.treatment !== null ? item.treatment : null
              const doctor = typeof item.doctor === 'object' && item.doctor !== null ? item.doctor : null

              return (
                <Reveal key={item.id} delay={index % 2} as="article">
                  <BeforeAfterSlider
                    beforeSrc={mediaUrl(item.beforeImage, 'card')!}
                    afterSrc={mediaUrl(item.afterImage, 'card')!}
                    beforeAlt={mediaAlt(item.beforeImage, `${item.title} - ${dict.labels.before}`)}
                    afterAlt={mediaAlt(item.afterImage, `${item.title} - ${dict.labels.after}`)}
                    beforeLabel={dict.labels.before}
                    afterLabel={dict.labels.after}
                    hint={dict.labels.dragToCompare}
                  />

                  <h2 className="text-ink mt-4 text-base leading-snug">{item.title}</h2>

                  {item.description && (
                    <p className="text-ink-muted mt-1.5 text-sm leading-relaxed">{item.description}</p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {treatment && <Badge tone="brand">{treatment.title}</Badge>}
                    {doctor && <Badge tone="accent">{doctor.name}</Badge>}
                    {item.duration && (
                      <Badge tone="gold">
                        {dict.labels.duration}: {item.duration}
                      </Badge>
                    )}
                  </div>
                </Reveal>
              )
            })}
          </div>
        </section>
      )}

      <TestimonialsSection dict={dict} testimonials={testimonials} heading={REVIEWS_HEADING[locale]} />
    </>
  )
}
