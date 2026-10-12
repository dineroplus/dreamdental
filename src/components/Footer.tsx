import Link from 'next/link'
import { LogoMark, ORIGINAL_LOCKUP } from './Logo'
import { uiCaps } from '../lib/georgian'
import { cn, formatPhone, localePath } from '../lib/utils'
import type { Locale } from '../i18n/config'
import type { Dictionary } from '../i18n/dictionaries'

type Column = {
  /** Optional because a column added in /admin is saved before it is filled in. */
  title?: string | null
  id?: string | null
  links?: { label: string; href: string; id?: string | null }[] | null
}

type Props = {
  locale: Locale
  dict: Dictionary
  columns: Column[]
  clinicName: string
  addressLine: string
  city: string
  phonePrimary: string
  phoneSecondary?: string
  email: string
  hours: string
  facebook?: string
  instagram?: string
  youtube?: string
  tiktok?: string
  tagline?: string | null
}

export function Footer({
  locale,
  dict,
  columns,
  clinicName,
  addressLine,
  city,
  phonePrimary,
  phoneSecondary,
  email,
  hours,
  facebook,
  instagram,
  youtube,
  tiktok,
  tagline,
}: Props) {
  const socials: {
    href?: string
    label: string
    path: string
    background?: string
    filled?: boolean
  }[] = [
    {
      href: facebook,
      label: 'Facebook',
      path: 'M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1Z',
      background: '#1877F2',
      filled: true,
    },
    {
      href: instagram,
      label: 'Instagram',
      path: 'M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM17.5 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Z',
      background: 'linear-gradient(45deg, #f9ce34, #ee2a7b 55%, #6228d7)',
    },
    { href: youtube, label: 'YouTube', path: 'M21.6 7.2A2.5 2.5 0 0 0 19.8 5.4C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5 3-5 3Z' },
    {
      href: tiktok,
      label: 'TikTok',
      path: 'M19.6 6.7a4.8 4.8 0 0 1-3.8-4.2V2h-3.4v13.7a2.9 2.9 0 0 1-2.9 2.5 2.9 2.9 0 0 1-2.9-2.9 2.9 2.9 0 0 1 2.9-2.9c.3 0 .5 0 .8.1V9.1a6.4 6.4 0 0 0-.8 0A6.3 6.3 0 0 0 3.2 15a6.3 6.3 0 0 0 6.3 6.3 6.3 6.3 0 0 0 6.4-6.3V8.8a8.2 8.2 0 0 0 4.7 1.5V6.8a4.8 4.8 0 0 1-1-.1Z',
    },
  ].filter((s) => Boolean(s.href))

  return (
    <footer className="bg-ink mt-16 text-white/75">
      <div className="container-page py-12 lg:py-16">
        <Link href={localePath(locale, '/')} className="inline-flex">
          <LogoMark
            src={ORIGINAL_LOCKUP}
            alt={clinicName}
            width={758}
            height={471}
            sizes="180px"
            className="h-16 w-auto"
          />
        </Link>
        {tagline ? <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/80">{tagline}</p> : null}

        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div>
            <h3 className="font-display text-sm tracking-wide text-white uppercase">
              {uiCaps(dict.labels.address, locale)}
            </h3>
            <p className="mt-4 text-sm leading-relaxed">
              {addressLine}
              {city ? `, ${city}` : ''}
            </p>
            <p className="mt-3 text-sm">
              <span className="block text-white/50">{dict.labels.workingHours}</span>
              {hours}
            </p>

            {socials.length > 0 && (
              <div className="mt-5 flex gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    style={s.background ? { background: s.background } : undefined}
                    className={cn(
                      'grid h-10 w-10 place-items-center rounded-full text-white transition',
                      s.background ? 'hover:brightness-110' : 'bg-white/10 hover:bg-accent',
                    )}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d={s.path}
                        fill={s.filled ? 'currentColor' : 'none'}
                        stroke={s.filled ? 'none' : 'currentColor'}
                        strokeWidth={s.filled ? undefined : 1.7}
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>

          {columns.map((column, index) => (
            <div key={column.id ?? index}>
              <h3 className="font-display text-sm tracking-wide text-white uppercase">
                {uiCaps(column.title ?? '', locale)}
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {column.links?.map((link, linkIndex) => (
                  <li key={link.id ?? linkIndex}>
                    <Link href={localePath(locale, link.href)} className="hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-display text-sm tracking-wide text-white uppercase">
              {uiCaps(dict.nav.contact, locale)}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href={`tel:${phonePrimary}`} className="hover:text-white transition-colors">
                  {formatPhone(phonePrimary)}
                </a>
              </li>
              {phoneSecondary && (
                <li>
                  <a href={`tel:${phoneSecondary}`} className="hover:text-white transition-colors">
                    {formatPhone(phoneSecondary)}
                  </a>
                </li>
              )}
              <li>
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {clinicName}. {dict.labels.allRightsReserved}.
          </p>
        </div>
      </div>

      {/* Clears the fixed mobile action bar. */}
      <div className="h-20 lg:hidden" aria-hidden="true" />
    </footer>
  )
}
