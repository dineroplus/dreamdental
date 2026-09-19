import Image from 'next/image'
import { SectionHeading } from '../ui'
import { Reveal } from '../motion/Reveal'
import { mediaAlt, mediaUrl } from '../../lib/utils'
import type { Dictionary } from '../../i18n/dictionaries'
import type { Testimonial } from '../../payload-types'

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
}: {
  dict: Dictionary
  testimonials: Testimonial[]
  heading?: string | null
  subheading?: string | null
}) {
  if (testimonials.length === 0) return null

  return (
    <section className="bg-surface section">
      <div className="container-page">
        <SectionHeading title={heading || dict.nav.cases} subtitle={subheading} />
      </div>

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
                <figure className="card flex h-full flex-col p-6">
                  <Stars rating={item.rating ?? 5} />

                  <blockquote className="text-ink mt-4 flex-1 text-sm leading-relaxed">
                    “{item.quote}”
                  </blockquote>

                  <figcaption className="mt-5 flex items-center gap-3">
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
                        {item.patientName.trim().charAt(0)}
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
      </div>
    </section>
  )
}
