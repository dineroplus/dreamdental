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

const MAP_ZOOM = 16
const TILE_SIZE = 256

/** Static OSM tiles avoid third-party iframe/privacy blocking. */
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
        url: `https://tile.openstreetmap.org/${MAP_ZOOM}/${currentX}/${currentY}.png`,
      }
    }),
  }
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
  const map = mapTiles(latitude, longitude)
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

              <span
                className="bg-brand shadow-soft absolute top-1/2 left-1/2 z-10 grid h-9 w-9 -translate-x-1/2 -translate-y-full place-items-center rounded-full border-[3px] border-white text-white after:absolute after:-bottom-1 after:h-3 after:w-3 after:rotate-45 after:bg-brand"
                aria-hidden="true"
              >
                <Icon name="tooth" className="relative z-10 h-4 w-4" />
              </span>

              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-canvas/90 text-ink-muted absolute bottom-2 left-2 z-20 rounded px-1.5 py-0.5 text-[9px]"
              >
                © OpenStreetMap
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
