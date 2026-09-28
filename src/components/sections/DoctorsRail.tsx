'use client'

import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/utils'

type Props = {
  children: ReactNode
  prevLabel: string
  nextLabel: string
  className?: string
}

/** Thin chevron used on the doctors carousel — stroke only, no fill blob. */
function RailChevron({ dir }: { dir: 'prev' | 'next' }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={dir === 'prev' ? 'rtl:rotate-180' : 'rotate-180 rtl:rotate-0'}
    >
      <path
        d="M14.5 5.5 8 12l6.5 6.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * One-row doctor carousel with soft snap and slim side arrows.
 * Arrows fade out at the ends so the rail never feels stuck mid-scroll.
 */
export function DoctorsRail({ children, prevLabel, nextLabel, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setCanPrev(el.scrollLeft > 6)
    setCanNext(max > 6 && el.scrollLeft < max - 6)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [update, children])

  const scrollByCard = (direction: -1 | 1) => {
    const el = ref.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('article')
    const gap = 20
    const step = card ? card.offsetWidth + gap : Math.round(el.clientWidth * 0.72)
    el.scrollBy({ left: direction * step, behavior: 'smooth' })
  }

  return (
    <div className={cn('relative', className)}>
      <div
        ref={ref}
        className="-mx-5 flex snap-x snap-proximity gap-4 overflow-x-auto scroll-smooth px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:gap-5 sm:px-0 lg:pb-1 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      <button
        type="button"
        aria-label={prevLabel}
        disabled={!canPrev}
        onClick={() => scrollByCard(-1)}
        className={cn(
          'border-hairline bg-canvas/90 text-ink/55 absolute top-[38%] left-0 z-10 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border backdrop-blur-md transition-all duration-300 lg:grid',
          'hover:border-brand/35 hover:text-brand hover:shadow-soft',
          'disabled:pointer-events-none disabled:opacity-0',
        )}
      >
        <RailChevron dir="prev" />
      </button>

      <button
        type="button"
        aria-label={nextLabel}
        disabled={!canNext}
        onClick={() => scrollByCard(1)}
        className={cn(
          'border-hairline bg-canvas/90 text-ink/55 absolute top-[38%] right-0 z-10 hidden h-11 w-11 translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border backdrop-blur-md transition-all duration-300 lg:grid',
          'hover:border-brand/35 hover:text-brand hover:shadow-soft',
          'disabled:pointer-events-none disabled:opacity-0',
        )}
      >
        <RailChevron dir="next" />
      </button>
    </div>
  )
}
