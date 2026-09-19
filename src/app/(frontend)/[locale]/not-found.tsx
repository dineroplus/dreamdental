import Link from 'next/link'
import { defaultLocale, isLocale, type Locale } from '../../../i18n/config'
import { getDictionary } from '../../../i18n/dictionaries'
import { localePath } from '../../../lib/utils'
import { ArrowIcon, ButtonLink, Icon, Orbs } from '../../../components/ui'

/**
 * Rendered for unknown paths inside a locale. The locale segment is not
 * available to not-found.tsx as a param, so the links fall back to Georgian -
 * which is where an unknown URL should land anyway.
 */
export default function LocaleNotFound() {
  const locale: Locale = isLocale(defaultLocale) ? defaultLocale : 'ka'
  const dict = getDictionary(locale)

  const links = [
    { label: dict.nav.services, href: '/services' },
    { label: dict.nav.doctors, href: '/doctors' },
    { label: dict.nav.cases, href: '/cases' },
    { label: dict.nav.contact, href: '/contact' },
  ]

  return (
    <section className="relative isolate grid min-h-[70vh] place-items-center overflow-hidden">
      <Orbs className="opacity-50" />

      <div className="container-page relative py-20 text-center">
        <span className="bg-brand-soft text-brand mx-auto grid h-16 w-16 place-items-center rounded-3xl">
          <Icon name="tooth" className="h-8 w-8" />
        </span>

        <p className="text-gradient font-display mt-8 text-[clamp(3rem,12vw,6rem)] leading-none font-semibold">
          404
        </p>

        <h1 className="text-ink mt-4 text-[clamp(1.4rem,4vw,2rem)]">{dict.misc.notFoundTitle}</h1>
        <p className="text-ink-muted mx-auto mt-3 max-w-md text-sm leading-relaxed">
          {dict.misc.notFoundText}
        </p>

        <div className="mt-8">
          <ButtonLink href={localePath(locale, '/')} size="lg">
            {dict.misc.backHome}
            <ArrowIcon />
          </ButtonLink>
        </div>

        <nav className="mt-10 flex flex-wrap justify-center gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={localePath(locale, link.href)}
              className="border-hairline text-ink-muted hover:text-brand hover:border-brand/30 rounded-full border px-4 py-2 text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  )
}
