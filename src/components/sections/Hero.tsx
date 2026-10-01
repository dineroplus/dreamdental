import { ButtonLink, Icon } from '../ui'
import { Reveal } from '../motion/Reveal'
import { HeroDreamVisual } from './HeroDreamVisual'
import { uiCaps } from '../../lib/georgian'
import { cn, localePath } from '../../lib/utils'
import type { Locale } from '../../i18n/config'
import type { Dictionary } from '../../i18n/dictionaries'

type Props = {
  locale: Locale
  dict: Dictionary
  title: string
  subtitle?: string | null
  bullets: string[]
  phone: string
  whatsapp: string
  mapUrl?: string | null
  ctaLabel?: string | null
  ctaHref?: string | null
  imageSrc?: string | null
  imageAlt?: string | null
  eyebrow?: string | null
}

/** Two lines. Georgian and Russian keep their dash; English is YOUR SMILE IS / OUR REPUTATION. */
function titleLines(title: string): string[] {
  const trimmed = title.trim()
  if (!trimmed) return []
  if (/^your smile(\s+[-–—]\s+|\s+)(is\s+)?our reputation$/i.test(trimmed)) {
    return ['Your smile is', 'our reputation']
  }
  if (trimmed.includes('\n')) {
    return trimmed.split('\n').map((line) => line.trim()).filter(Boolean)
  }
  const dashed = trimmed.split(/\s+[–—-]\s+/)
  if (dashed.length === 2) return [`${dashed[0].trim()} -`, dashed[1].trim()]
  return [trimmed]
}

export function Hero({
  locale,
  dict,
  title,
  subtitle,
  bullets,
  phone,
  whatsapp,
  mapUrl,
  ctaLabel,
  ctaHref,
  imageSrc,
  imageAlt,
  eyebrow,
}: Props) {
  const lines = titleLines(title)

  return (
    <section className="relative isolate overflow-hidden">
      <div className="mesh opacity-70" aria-hidden="true" />

      <div className="container-page relative grid items-center gap-10 pt-10 pb-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-20 lg:pb-24">
        <div className="min-w-0">
          {eyebrow ? (
            <Reveal>
              <p className="text-gold mb-3 text-xs font-semibold tracking-[0.18em] uppercase">{eyebrow}</p>
            </Reveal>
          ) : null}

          <div className="max-w-full">
            <Reveal>
              <h1
                className={cn(
                  'text-[clamp(2rem,4.6vw,3.5rem)] uppercase [text-wrap:wrap] max-[380px]:text-[clamp(1.55rem,8vw,1.85rem)]',
                  locale === 'ka' && '[font-family:var(--font-georgian)]',
                  locale === 'en' && 'lg:text-[clamp(2rem,4.35vw,3.35rem)]',
                )}
              >
                {lines.map((line) => (
                  <span
                    key={line}
                    className="text-gradient block leading-[1.22] pb-[0.12em] tracking-normal whitespace-nowrap [text-wrap:nowrap]"
                  >
                    {uiCaps(line, locale).replaceAll(' ', '\u00A0')}
                  </span>
                ))}
              </h1>
            </Reveal>

            {subtitle && (
              <Reveal delay={1}>
                <p className="text-ink-muted mt-4 max-w-xl text-sm leading-relaxed md:text-base">
                  {subtitle}
                </p>
              </Reveal>
            )}
          </div>

          {bullets.length > 0 && (
            <Reveal delay={2}>
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
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

          <Reveal delay={3}>
            {/*
              Primary sets the block width; Call + WhatsApp share that same
              edge so the three CTAs finish together.
            */}
            <div className="mt-9 inline-grid max-w-full grid-cols-2 gap-3">
              <ButtonLink
                href={ctaHref ? localePath(locale, ctaHref) : localePath(locale, '/contact')}
                className="col-span-2 w-full uppercase"
              >
                <Icon name="calendar" className="h-4 w-4" />
                {ctaLabel || dict.cta.bookNow}
              </ButtonLink>

              <a
                href={`tel:${phone}`}
                className="border-brand/25 text-brand hover:bg-brand-soft inline-flex items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold uppercase transition-colors"
              >
                <Icon name="phone" className="h-4 w-4" />
                {dict.cta.callNow}
              </a>

              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border-brand/25 text-brand hover:bg-brand-soft inline-flex items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold uppercase transition-colors"
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

            <HeroDreamVisual src={imageSrc || undefined} alt={imageAlt || undefined} />

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
