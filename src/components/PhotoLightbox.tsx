'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Reveal } from './motion/Reveal'

export type GalleryPhoto = {
  src: string
  full: string
  alt: string
  title?: string | null
}

type Labels = {
  close: string
  previous: string
  next: string
}

/**
 * Gallery photos open at full size. The dialog sits on document.body so a
 * transformed parent cannot trap the fixed overlay.
 */
export function PhotoLightbox({
  photos,
  labels,
  layout,
}: {
  photos: GalleryPhoto[]
  labels: Labels
  layout: 'masonry' | 'strip' | 'grid'
}) {
  const [index, setIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (index === null) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setIndex(null)
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault()
        const rtl = document.documentElement.dir === 'rtl'
        const forward = event.key === 'ArrowRight' ? !rtl : rtl
        setIndex((current) => {
          if (current === null) return current
          const step = forward ? 1 : -1
          return (current + step + photos.length) % photos.length
        })
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [index, photos.length])

  function step(delta: number) {
    setIndex((current) => {
      if (current === null) return current
      return (current + delta + photos.length) % photos.length
    })
  }

  const open = index !== null ? photos[index] : null

  const thumbs = photos.map((photo, photoIndex) => (
    <PhotoButton key={`${photo.src}-${photoIndex}`} photo={photo} layout={layout} onOpen={() => setIndex(photoIndex)} />
  ))

  return (
    <>
      {layout === 'masonry' ? (
        <div className="gap-3 [column-count:2] md:gap-4 md:[column-count:3]">
          {photos.map((photo, photoIndex) => (
            <Reveal
              key={`${photo.src}-${photoIndex}`}
              delay={photoIndex % 3}
              className="mb-3 inline-block w-full break-inside-avoid md:mb-4"
            >
              <PhotoButton photo={photo} layout={layout} onOpen={() => setIndex(photoIndex)} />
            </Reveal>
          ))}
        </div>
      ) : layout === 'strip' ? (
        <div className="rail px-5">{thumbs}</div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {photos.map((photo, photoIndex) => (
            <Reveal key={`${photo.src}-${photoIndex}`} delay={photoIndex % 3}>
              <PhotoButton photo={photo} layout={layout} onOpen={() => setIndex(photoIndex)} />
            </Reveal>
          ))}
        </div>
      )}

      {mounted && open && index !== null
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label={open.alt || open.title || labels.close}
              className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4 sm:p-8"
              onClick={() => setIndex(null)}
            >
              <p className="absolute start-4 top-4 text-sm text-white/80">
                {index + 1} / {photos.length}
              </p>
              <button
                type="button"
                aria-label={labels.close}
                className="absolute end-4 top-3 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
                onClick={() => setIndex(null)}
              >
                <CloseIcon />
              </button>

              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label={labels.previous}
                    className="absolute start-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25 sm:start-6"
                    onClick={(event) => {
                      event.stopPropagation()
                      step(-1)
                    }}
                  >
                    <ChevronIcon direction="previous" />
                  </button>
                  <button
                    type="button"
                    aria-label={labels.next}
                    className="absolute end-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25 sm:end-6"
                    onClick={(event) => {
                      event.stopPropagation()
                      step(1)
                    }}
                  >
                    <ChevronIcon direction="next" />
                  </button>
                </>
              )}

              <figure className="relative flex h-[85vh] w-full max-w-6xl items-center justify-center" onClick={(event) => event.stopPropagation()}>
                {/* The original file, not the optimizer: a click must show the photo. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={open.full} alt={open.alt} className="max-h-full max-w-full object-contain" />
                {open.title ? (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pt-10 pb-3 text-center text-sm font-medium text-white">
                    {open.title}
                  </figcaption>
                ) : null}
              </figure>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}

function PhotoButton({
  photo,
  layout,
  onOpen,
}: {
  photo: GalleryPhoto
  layout: 'masonry' | 'strip' | 'grid'
  onOpen: () => void
}) {
  const frame =
    layout === 'strip'
      ? 'relative h-56 w-[72vw] shrink-0 overflow-hidden rounded-[var(--radius-card)] sm:h-72 sm:w-[46vw] lg:w-[28vw]'
      : layout === 'grid'
        ? 'relative block aspect-4/3 w-full overflow-hidden rounded-[var(--radius-card)]'
        : 'relative inline-block w-full overflow-hidden rounded-[var(--radius-card)] text-start'

  return (
    <a
      href={photo.full}
      onClick={(event) => {
        event.preventDefault()
        onOpen()
      }}
      aria-label={photo.alt || photo.title || undefined}
      className={`group cursor-zoom-in ${frame}`}
    >
      {layout === 'masonry' ? (
        <Image
          src={photo.src}
          alt=""
          width={800}
          height={600}
          sizes="(max-width: 768px) 50vw, 33vw"
          className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <Image
          src={photo.src}
          alt=""
          fill
          sizes={layout === 'strip' ? '(max-width: 640px) 72vw, (max-width: 1024px) 46vw, 28vw' : '(max-width: 768px) 50vw, 33vw'}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      {photo.title ? (
        <span
          className={
            layout === 'masonry'
              ? 'absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/75 to-transparent p-4 text-start text-sm font-medium text-white transition-transform duration-300 group-hover:translate-y-0'
              : 'absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-start text-sm font-medium text-white'
          }
        >
          {photo.title}
        </span>
      ) : null}
    </a>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function ChevronIcon({ direction }: { direction: 'previous' | 'next' }) {
  const rtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl'
  const pointsLeft = direction === 'previous' ? !rtl : rtl
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d={pointsLeft ? 'M14.5 6.5 9 12l5.5 5.5' : 'M9.5 6.5 15 12l-5.5 5.5'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
