import Image from 'next/image'
import { cn } from '../../lib/utils'

const FALLBACK_SRC = '/images/hero-smile.jpg'
const FALLBACK_ALT = 'Dream Dental - patient smile'

/**
 * Homepage portrait. Uses the Home singleton image when one is set.
 */
export function HeroDreamVisual({
  className,
  src = FALLBACK_SRC,
  alt = FALLBACK_ALT,
}: {
  className?: string
  src?: string
  alt?: string
}) {
  return (
    <div
      className={cn(
        'relative aspect-[8/9] overflow-hidden rounded-[1.75rem] shadow-lift sm:aspect-[10/9] lg:aspect-[8/9]',
        className,
      )}
    >
      <Image
        src={src || FALLBACK_SRC}
        alt={alt || FALLBACK_ALT}
        fill
        sizes="(max-width: 1024px) 100vw, 45vw"
        className="object-cover object-center"
        priority
        fetchPriority="high"
      />

      <div
        className="absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t from-black/55 to-transparent"
        aria-hidden="true"
      />

      <p className="font-display absolute inset-x-0 bottom-4 z-10 text-center text-[11px] font-semibold tracking-[0.12em] text-white/90 uppercase">
        Dream &amp; Smile
      </p>
    </div>
  )
}
