/** Shared class names so every admin screen uses the same buttons, cards and inputs. */

export const btnPrimary =
  'bg-brand inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 text-base font-semibold text-white transition hover:opacity-90 disabled:opacity-60'

export const btnSecondary =
  'border-hairline text-ink inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border bg-surface px-4 text-base font-semibold transition hover:border-brand hover:text-brand disabled:opacity-60'

export const btnGhost =
  'text-ink-muted inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-base font-medium transition hover:bg-brand-soft hover:text-brand disabled:opacity-60'

export const card = 'border-hairline rounded-2xl border bg-surface shadow-soft'

export const input =
  'border-hairline w-full rounded-xl border bg-surface px-3.5 py-3 text-base text-ink outline-none focus:border-brand'

export type BadgeTone = 'published' | 'draft' | 'featured' | 'new' | 'neutral'

const BADGE: Record<BadgeTone, string> = {
  published: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  draft: 'bg-zinc-100 text-zinc-600 ring-zinc-200',
  featured: 'bg-gold-soft text-amber-800 ring-amber-200',
  new: 'bg-accent-soft text-accent ring-accent/20',
  neutral: 'bg-brand-soft text-brand ring-brand/15',
}

export function badge(tone: BadgeTone) {
  return `inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${BADGE[tone]}`
}
