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

const MAP_ZOOM = 17
const CLINIC_COORDINATES = { latitude: 41.6969488, longitude: 44.8060416 }
const LEGACY_COORDINATES = { latitude: 41.6977, longitude: 44.8015 }

/** Embedded Google map. The old CARTO tiles now render an API-key watermark instead of streets. */
function mapEmbedSrc(lat: number, lng: number, locale: Locale): string {
  const params = new URLSearchParams({
    q: `${lat},${lng}`,
    hl: locale,
    z: String(MAP_ZOOM),
    output: 'embed',
  })
  return `https://maps.google.com/maps?${params.toString()}`
}

function directionsHref(lat: number, lng: number, mapUrl?: string | null): string {
  const trimmed = mapUrl?.trim()
  if (trimmed) return trimmed
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
}

/** Replace the old fallback point, which was ~380 m west of the clinic. */
function correctedCoordinates(latitude: number, longitude: number) {
  const isLegacyPoint =
    Math.abs(latitude - LEGACY_COORDINATES.latitude) < 0.00001 &&
    Math.abs(longitude - LEGACY_COORDINATES.longitude) < 0.00001

  return isLegacyPoint ? CLINIC_COORDINATES : { latitude, longitude }
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
  const coordinates = correctedCoordinates(latitude, longitude)
  const embedSrc = mapEmbedSrc(coordinates.latitude, coordinates.longitude, locale)
  const openMapsHref = directionsHref(coordinates.latitude, coordinates.longitude, mapUrl)

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
            <div className="border-hairline relative h-[220px] overflow-hidden rounded-[var(--radius-card)] border lg:h-[280px]">
              <iframe
                title={`${addressLine}, ${city}`}
                src={embedSrc}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <a
                href={openMapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-canvas/95 text-ink hover:text-brand absolute top-3 right-3 z-10 rounded-full border border-hairline px-3 py-1.5 text-[11px] font-semibold backdrop-blur-sm transition-colors"
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
