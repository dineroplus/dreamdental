'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { updateBookingStatus } from '../../admin/actions'
import { StudioIcon } from './StudioIcon'
import { fullDate, phoneDigits, relativeTime, whatsappHref } from './time'
import { btnSecondary, card, input } from './ui'
import { BOOKING_STATUSES, type BookingStatus } from './bookingStatus'

export type BookingView = {
  id: number
  name: string
  phone: string
  email: string | null
  service: string | null
  message: string | null
  notes: string | null
  status: BookingStatus
  createdAt: string
}

export function BookingCard({ booking }: { booking: BookingView }) {
  const router = useRouter()
  const [status, setStatus] = useState<BookingStatus>(booking.status)
  const [notes, setNotes] = useState(booking.notes ?? '')
  const [savedNotes, setSavedNotes] = useState(booking.notes ?? '')
  const [flash, setFlash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function persist(nextStatus: BookingStatus, nextNotes: string, message: string) {
    setError(null)
    startTransition(async () => {
      try {
        await updateBookingStatus(booking.id, nextStatus, nextNotes)
        setSavedNotes(nextNotes)
        setFlash(message)
        window.setTimeout(() => setFlash(null), 2500)
        router.refresh()
      } catch {
        setError('ვერ შეინახა, სცადე თავიდან.')
      }
    })
  }

  function changeStatus(next: BookingStatus) {
    if (next === status) return
    setStatus(next)
    persist(next, notes, 'სტატუსი შეიცვალა')
  }

  function saveNotes() {
    if (notes === savedNotes) return
    persist(status, notes, 'შენიშვნა შენახულია')
  }

  const isNew = status === 'new'

  return (
    <article className={`${card} space-y-4 p-5 ${isNew ? 'border-l-accent border-l-4' : ''}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-ink text-lg font-semibold">{booking.name}</p>
          <p className="text-ink-muted mt-0.5 text-base">
            {booking.phone}
            {booking.email ? ` · ${booking.email}` : ''}
          </p>
          {booking.service ? (
            <p className="bg-brand-soft text-brand mt-2 inline-flex rounded-lg px-2.5 py-1 text-sm font-semibold">
              {booking.service}
            </p>
          ) : null}
        </div>
        <div className="text-right">
          <p className="text-ink text-sm font-semibold" suppressHydrationWarning>
            {relativeTime(booking.createdAt)}
          </p>
          <p className="text-ink-muted text-xs" suppressHydrationWarning>
            {fullDate(booking.createdAt)}
          </p>
        </div>
      </div>

      {booking.message ? (
        <p className="bg-canvas text-ink rounded-xl px-4 py-3 text-base">{booking.message}</p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <a href={`tel:${phoneDigits(booking.phone)}`} className={btnSecondary}>
          <StudioIcon name="phone" className="h-4 w-4" />
          დარეკვა
        </a>
        <a href={whatsappHref(booking.phone)} target="_blank" rel="noopener noreferrer" className={btnSecondary}>
          <StudioIcon name="whatsapp" className="h-4 w-4" />
          WhatsApp
        </a>
      </div>

      <div className="space-y-2">
        <p className="text-ink-muted text-sm font-semibold">სტატუსი</p>
        <div className="bg-canvas grid grid-cols-2 gap-1 rounded-xl p-1 sm:grid-cols-4">
          {BOOKING_STATUSES.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={pending}
              onClick={() => changeStatus(option.value)}
              className={
                status === option.value
                  ? 'bg-brand min-h-11 rounded-lg px-3 text-sm font-semibold text-white shadow-soft'
                  : 'text-ink hover:bg-surface min-h-11 rounded-lg px-3 text-sm font-medium'
              }
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <label className="block space-y-2">
        <span className="text-ink-muted text-sm font-semibold">შენიშვნა (ჩანს მხოლოდ ადმინში)</span>
        <input
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          onBlur={saveNotes}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.currentTarget.blur()
          }}
          placeholder="მაგ. დაურეკეთ, ჩაეწერა ხუთშაბათს 15:00-ზე"
          className={input}
        />
      </label>

      {flash || error || pending ? (
        <p className={`flex items-center gap-1.5 text-sm font-medium ${error ? 'text-red-600' : 'text-emerald-700'}`}>
          {error ? null : <StudioIcon name={pending ? 'clock' : 'check'} className="h-4 w-4" />}
          {error ?? (pending ? 'ინახება…' : flash)}
        </p>
      ) : null}
    </article>
  )
}
