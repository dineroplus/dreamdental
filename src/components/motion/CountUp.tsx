'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

type Props = {
  value: string
  suffix?: string | null
  className?: string
}

/**
 * Counts up to a numeric value when scrolled into view. Values that are not
 * purely numeric (for example "4.9/5") are printed as-is.
 */
export function CountUp({ value, suffix, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduced = useReducedMotion()
  const target = Number(value)
  const isNumeric = value.trim() !== '' && Number.isFinite(target)
  const [display, setDisplay] = useState(() => (isNumeric && !reduced ? 0 : target))

  useEffect(() => {
    if (!isNumeric || reduced || !inView) return

    const duration = 1100
    const start = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      // Ease-out cubic keeps the last digits from crawling.
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(target * eased)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, isNumeric, reduced, target])

  if (!isNumeric) {
    return (
      <span ref={ref} className={className}>
        {value}
        {suffix}
      </span>
    )
  }

  const decimals = value.includes('.') ? value.split('.')[1].length : 0

  return (
    <span ref={ref} className={className}>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  )
}
