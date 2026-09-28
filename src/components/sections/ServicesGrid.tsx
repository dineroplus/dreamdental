import Link from 'next/link'
import { ArrowIcon, ButtonLink, Icon, SectionHeading } from '../ui'
import { Reveal } from '../motion/Reveal'
import { cn, localePath } from '../../lib/utils'
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
  /** Hairline above the section so the previous block clearly ends. */
  divided?: boolean
  /** Tighter top padding when following another section closely. */
  compactTop?: boolean
  /** Hide cards past this count below the `xl` breakpoint (avoids a lonely 3rd). */
  mobileLimit?: number
}

/**
 * Service cards: treatment icon, quiet index and strong title. Treatment
 * images stay on the detail pages.
 */
export function ServicesGrid({
  locale,
  dict,
  services,
  heading,
  subheading,
  showAllLink = true,
  hideHeading = false,
  divided = false,
  compactTop = false,
  mobileLimit,
}: Props) {
  if (services.length === 0) return null

  return (
    <section
      className={cn(
        hideHeading ? 'section pt-2' : 'section',
        compactTop && '!pt-8 md:!pt-10',
      )}
    >
      {divided && (
        <div className="container-page" aria-hidden="true">
          <div className="border-hairline mb-8 border-t md:mb-10" />
        </div>
      )}

      <div className="container-page">
        {!hideHeading && (
          <SectionHeading
            eyebrow={dict.nav.services}
            title={heading || dict.nav.services}
            subtitle={subheading}
          />
        )}

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {services.map((service, index) => (
            <Reveal
              key={service.id}
              delay={index % 3}
              as="article"
              className={
                mobileLimit != null && index >= mobileLimit ? 'max-xl:hidden' : undefined
              }
            >
              <Link
                href={localePath(locale, `/services/${service.slug}`)}
                className="card group relative flex h-full flex-col overflow-hidden px-5 pt-5 pb-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift sm:px-5 sm:pt-5 md:px-6 md:pt-6"
              >
                <span
                  className="from-accent/15 via-gold/10 absolute inset-x-0 top-0 h-px bg-linear-to-r to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden="true"
                />
                <span
                  className="bg-accent/8 absolute -top-20 -right-16 h-36 w-36 rounded-full transition-transform duration-500 group-hover:scale-[2.4]"
                  aria-hidden="true"
                />

                <div className="relative flex items-center justify-between">
                  <span className="bg-accent-soft text-accent grid h-11 w-11 place-items-center rounded-xl transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                    <Icon name={service.icon} className="h-6 w-6" />
                  </span>
                  <span className="text-gold/80 font-display text-[0.7rem] font-semibold tracking-[0.22em]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="text-ink relative mt-4 text-[1.15rem] leading-snug font-semibold tracking-tight sm:mt-5 sm:text-[1.2rem] md:text-[1.28rem]">
                  {service.shortTitle || service.title}
                </h3>

                <p className="text-ink-muted relative mt-2.5 line-clamp-3 flex-1 text-sm leading-relaxed sm:mt-3">
                  {service.excerpt}
                </p>

                {/*
                  Phone (1 col): price + CTA side by side.
                  Tablet (2 col): stack so Georgian labels don’t collide.
                  Desktop (3 col): side by side again.
                */}
                <span className="border-hairline relative mt-5 flex flex-row items-center justify-between gap-2 border-t pt-4 sm:mt-5 sm:flex-col sm:items-start sm:gap-2 xl:flex-row xl:items-center xl:justify-between">
                  {service.priceFrom ? (
                    <span className="text-brand shrink-0 text-sm font-semibold">
                      {dict.labels.from} {service.priceFrom}
                      {dict.labels.gel}
                    </span>
                  ) : (
                    <span />
                  )}
                  <span className="text-accent inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold">
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
