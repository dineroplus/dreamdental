'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '../lib/utils'
import type { Locale } from '../i18n/config'
import type { Dictionary } from '../i18n/dictionaries'

type Props = {
  locale: Locale
  dict: Dictionary
  services: Array<{ id: number | string; title: string }>
}

const FIELD =
  'w-full rounded-2xl border border-hairline bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted/70 transition-colors focus:border-accent focus:outline-none'

export function BookingForm({ locale, dict, services }: Props) {
  const pathname = usePathname()
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())

    setState('sending')
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, locale, sourcePath: pathname }),
      })
      if (!res.ok) throw new Error('request failed')
      setState('sent')
      form.reset()
    } catch {
      setState('error')
    }
  }

  if (state === 'sent') {
    return (
      <div className="card grid place-items-center p-10 text-center">
        <span className="bg-brand-soft text-brand grid h-14 w-14 place-items-center rounded-full">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="text-ink mt-4 text-base font-semibold">{dict.form.success}</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-3 p-6 md:p-8">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="sr-only">{dict.form.name}</span>
          <input name="name" required autoComplete="name" placeholder={dict.form.name} className={FIELD} />
        </label>

        <label className="block">
          <span className="sr-only">{dict.form.phone}</span>
          <input
            name="phone"
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder={dict.form.phone}
            className={FIELD}
          />
        </label>
      </div>

      <label className="block">
        <span className="sr-only">{dict.form.email}</span>
        <input name="email" type="email" autoComplete="email" placeholder={dict.form.email} className={FIELD} />
      </label>

      {services.length > 0 && (
        <label className="block">
          <span className="sr-only">{dict.form.service}</span>
          <select name="service" defaultValue="" className={cn(FIELD, 'appearance-none')}>
            <option value="">{dict.form.servicePlaceholder}</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.title}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="block">
        <span className="sr-only">{dict.form.message}</span>
        <textarea name="message" rows={3} placeholder={dict.form.message} className={cn(FIELD, 'resize-none')} />
      </label>

      {state === 'error' && <p className="text-accent text-sm">{dict.form.error}</p>}

      <button
        type="submit"
        disabled={state === 'sending'}
        className="bg-brand hover:bg-accent w-full rounded-full py-3.5 text-sm font-semibold text-white uppercase transition-colors disabled:opacity-60"
      >
        {state === 'sending' ? dict.cta.sending : dict.cta.bookNow}
      </button>

      <p className="text-ink-muted text-center text-xs leading-relaxed">{dict.form.consent}</p>
    </form>
  )
}
