'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { uiCaps } from '../lib/georgian'
import { cn, localePath } from '../lib/utils'
import type { Locale } from '../i18n/config'
import type { Dictionary } from '../i18n/dictionaries'

type Props = {
  locale: Locale
  dict: Dictionary
  phone: string
  whatsapp: string
}

/**
 * Persistent call / WhatsApp / book bar. Almost all traffic is mobile, so the
 * three conversion actions stay within thumb reach at all times. It appears
 * after the hero so it never covers the first screen.
 */
export function MobileActionBar({ locale, dict, phone, whatsapp }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 380)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 lg:hidden',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="border-hairline bg-canvas/92 grid grid-cols-3 gap-2 border-t p-2.5 backdrop-blur-xl">
        <a
          href={`tel:${phone}`}
          className="border-hairline text-ink flex h-12 flex-col items-center justify-center gap-0.5 rounded-2xl border bg-surface text-[11px] font-semibold uppercase"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5L17 13l4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 3.5 5.2 2 2 0 0 1 5.5 3h1Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
          {uiCaps(dict.cta.call, locale)}
        </a>

        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 flex-col items-center justify-center gap-0.5 rounded-2xl bg-[#25D366] text-[11px] font-semibold text-white uppercase"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.5 14.1c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-1.7-.1a12 12 0 0 1-6.3-5.5c-.5-.8-.8-1.7-.8-2.5 0-.9.5-1.4.7-1.6.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2 0 .4-.1.6l-.4.5c-.1.2-.3.3-.1.6a9 9 0 0 0 3.9 3.3c.3.1.5.1.6-.1l.7-.8c.2-.2.3-.2.6-.1l1.8.9c.3.1.4.2.5.3 0 .1 0 .7-.3 1.3Z" />
          </svg>
          {dict.cta.whatsapp}
        </a>

        <Link
          href={localePath(locale, '/contact')}
          className="bg-brand flex h-12 flex-col items-center justify-center gap-0.5 rounded-2xl text-[11px] font-semibold text-white uppercase"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
            <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          {uiCaps(dict.cta.book, locale)}
        </Link>
      </div>
    </div>
  )
}
