export type BookingStatus = 'new' | 'contacted' | 'booked' | 'closed'

export const BOOKING_STATUSES: { value: BookingStatus; label: string }[] = [
  { value: 'new', label: 'ახალი' },
  { value: 'contacted', label: 'დავუკავშირდით' },
  { value: 'booked', label: 'ჩაწერილია' },
  { value: 'closed', label: 'დახურული' },
]

export function isBookingStatus(value: unknown): value is BookingStatus {
  return BOOKING_STATUSES.some((status) => status.value === value)
}
