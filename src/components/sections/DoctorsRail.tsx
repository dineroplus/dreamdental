'use client'

import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/utils'

type Props = {
  children: ReactNode
  prevLabel: string
  nextLabel: string
  className?: string
}

/** Thin chevron — stroke only. */
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
 * One-row doctor carousel. Arrows stay hidden until the rail is hovered
 * (or focused), and vanish again at either end.
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

  const arrowBase =
    'absolute top-[38%] z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-hairline bg-canvas/95 text-ink/60 backdrop-blur-sm transition-opacity duration-250 lg:grid hover:text-brand hover:border-brand/30'

  return (
    <div className={cn('group/rail relative', className)}>
      <div
        ref={ref}
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:gap-5 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      <button
        type="button"
        aria-label={prevLabel}
        disabled={!canPrev}
        onClick={() => scrollByCard(-1)}
        className={cn(
          arrowBase,
          'left-0 -translate-x-1/2',
          canPrev
            ? 'pointer-events-none opacity-0 group-hover/rail:pointer-events-auto group-hover/rail:opacity-100 group-focus-within/rail:pointer-events-auto group-focus-within/rail:opacity-100'
            : 'pointer-events-none opacity-0',
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
          arrowBase,
          'right-0 translate-x-1/2',
          canNext
            ? 'pointer-events-none opacity-0 group-hover/rail:pointer-events-auto group-hover/rail:opacity-100 group-focus-within/rail:pointer-events-auto group-focus-within/rail:opacity-100'
            : 'pointer-events-none opacity-0',
        )}
      >
        <RailChevron dir="next" />
      </button>
    </div>
  )
}
