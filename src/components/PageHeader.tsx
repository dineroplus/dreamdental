import Link from 'next/link'
import { localePath } from '../lib/utils'
import type { Locale } from '../i18n/config'

type Crumb = { label: string; href?: string }

export function PageHeader({
  locale,
  eyebrow,
  title,
  subtitle,
  breadcrumbs = [],
}: {
  locale: Locale
  eyebrow?: string | null
  title: string
  subtitle?: string | null
  breadcrumbs?: Crumb[]
}) {
  return (
    <header className="relative isolate overflow-hidden">
      <div className="mesh opacity-60" aria-hidden="true" />
      <div className="container-page relative pt-10 pb-10 md:pt-16 md:pb-14">
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="text-ink-muted mb-5 flex flex-wrap items-center gap-1.5 text-xs">
            {breadcrumbs.map((crumb, index) => (
              <span key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
                {index > 0 && <span aria-hidden="true">/</span>}
                {crumb.href ? (
                  <Link href={localePath(locale, crumb.href)} className="hover:text-accent transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-ink">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 className="text-ink mt-3 max-w-3xl text-[clamp(1.9rem,5.5vw,3.25rem)] leading-[1.1]">{title}</h1>
        {subtitle && <p className="text-ink-muted mt-4 max-w-2xl text-base leading-relaxed">{subtitle}</p>}
      </div>
    </header>
  )
}
