import Link from 'next/link'
import { LogoLockup, LogoMark } from './Logo'
import { uiCaps } from '../lib/georgian'
import { formatPhone, localePath } from '../lib/utils'
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
}: Props) {
  const socials = [
    { href: facebook, label: 'Facebook', path: 'M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1Z' },
    {
      href: instagram,
      label: 'Instagram',
      path: 'M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM17.5 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Z',
    },
    { href: youtube, label: 'YouTube', path: 'M21.6 7.2A2.5 2.5 0 0 0 19.8 5.4C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5 3-5 3Z' },
  ].filter((s) => Boolean(s.href))

  return (
    <footer className="bg-ink mt-16 text-white/75">
      <div className="container-page py-14 lg:py-20">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5 text-white">
              <LogoMark className="h-11 w-auto" />
              <LogoLockup tone="light" />
            </div>
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
                    className="hover:bg-accent grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d={s.path} stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
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
