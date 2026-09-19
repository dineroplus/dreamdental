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
  const mapSrc = `https://www.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`

  return (
    <section id="contact" className="section">
      <div className="container-page">
        <SectionHeading
          eyebrow={dict.nav.contact}
          title={heading || dict.cta.bookNow}
          subtitle={subheading}
          titleClassName="uppercase"
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
          <Reveal>
            <div className="space-y-4">
              <ul className="card divide-hairline divide-y p-0 text-sm">
                <li className="flex items-start gap-3 p-5">
                  <Icon name="pin" className="text-accent mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-ink-muted text-xs">{dict.labels.address}</p>
                    <p className="text-ink mt-0.5 font-medium">
                      {addressLine}
                      {city ? `, ${city}` : ''}
                    </p>
                    {mapUrl && (
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent mt-1 inline-block text-xs font-semibold"
                      >
                        {dict.cta.directions}
                      </a>
                    )}
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

              <div className="overflow-hidden rounded-[var(--radius-card)]">
                <iframe
                  src={mapSrc}
                  title={`${addressLine}, ${city}`}
                  width="100%"
                  height="260"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="block border-0"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <BookingForm locale={locale} dict={dict} services={services} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
