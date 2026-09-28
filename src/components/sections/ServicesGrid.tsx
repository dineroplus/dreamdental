import Link from 'next/link'
import { ArrowIcon, ButtonLink, SectionHeading } from '../ui'
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

/**
 * Typography-led service cards. Generic icons read as filler on a dental
 * homepage; a quiet index + strong title carries the brand better, while
 * treatment images stay on the detail pages.
 */
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

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.id} delay={index % 3} as="article">
              <Link
                href={localePath(locale, `/services/${service.slug}`)}
                className="card group relative flex h-full flex-col overflow-hidden px-6 pt-6 pb-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <span
                  className="from-accent/15 via-gold/10 absolute inset-x-0 top-0 h-px bg-linear-to-r to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden="true"
                />
                <span
                  className="bg-accent/8 absolute -top-20 -right-16 h-36 w-36 rounded-full transition-transform duration-500 group-hover:scale-[2.4]"
                  aria-hidden="true"
                />

                <div className="relative">
                  <span className="text-gold/80 font-display text-[0.7rem] font-semibold tracking-[0.22em]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="text-ink relative mt-5 text-[1.2rem] leading-snug font-semibold tracking-tight md:text-[1.28rem]">
                  {service.shortTitle || service.title}
                </h3>

                <p className="text-ink-muted relative mt-3 line-clamp-3 flex-1 text-sm leading-relaxed">
                  {service.excerpt}
                </p>

                <span className="border-hairline relative mt-6 flex items-center justify-between border-t pt-4">
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
