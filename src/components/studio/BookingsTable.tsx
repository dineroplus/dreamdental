'use client'

import { useTransition } from 'react'
import { updateBookingStatus } from '../../admin/actions'

const STATUSES = [
  { value: 'new', label: 'ახალი' },
  { value: 'contacted', label: 'დაკავშირებული' },
  { value: 'booked', label: 'დაჯავშნილი' },
  { value: 'closed', label: 'დახურული' },
] as const

type BookingRow = {
  id: number
  name: string
  phone: string
  email: string | null
  message: string | null
  serviceSlug: string | null
  locale: string | null
  sourcePath: string | null
  status: 'new' | 'contacted' | 'booked' | 'closed'
  notes: string | null
  createdAt: string
}

export function BookingsTable({ bookings }: { bookings: BookingRow[] }) {
  const [pending, startTransition] = useTransition()

  return (
    <div className="border-hairline overflow-x-auto rounded-2xl border bg-surface">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-brand-soft/40 text-ink-muted text-xs uppercase">
          <tr>
            <th className="px-4 py-3 font-medium">თარიღი</th>
            <th className="px-4 py-3 font-medium">კლიენტი</th>
            <th className="px-4 py-3 font-medium">სერვისი</th>
            <th className="px-4 py-3 font-medium">სტატუსი</th>
            <th className="px-4 py-3 font-medium">შენიშვნა</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-hairline border-t align-top">
              <td className="text-ink-muted px-4 py-3 whitespace-nowrap">
                {new Date(booking.createdAt).toLocaleString('ka-GE')}
              </td>
              <td className="px-4 py-3">
                <p className="font-medium">{booking.name}</p>
                <p className="text-ink-muted text-xs">{booking.phone}</p>
                {booking.email ? <p className="text-ink-muted text-xs">{booking.email}</p> : null}
                {booking.message ? <p className="mt-2 text-xs">{booking.message}</p> : null}
              </td>
              <td className="text-ink-muted px-4 py-3 font-mono text-xs">
                {booking.serviceSlug || '—'}
              </td>
              <td className="px-4 py-3">
                <select
                  className="border-hairline rounded-xl border px-2 py-1.5 text-sm"
                  defaultValue={booking.status}
                  disabled={pending}
                  onChange={(event) => {
                    const status = event.target.value as BookingRow['status']
                    startTransition(async () => {
                      await updateBookingStatus(booking.id, status, booking.notes ?? undefined)
                    })
                  }}
                >
                  {STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3">
                <textarea
                  className="border-hairline w-full min-w-[10rem] rounded-xl border px-2 py-1.5 text-xs"
                  rows={2}
                  defaultValue={booking.notes ?? ''}
                  disabled={pending}
                  onBlur={(event) => {
                    const notes = event.target.value
                    if (notes === (booking.notes ?? '')) return
                    startTransition(async () => {
                      await updateBookingStatus(booking.id, booking.status, notes)
                    })
                  }}
                />
              </td>
            </tr>
          ))}
          {bookings.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-ink-muted px-4 py-10 text-center">
                ჯავშნები ჯერ არ არის.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  )
}
