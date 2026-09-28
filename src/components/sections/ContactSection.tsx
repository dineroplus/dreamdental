import { Icon, SectionHeading } from '../ui'
import { Reveal } from '../motion/Reveal'
import { BookingForm } from '../BookingForm'
import { formatPhone } from '../../lib/utils'
import type { Locale } from '../../i18n/config'
import type { Dictionary } from '../../i18n/dictionaries'

type Props = {
  locale: Locale
  dict: Dictionary
  services: Array<{ id: number | string; title: string }>
  heading?: string | null
  subheading?: string | null
  addressLine: string
  city: string
  phonePrimary: string
  phoneSecondary?: string
  email: string
  hours: string
  hoursNote?: string | null
  latitude: number
  longitude: number
  mapUrl?: string | null
}

/** Google’s coordinate embed works without an API key. */
function mapEmbedSrc(lat: number, lng: number, locale: Locale): string {
  const query = encodeURIComponent(`${lat},${lng}`)
  return `https://maps.google.com/maps?q=${query}&z=16&hl=${locale}&iwloc=near&output=embed`
}

function directionsHref(lat: number, lng: number, mapUrl?: string | null): string {
  const trimmed = mapUrl?.trim()
  if (trimmed) return trimmed
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
}

export function ContactSection({
  locale,
  dict,
  services,
  heading,
  subheading,
  addressLine,
  city,
  phonePrimary,
  phoneSecondary,
  email,
  hours,
  hoursNote,
  latitude,
  longitude,
  mapUrl,
}: Props) {
  const embedSrc = mapEmbedSrc(latitude, longitude, locale)
  const openMapsHref = directionsHref(latitude, longitude, mapUrl)

  return (
    <section id="contact" className="section">
      <div className="container-page">
        <SectionHeading
          eyebrow={dict.nav.contact}
          title={heading || dict.cta.bookNow}
          subtitle={subheading}
          titleClassName="uppercase"
        />

        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-8">
          <Reveal className="order-1 min-w-0">
            <ul className="card divide-hairline divide-y p-0 text-sm">
              <li className="flex items-start gap-3 p-5">
                <Icon name="pin" className="text-accent mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="text-ink-muted text-xs">{dict.labels.address}</p>
                  <p className="text-ink mt-0.5 font-medium">
                    {addressLine}
                    {city ? `, ${city}` : ''}
                  </p>
                  <a
                    href={openMapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent mt-1 inline-block text-xs font-semibold"
                  >
                    {dict.cta.directions}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3 p-5">
                <Icon name="clock" className="text-accent mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="text-ink-muted text-xs">{dict.labels.workingHours}</p>
                  <p className="text-ink mt-0.5 font-medium">{hours}</p>
                  {hoursNote && <p className="text-ink-muted mt-0.5 text-xs">{hoursNote}</p>}
                </div>
              </li>

              <li className="flex items-start gap-3 p-5">
                <Icon name="shield" className="text-accent mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="text-ink-muted text-xs">{dict.labels.phone}</p>
                  <a href={`tel:${phonePrimary}`} className="text-ink hover:text-accent mt-0.5 block font-medium">
                    {formatPhone(phonePrimary)}
                  </a>
                  {phoneSecondary && (
                    <a
                      href={`tel:${phoneSecondary}`}
                      className="text-ink hover:text-accent mt-0.5 block font-medium"
                    >
                      {formatPhone(phoneSecondary)}
                    </a>
                  )}
                  <a href={`mailto:${email}`} className="text-ink-muted hover:text-accent mt-1 block text-xs">
                    {email}
                  </a>
                </div>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={1} className="order-2 min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <BookingForm locale={locale} dict={dict} services={services} />
          </Reveal>

          <div className="order-3 min-w-0 lg:col-start-1 lg:row-start-2">
            <div className="border-hairline bg-surface relative overflow-hidden rounded-[var(--radius-card)] border">
              <iframe
                src={embedSrc}
                title={`${addressLine}, ${city}`}
                loading="eager"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="bg-surface block h-[220px] w-full border-0 lg:h-[280px]"
              />
              <a
                href={openMapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-canvas/95 text-ink hover:text-brand absolute right-3 bottom-3 rounded-full border border-hairline px-3 py-1.5 text-[11px] font-semibold backdrop-blur-sm transition-colors"
              >
                {dict.cta.directions}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
