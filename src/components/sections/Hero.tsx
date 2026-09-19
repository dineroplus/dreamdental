import { ArrowIcon, ButtonLink, Icon } from '../ui'
import { Reveal } from '../motion/Reveal'
import { HeroDreamVisual } from './HeroDreamVisual'
import { uiCaps } from '../../lib/georgian'
import { localePath } from '../../lib/utils'
import type { Locale } from '../../i18n/config'
import type { Dictionary } from '../../i18n/dictionaries'

type Props = {
  locale: Locale
  dict: Dictionary
  brand: string
  title: string
  subtitle?: string | null
  bullets: string[]
  phone: string
  whatsapp: string
  mapUrl?: string | null
  ctaLabel?: string | null
  ctaHref?: string | null
}

export function Hero({
  locale,
  dict,
  brand,
  title,
  subtitle,
  bullets,
  phone,
  whatsapp,
  mapUrl,
  ctaLabel,
  ctaHref,
}: Props) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="mesh opacity-70" aria-hidden="true" />

      <div className="container-page relative grid items-center gap-10 pt-10 pb-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-20 lg:pb-24">
        <div>
          <Reveal>
            <p className="font-display text-brand text-base font-semibold tracking-tight md:text-lg">
              {brand}
            </p>
          </Reveal>

          <Reveal delay={1}>
            <h1 className="mt-3 text-[clamp(2rem,6.5vw,3.6rem)] leading-[1.08] uppercase">
              <span className="text-gradient">{uiCaps(title, locale)}</span>
            </h1>
          </Reveal>

          {subtitle && (
            <Reveal delay={2}>
              <p className="text-ink-muted mt-5 max-w-xl text-base leading-relaxed md:text-lg">
                {subtitle}
              </p>
            </Reveal>
          )}

          {bullets.length > 0 && (
            <Reveal delay={3}>
              <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
                {bullets.map((text) => (
                  <li key={text} className="text-ink flex items-start gap-2.5 text-sm">
                    <span className="bg-brand-soft text-brand mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full">
                      <Icon name="check" className="h-3 w-3" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          <Reveal delay={4}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink
                href={ctaHref ? localePath(locale, ctaHref) : localePath(locale, '/contact')}
                className="uppercase"
              >
                {ctaLabel || dict.cta.bookNow}
                <ArrowIcon />
              </ButtonLink>

              <a
                href={`tel:${phone}`}
                className="border-brand/25 text-brand hover:bg-brand-soft inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold uppercase transition-colors"
              >
                <Icon name="clock" className="h-4 w-4" />
                {dict.cta.callNow}
              </a>

              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border-brand/25 text-brand hover:bg-brand-soft inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold uppercase transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.5 14.1c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-1.7-.1a12 12 0 0 1-6.3-5.5c-.5-.8-.8-1.7-.8-2.5 0-.9.5-1.4.7-1.6.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2 0 .4-.1.6l-.4.5c-.1.2-.3.3-.1.6a9 9 0 0 0 3.9 3.3c.3.1.5.1.6-.1l.7-.8c.2-.2.3-.2.6-.1l1.8.9c.3.1.4.2.5.3 0 .1 0 .7-.3 1.3Z" />
                </svg>
                {dict.cta.whatsapp}
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={2} direction="left">
          <div className="relative">
            <div
              className="bg-accent/12 absolute -inset-3 -rotate-2 rounded-[2rem] md:-inset-5"
              aria-hidden="true"
            />
            <div className="bg-gold/12 absolute -inset-2 rotate-1 rounded-[2rem] md:-inset-4" aria-hidden="true" />

            <HeroDreamVisual />

            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="card text-ink absolute -bottom-4 left-4 flex items-center gap-2 px-4 py-2.5 text-xs font-semibold shadow-lift md:left-6"
              >
                <Icon name="pin" className="text-accent h-4 w-4" />
                {dict.cta.directions}
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
