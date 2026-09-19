import Image from 'next/image'
import { ArrowIcon, ButtonLink, SectionHeading } from '../ui'
import { Reveal } from '../motion/Reveal'
import { REVIEW_PLATFORMS } from '../../lib/reviews'
import { mediaAlt, mediaUrl } from '../../lib/utils'
import type { Dictionary } from '../../i18n/dictionaries'
import type { Testimonial } from '../../content/schema'

function Stars({ rating }: { rating: number }) {
  return (
    <div className="text-gold flex gap-0.5" aria-label={`${rating}/5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < rating ? 'currentColor' : 'none'} aria-hidden="true">
          <path
            d="m12 3 2.6 5.6 6 .8-4.4 4.2 1.1 6.1L12 16.8 6.7 19.7l1.1-6.1L3.4 9.4l6-.8Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  )
}

/** Renders a country flag from its ISO code without shipping an icon set. */
function Flag({ code }: { code?: string | null }) {
  if (!code || code.length !== 2) return null
  const emoji = String.fromCodePoint(
    ...code.toUpperCase().split('').map((c) => 0x1f1a5 + c.charCodeAt(0)),
  )
  return <span aria-hidden="true">{emoji}</span>
}

export function TestimonialsSection({
  dict,
  testimonials,
  heading,
  subheading,
  viewAllHref,
}: {
  dict: Dictionary
  testimonials: Testimonial[]
  heading?: string | null
  subheading?: string | null
  viewAllHref?: string
}) {
  return (
    <section className="bg-surface section">
      <div className="container-page">
        <SectionHeading title={heading || dict.labels.patientReviews} subtitle={subheading} />

        <ul className="mt-8 grid grid-cols-3 gap-3">
          {REVIEW_PLATFORMS.map((platform) => (
            <li key={platform.name}>
              <a
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card block px-2 py-4 text-center transition-shadow hover:shadow-lift sm:px-4"
              >
                <p className="text-ink-muted text-[10px] font-semibold tracking-wide uppercase">
                  {platform.name}
                </p>
                <p className="text-gradient font-display mt-1 text-xl font-semibold sm:text-2xl">
                  {platform.score}
                  {platform.suffix}
                </p>
                <p className="text-ink-muted mt-1 text-[11px] sm:text-xs">
                  {platform.count} {dict.labels.reviews}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {testimonials.length > 0 && (
        <div className="container-page mt-10">
          <div className="rail -mx-5 px-5 md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 lg:grid-cols-3">
            {testimonials.map((item, index) => {
              const photo = mediaUrl(item.photo, 'thumb')
              return (
                <Reveal
                  key={item.id}
                  delay={index % 3}
                  as="article"
                  className="w-[80vw] sm:w-[60vw] md:w-auto"
                >
                  <figure className="card flex flex-col p-4 sm:p-5">
                    <Stars rating={item.rating ?? 5} />

                    <blockquote
                      className="text-ink mt-3 line-clamp-6 text-sm leading-relaxed"
                      title={item.quote}
                    >
                      “{item.quote}”
                    </blockquote>

                    <figcaption className="mt-4 flex items-center gap-3">
                      {photo ? (
                        <Image
                          src={photo}
                          alt={mediaAlt(item.photo, item.patientName)}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="bg-brand-soft text-brand grid h-10 w-10 place-items-center rounded-full text-sm font-semibold">
                          {(item.patientName ?? '?').trim().charAt(0) || '?'}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="text-ink truncate text-sm font-semibold">{item.patientName}</p>
                        {item.country && (
                          <p className="text-ink-muted flex items-center gap-1 text-xs">
                            <Flag code={item.countryCode} />
                            {item.country}
                          </p>
                        )}
                      </div>
                    </figcaption>
                  </figure>
                </Reveal>
              )
            })}
          </div>

          {viewAllHref && (
            <div className="mt-10 text-center">
              <ButtonLink href={viewAllHref} variant="outline">
                {dict.cta.viewAll}
                <ArrowIcon />
              </ButtonLink>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
