import Image from 'next/image'
import { cn } from '../lib/utils'

import logoSrc from '../../public/brand/logo.png'

type Props = {
  className?: string
  /** Fades and scales the mark in on mount. Used in the header only. */
  animated?: boolean
  priority?: boolean
}

/**
 * The clinic's lotus mark. Sized by height at the call site - pair the class
 * with `w-auto` so the 1.31:1 artwork is never squashed. A logo uploaded in
 * Clinic settings replaces it automatically.
 */
export function LogoMark({ className, animated = false, priority = false }: Props) {
  return (
    <Image
      src={logoSrc}
      alt="Dream Dental & Aesthetic Group"
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
    <span className={cn('block leading-none', className)}>
      <span
        className={cn(
          'font-display block text-[0.95rem] leading-none font-semibold tracking-tight',
          tone === 'light' ? 'text-white' : 'text-ink',
        )}
      >
        Dream Dental
      </span>
      <span
        className={cn(
          'mt-1 block text-[0.52rem] leading-none font-semibold tracking-[0.3em] uppercase',
          tone === 'light' ? 'text-white/60' : 'text-gold',
        )}
      >
        Aesthetic Group
      </span>
    </span>
  )
}
