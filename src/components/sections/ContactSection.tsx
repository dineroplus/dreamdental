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
const TILE_SIZE = 256
const CLINIC_COORDINATES = { latitude: 41.6969488, longitude: 44.8060416 }
const LEGACY_COORDINATES = { latitude: 41.6977, longitude: 44.8015 }

/** Light-labelled tiles avoid iframe blocking while keeping a Google-like look. */
function mapTiles(lat: number, lng: number) {
  const scale = 2 ** MAP_ZOOM
  const x = ((lng + 180) / 360) * scale
  const latRadians = (lat * Math.PI) / 180
  const y =
    ((1 - Math.log(Math.tan(latRadians) + 1 / Math.cos(latRadians)) / Math.PI) / 2) *
    scale
  const tileX = Math.floor(x)
  const tileY = Math.floor(y)
  const startX = tileX - 1
  const startY = tileY - 1

  return {
    markerX: (x - startX) * TILE_SIZE,
    markerY: (y - startY) * TILE_SIZE,
    tiles: Array.from({ length: 9 }, (_, index) => {
      const column = index % 3
      const row = Math.floor(index / 3)
      const currentX = startX + column
      const currentY = startY + row
      return {
        key: `${currentX}-${currentY}`,
        column,
        row,
        url: `https://a.basemaps.cartocdn.com/light_all/${MAP_ZOOM}/${currentX}/${currentY}@2x.png`,
      }
    }),
  }
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
  const map = mapTiles(coordinates.latitude, coordinates.longitude)
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
            <div
              className="border-hairline bg-brand-soft relative h-[220px] overflow-hidden rounded-[var(--radius-card)] border lg:h-[280px]"
              role="img"
              aria-label={`${addressLine}, ${city}`}
            >
              <div
                className="absolute h-[768px] w-[768px]"
                style={{
                  left: `calc(50% - ${map.markerX}px)`,
                  top: `calc(50% - ${map.markerY}px)`,
                }}
                aria-hidden="true"
              >
                {map.tiles.map((tile) => (
                  <span
                    key={tile.key}
                    className="absolute block h-64 w-64 bg-cover bg-center"
                    style={{
                      left: tile.column * TILE_SIZE,
                      top: tile.row * TILE_SIZE,
                      backgroundImage: `url("${tile.url}")`,
                    }}
                  />
                ))}
              </div>

              <svg
                viewBox="0 0 32 44"
                className="absolute top-1/2 left-1/2 z-10 h-11 w-8 -translate-x-1/2 -translate-y-full drop-shadow-[0_3px_4px_rgba(0,0,0,0.28)]"
                aria-hidden="true"
              >
                <path
                  d="M16 1C7.7 1 1 7.7 1 16c0 10.8 12.7 25 14.1 26.5a1.2 1.2 0 0 0 1.8 0C18.3 41 31 26.8 31 16 31 7.7 24.3 1 16 1Z"
                  fill="#c9384a"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle cx="16" cy="16" r="5.5" fill="white" />
              </svg>

              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-canvas/90 text-ink-muted absolute bottom-2 left-2 z-20 rounded px-1.5 py-0.5 text-[9px]"
              >
                © OpenStreetMap © CARTO
              </a>

              <div
                className="pointer-events-none absolute inset-0 ring-1 ring-black/5 ring-inset"
                aria-hidden="true"
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
