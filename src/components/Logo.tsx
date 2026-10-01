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
  size = 'md',
}: {
  className?: string
  tone?: 'ink' | 'light'
  /** Header lockup stays smaller so the menu and the call button keep their own space. */
  size?: 'md' | 'header'
}) {
  return (
    <span className={cn('font-display inline-flex w-max flex-col items-center leading-none font-semibold', className)}>
      <span
        className={cn(
          'text-gold leading-none tracking-tight whitespace-nowrap',
          size === 'header'
            ? 'text-[0.68rem] sm:text-[0.78rem] lg:text-[0.76rem] xl:text-[0.9rem] 2xl:text-[1.02rem]'
            : 'text-[0.82rem] lg:text-[0.92rem] xl:text-[1.05rem]',
        )}
      >
        Dream Dental &amp; Aesthetic
      </span>
      <span
        className={cn(
          'mt-1 leading-none',
          size === 'header'
            ? 'text-[0.56rem] tracking-[0.22em] sm:text-[0.62rem] lg:text-[0.6rem] lg:tracking-[0.24em] xl:text-[0.72rem] 2xl:text-[0.8rem]'
            : 'text-[0.68rem] tracking-[0.28em] lg:text-[0.74rem] xl:text-[0.84rem]',
          tone === 'light' ? 'text-white/85' : 'text-brand',
        )}
      >
        Group
      </span>
    </span>
  )
}
