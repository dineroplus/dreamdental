'use client'

import { useEffect, useState } from 'react'
import { getMedia } from '../../admin/media'

type Props = {
  title: string
  statusLabel?: string | null
  imageId?: number | null
  eyebrow?: string
}

/**
 * Large “what you are editing” summary so clinic staff see the change at a glance.
 */
export function EditorPreviewCard({
  title,
  statusLabel,
  imageId,
  eyebrow = 'ასე გამოჩნდება საიტზე',
}: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    if (!imageId) {
      setImageUrl(null)
      return
    }
    getMedia(imageId)
      .then((row) => {
        if (!cancelled) setImageUrl(row?.url ?? null)
      })
      .catch(() => {
        if (!cancelled) setImageUrl(null)
      })
    return () => {
      cancelled = true
    }
  }, [imageId])

  return (
    <div className="border-hairline overflow-hidden rounded-2xl border bg-surface shadow-soft">
      <div className="grid gap-0 sm:grid-cols-[140px_minmax(0,1fr)]">
        <div className="bg-brand-soft relative aspect-[4/3] sm:aspect-auto sm:min-h-[140px]">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview only
            <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="text-ink-muted absolute inset-0 grid place-items-center px-3 text-center text-sm">
              ფოტო არ არის
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center gap-2 p-5">
          <p className="text-brand text-xs font-semibold tracking-[0.14em] uppercase">{eyebrow}</p>
          <h2 className="text-ink text-xl leading-snug font-semibold md:text-2xl">{title || 'უსათაურო'}</h2>
          {statusLabel ? (
            <p className="text-ink-muted text-base">{statusLabel}</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
