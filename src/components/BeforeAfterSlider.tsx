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
 * A treatment result shown as two complete photos. The picture keeps the shape
 * it was uploaded in, so a wide smile is never cropped into a taller frame.
 */
export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  beforeLabel,
  afterLabel,
}: Props) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
      <figure>
        <figcaption className="text-ink-muted mb-2 px-1 text-xs font-medium tracking-wide">
          {beforeLabel}
        </figcaption>
        {/* The file itself sets the shape. No fill, no cover, no fixed frame. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- intrinsic ratio, so the uploaded frame is not cropped */}
        <img
          src={beforeSrc}
          alt={beforeAlt}
          className="block h-auto w-full rounded-[var(--radius-card)] shadow-[0_10px_28px_rgba(90,50,40,0.08)]"
        />
      </figure>
      <figure>
        <figcaption className="text-brand mb-2 px-1 text-xs font-medium tracking-wide">
          {afterLabel}
        </figcaption>
        {/* eslint-disable-next-line @next/next/no-img-element -- intrinsic ratio, so the uploaded frame is not cropped */}
        <img
          src={afterSrc}
          alt={afterAlt}
          className="block h-auto w-full rounded-[var(--radius-card)] shadow-[0_10px_28px_rgba(90,50,40,0.08)]"
        />
      </figure>
    </div>
  )
}
