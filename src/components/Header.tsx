'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { LogoLockup, LogoMark } from './Logo'
import { LocaleSwitcher } from './LocaleSwitcher'
import { cn, localePath } from '../lib/utils'
import type { Locale } from '../i18n/config'
import type { Dictionary } from '../i18n/dictionaries'

export type NavItem = { label: string; href: string; children?: { label: string; href: string }[] }

type Props = {
  locale: Locale
  dict: Dictionary
  items: NavItem[]
  logoUrl: string | null
  clinicName: string
  phone: string
}

export function Header({ locale, dict, items, logoUrl, clinicName, phone }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the drawer on navigation and lock the page behind it while open.
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const isActive = (href: string) => {
    const full = localePath(locale, href)
    return href === '/' ? pathname === full : pathname.startsWith(full)
  }

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-canvas/85 border-b border-hairline backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-20">
          <Link
            href={localePath(locale, '/')}
            className="flex shrink-0 items-center gap-2.5"
            aria-label={clinicName}
          >
            {logoUrl ? (
              <Image src={logoUrl} alt={clinicName} width={150} height={44} className="h-9 w-auto lg:h-11" priority />
            ) : (
              <>
                <LogoMark className="h-9 w-auto lg:h-11" animated priority />
                <LogoLockup />
              </>
            )}
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label={dict.nav.menu}>
            {items.map((item) => (
              <Link
                key={item.href}
                href={localePath(locale, item.href)}
                className={cn(
                  'rounded-full px-3.5 py-2 text-sm font-medium uppercase transition-colors',
                  isActive(item.href)
                    ? 'bg-brand-soft text-brand'
                    : 'text-ink-muted hover:text-brand hover:bg-brand-soft/60',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LocaleSwitcher locale={locale} label={dict.misc.languageSwitcher} />

            <a
              href={`tel:${phone}`}
              className="bg-brand hover:bg-accent hidden rounded-full px-5 py-2.5 text-sm font-semibold text-white uppercase transition-colors lg:inline-flex"
            >
              {dict.cta.callNow}
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? dict.nav.close : dict.nav.menu}
              className="border-hairline text-ink grid h-10 w-10 place-items-center rounded-full border bg-surface lg:hidden"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                {open ? (
                  <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                ) : (
                  <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-canvas fixed inset-0 z-40 lg:hidden"
          >
            <nav className="container-page flex h-full flex-col gap-1 overflow-y-auto pt-24 pb-32">
              {items.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * index, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={localePath(locale, item.href)}
                    className={cn(
                      'border-hairline/70 flex items-center justify-between border-b py-4 font-display text-xl uppercase',
                      isActive(item.href) ? 'text-brand' : 'text-ink',
                    )}
                  >
                    {item.label}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
