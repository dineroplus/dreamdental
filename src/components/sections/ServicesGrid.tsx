import Link from 'next/link'
import { ArrowIcon, ButtonLink, Icon, SectionHeading } from '../ui'
import { Reveal } from '../motion/Reveal'
import { localePath } from '../../lib/utils'
import type { Locale } from '../../i18n/config'
import type { Dictionary } from '../../i18n/dictionaries'
import type { Service } from '../../content/schema'

type Props = {
  locale: Locale
  dict: Dictionary
  services: Service[]
  heading?: string | null
  subheading?: string | null
  showAllLink?: boolean
  /** Set when the page already has an <h1> saying the same thing. */
  hideHeading?: boolean
}

export function ServicesGrid({
  locale,
  dict,
  services,
  heading,
  subheading,
  showAllLink = true,
  hideHeading = false,
}: Props) {
  if (services.length === 0) return null

  return (
    <section className={hideHeading ? 'section pt-2' : 'section'}>
      <div className="container-page">
        {!hideHeading && (
          <SectionHeading eyebrow={dict.nav.services} title={heading || dict.nav.services} subtitle={subheading} />
        )}

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.id} delay={index % 3} as="article">
              <Link
                href={localePath(locale, `/services/${service.slug}`)}
                className="card group relative flex h-full flex-col overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                {/* Warm wash that grows on hover, cheaper than animating a shadow. */}
                <span
                  className="bg-accent/8 absolute -top-16 -right-16 h-32 w-32 rounded-full transition-transform duration-500 group-hover:scale-[2.6]"
                  aria-hidden="true"
                />

                <span className="bg-brand-soft text-brand relative grid h-12 w-12 place-items-center rounded-2xl">
                  <Icon name={service.icon} className="h-6 w-6" />
                </span>

                <h3 className="text-ink relative mt-5 text-lg leading-snug">
                  {service.shortTitle || service.title}
                </h3>

                <p className="text-ink-muted relative mt-2 line-clamp-3 flex-1 text-sm leading-relaxed">
                  {service.excerpt}
                </p>

                <span className="relative mt-5 flex items-center justify-between">
                  {service.priceFrom ? (
                    <span className="text-brand text-sm font-semibold">
                      {dict.labels.from} {service.priceFrom}
                      {dict.labels.gel}
                    </span>
                  ) : (
                    <span />
                  )}
                  <span className="text-accent inline-flex items-center gap-1.5 text-sm font-semibold">
                    {dict.cta.learnMore}
                    <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        {showAllLink && (
          <div className="mt-10 text-center">
            <ButtonLink href={localePath(locale, '/services')} variant="outline">
              {dict.cta.viewAll}
              <ArrowIcon />
            </ButtonLink>
          </div>
        )}
      </div>
    </section>
  )
}
