'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

type Props = {
  beforeSrc: string
  afterSrc: string
  beforeAlt: string
  afterAlt: string
  beforeLabel: string
  afterLabel: string
  hint: string
}

/**
 * Drag-to-compare treatment result. Pointer events cover mouse, touch and pen
 * with one code path; the handle is also focusable and driven by arrow keys so
 * it works without a pointer at all.
 */
export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  beforeLabel,
  afterLabel,
  hint,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(50)
  const [dragging, setDragging] = useState(false)
  const [touched, setTouched] = useState(false)

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const ratio = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(100, Math.max(0, ratio)))
  }, [])

  const onPointerDown = (event: React.PointerEvent) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragging(true)
    setTouched(true)
    updateFromClientX(event.clientX)
  }

  const onPointerMove = (event: React.PointerEvent) => {
    if (!dragging) return
    updateFromClientX(event.clientX)
  }

  const endDrag = (event: React.PointerEvent) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    setDragging(false)
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    const step = event.shiftKey ? 10 : 2
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      setTouched(true)
      setPosition((p) => Math.max(0, p - step))
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      setTouched(true)
      setPosition((p) => Math.min(100, p + step))
    }
  }

  // Nudge the handle once on mount so the control is discoverable without a hint.
  useEffect(() => {
    if (touched) return
    const timer = setTimeout(() => {
      if (!touched) setPosition(58)
    }, 900)
    return () => clearTimeout(timer)
  }, [touched])

  return (
    <div
      ref={containerRef}
      className="group relative aspect-4/3 w-full touch-none overflow-hidden rounded-[var(--radius-card)] bg-black/5 select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <Image
        src={afterSrc}
        alt={afterAlt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
        draggable={false}
      />

      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          clipPath: `inset(0 ${100 - position}% 0 0)`,
          transition: dragging ? 'none' : 'clip-path 420ms var(--ease-out-soft)',
        }}
      >
        <Image
          src={beforeSrc}
          alt={beforeAlt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          draggable={false}
        />
      </div>

      <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-brand/85 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
        {afterLabel}
      </span>

      <div
        className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.35)]"
        style={{
          left: `${position}%`,
          transition: dragging ? 'none' : 'left 420ms var(--ease-out-soft)',
        }}
      >
        <button
          type="button"
          role="slider"
          aria-label={hint}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          onKeyDown={onKeyDown}
          className="absolute top-1/2 left-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full bg-white text-brand shadow-lg ring-1 ring-black/10 transition-transform active:scale-95"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M9 6 4 12l5 6M15 6l5 6-5 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {!touched && (
        <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-[11px] text-white backdrop-blur-sm">
          {hint}
        </span>
      )}
    </div>
  )
}
