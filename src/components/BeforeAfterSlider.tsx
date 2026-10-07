'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type Props = {
  beforeSrc: string
  afterSrc: string
  beforeAlt: string
  afterAlt: string
  beforeLabel: string
  afterLabel: string
  hint?: string
}

/**
 * Drag to compare two treatment photos. The frame is the uploaded picture
 * itself, so a wide smile is never cropped into a taller box.
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

  useEffect(() => {
    if (touched) return
    const timer = setTimeout(() => {
      if (!touched) setPosition(58)
    }, 900)
    return () => clearTimeout(timer)
  }, [touched])

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mb-2 flex items-center justify-between px-1 text-xs font-medium tracking-wide">
        <span className="text-ink-muted">{beforeLabel}</span>
        <span className="text-brand">{afterLabel}</span>
      </div>

      <div
        ref={containerRef}
        className="group relative w-full touch-none overflow-hidden rounded-[var(--radius-card)] shadow-[0_10px_28px_rgba(90,50,40,0.08)] select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {/* The after photo sets the frame, so the box matches the file. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- intrinsic ratio, so the uploaded frame is not cropped */}
        <img src={afterSrc} alt={afterAlt} draggable={false} className="block h-auto w-full" />

        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath: `inset(0 ${100 - position}% 0 0)`,
            transition: dragging ? 'none' : 'clip-path 420ms var(--ease-out-soft)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- same frame as the photo underneath */}
          <img
            src={beforeSrc}
            alt={beforeAlt}
            draggable={false}
            className="absolute inset-0 h-full w-full object-contain"
          />
        </div>

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
      </div>

      {!touched && hint ? <p className="text-ink-muted mt-2 text-center text-[11px]">{hint}</p> : null}
    </div>
  )
}
