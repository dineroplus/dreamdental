import Image from 'next/image'
import { cn } from '../lib/utils'

import logoSrc from '../../public/brand/logo.png'

type Props = {
  className?: string
  /** Fades and scales the mark in on mount. Used in the header only. */
  animated?: boolean
  priority?: boolean
  /** Clinic settings logo. Falls back to the bundled lotus mark. */
  src?: string | null
  alt?: string
}

/**
 * The clinic's lotus mark. Sized by height at the call site - pair the class
 * with `w-auto` so the 1.31:1 artwork is never squashed. A logo uploaded in
 * Clinic settings replaces it automatically.
 */
export function LogoMark({
  className,
  animated = false,
  priority = false,
  src,
  alt = 'Dream Dental & Aesthetic Group',
}: Props) {
  return (
    <Image
      src={src || logoSrc}
      alt={alt}
      width={160}
      height={122}
      priority={priority}
      sizes="160px"
      className={cn(
        'object-contain',
        animated && 'origin-center [animation:ddg-in_.7s_var(--ease-spring)_both]',
        className,
      )}
    />
  )
}

/** Wordmark shown beside the mark in the header and footer. */
export function LogoLockup({
  className,
  tone = 'ink',
}: {
  className?: string
  tone?: 'ink' | 'light'
}) {
  return (
    <span className={cn('font-display inline-flex w-max flex-col items-center leading-none font-semibold', className)}>
      <span className="text-gold text-[0.82rem] leading-none tracking-tight whitespace-nowrap lg:text-[0.92rem] xl:text-[1.05rem]">
        Dream Dental &amp; Aesthetic
      </span>
      <span
        className={cn(
          'mt-1 text-[0.68rem] leading-none tracking-[0.28em] lg:text-[0.74rem] xl:text-[0.84rem]',
          tone === 'light' ? 'text-white/85' : 'text-brand',
        )}
      >
        Group
      </span>
    </span>
  )
}
