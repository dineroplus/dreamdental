'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { locales, localeShortLabels, localeLabels, type Locale } from '../i18n/config'
import { cn } from '../lib/utils'

/**
 * Swaps the leading locale segment while keeping the rest of the path, so the
 * visitor stays on the page they were reading. Rendered as real links, which
 * also gives crawlers a path between language versions.
 */
export function LocaleSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const pathFor = (next: Locale) => {
    const segments = pathname.split('/')
    segments[1] = next
    return segments.join('/') || `/${next}`
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        aria-label={label}
        aria-expanded={open}
        className="border-hairline text-ink hover:border-accent flex h-10 items-center gap-1 rounded-full border bg-surface px-3 text-xs font-semibold transition-colors"
      >
        {localeShortLabels[locale]}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <ul className="border-hairline absolute end-0 top-12 z-50 min-w-36 overflow-hidden rounded-2xl border bg-surface py-1 shadow-lift">
          {locales.map((code) => (
            <li key={code}>
              <Link
                href={pathFor(code)}
                hrefLang={code}
                scroll={false}
                className={cn(
                  'block px-4 py-2.5 text-sm transition-colors',
                  code === locale ? 'text-brand bg-brand-soft font-semibold' : 'text-ink hover:bg-canvas',
                )}
              >
                {localeLabels[code]}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
