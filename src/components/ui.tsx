import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '../lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  tone = 'light',
  className,
  titleClassName,
}: {
  eyebrow?: string | null
  title: string
  subtitle?: string | null
  align?: 'center' | 'start'
  tone?: 'light' | 'dark'
  className?: string
  titleClassName?: string
}) {
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' ? 'mx-auto text-center' : 'text-start',
        className,
      )}
    >
      {eyebrow && (
        <span className={cn('eyebrow', tone === 'dark' && 'text-gold')}>
          <span
            className={cn(
              'inline-block h-1 w-5 rounded-full',
              tone === 'dark' ? 'bg-gold' : 'bg-accent',
            )}
          />
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          'display-2 mt-4',
          tone === 'dark' ? 'text-white' : 'text-ink',
          titleClassName,
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'mt-5 text-base leading-relaxed md:text-lg',
            tone === 'dark' ? 'text-white/70' : 'text-ink-muted',
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

type ButtonProps = {
  href: string
  children: ReactNode
  variant?: 'primary' | 'outline' | 'ghost' | 'light'
  size?: 'md' | 'lg'
  className?: string
  external?: boolean
}

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className,
  external,
}: ButtonProps) {
  const styles = cn(
    'group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold',
    'transition-[transform,box-shadow,background-color,color] duration-300 active:scale-[0.97]',
    size === 'lg' ? 'px-8 py-4 text-base' : 'px-6 py-3 text-sm',
    variant === 'primary' && 'bg-brand text-white shadow-soft hover:shadow-glow',
    variant === 'outline' && 'border border-brand/25 text-brand hover:border-brand/45 hover:bg-brand-soft',
    variant === 'ghost' && 'text-brand hover:bg-brand-soft',
    variant === 'light' && 'bg-white text-brand shadow-soft hover:shadow-lift',
    className,
  )

  const content = (
    <>
      {/* Diagonal sheen that sweeps across on hover. */}
      {(variant === 'primary' || variant === 'light') && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full"
        />
      )}
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </>
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={styles}>
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={styles}>
      {content}
    </Link>
  )
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className={cn('transition-transform duration-300 group-hover/btn:translate-x-1', className)}
      aria-hidden="true"
    >
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Thin "smile curve" divider used between light sections. */
export function SmileDivider({
  flip = false,
  className,
}: {
  flip?: boolean
  className?: string
}) {
  return (
    <div
      className={cn('pointer-events-none w-full overflow-hidden', flip && 'rotate-180', className)}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1440 48" className="h-6 w-full md:h-12" preserveAspectRatio="none">
        <path d="M0 24c240 32 480 32 720 0s480-32 720 0v24H0Z" fill="currentColor" />
      </svg>
    </div>
  )
}

/** Blurred colour orbs used as an ambient background layer. */
export function Orbs({ className }: { className?: string }) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      <div className="orb bg-accent/45 animate-drift -top-24 -left-16 h-72 w-72" />
      <div
        className="orb bg-gold/40 animate-drift top-1/3 -right-20 h-80 w-80"
        style={{ animationDelay: '-6s' }}
      />
      <div
        className="orb bg-brand/25 animate-drift -bottom-28 left-1/3 h-72 w-72"
        style={{ animationDelay: '-12s' }}
      />
    </div>
  )
}

/**
 * Infinite logo/text ticker. The list is rendered twice and translated by -50%
 * so the loop is seamless without measuring anything in JavaScript.
 */
export function Marquee({
  items,
  className,
}: {
  items: ReactNode[]
  className?: string
}) {
  return (
    <div className={cn('mask-fade-r relative flex overflow-hidden', className)}>
      <div className="animate-marquee flex min-w-max items-center gap-10 pr-10">
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex shrink-0 items-center gap-2.5" aria-hidden={i >= items.length}>
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Badge({
  children,
  tone = 'brand',
  className,
}: {
  children: ReactNode
  tone?: 'brand' | 'accent' | 'gold' | 'glass'
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
        tone === 'brand' && 'bg-brand-soft text-brand',
        tone === 'accent' && 'bg-accent-soft text-accent',
        tone === 'gold' && 'bg-gold-soft text-gold',
        tone === 'glass' && 'glass text-ink',
        className,
      )}
    >
      {children}
    </span>
  )
}

const ICONS: Record<string, string> = {
  implant: 'M12 3c-2.4 0-4 1.6-4 4 0 2.2 1 3.4 1.4 5.4.4 2 .4 5.6 1.6 5.6.9 0 1-2 1-3m0-12c2.4 0 4 1.6 4 4 0 2.2-1 3.4-1.4 5.4-.4 2-.4 5.6-1.6 5.6M12 14v7',
  veneer: 'M7 4h10l-1.2 13.2A3 3 0 0 1 12.8 20h-1.6a3 3 0 0 1-3-2.8Z',
  whitening: 'M12 3v3m0 12v3m9-9h-3M6 12H3m14.5-6.5-2 2m-7 7-2 2m0-11 2 2m7 7 2 2M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z',
  braces: 'M4 9h16M4 15h16M8 9v6m4-6v6m4-6v6',
  surgery: 'm4 20 7-7m0 0 3-3 6-6-2-2-6 6-3 3Zm0 0-3 3',
  filling: 'M12 3c-3 0-5 2-5 5 0 3 1.5 4.5 2 7 .4 2 .5 4 1.5 4s1-2 1.5-4c.5-2.5 2-4 2-7 0-3-2-5-2-5Z',
  child: 'M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-7 18a7 7 0 0 1 14 0',
  crown: 'M4 18h16l1-9-5 3-4-7-4 7-5-3Z',
  scan: 'M4 8V5a1 1 0 0 1 1-1h3m8 0h3a1 1 0 0 1 1 1v3m0 8v3a1 1 0 0 1-1 1h-3m-8 0H5a1 1 0 0 1-1-1v-3m2-4h12',
  tooth: 'M12 3c-2.2 0-3.3 1-5 1a3 3 0 0 0-3 3.2c0 2.8 1 4.2 1.7 6.8.6 2.2.4 5 2 5 1.3 0 1.4-2.3 2-4.3.4-1.4.9-2.2 2.3-2.2s1.9.8 2.3 2.2c.6 2 .7 4.3 2 4.3 1.6 0 1.4-2.8 2-5 .7-2.6 1.7-4 1.7-6.8A3 3 0 0 0 17 4c-1.7 0-2.8-1-5-1Z',
  check: 'm5 13 4 4L19 7',
  shield: 'M12 3l8 3v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6Z',
  clock: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  sparkle: 'M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 0c-3 3-3 15 0 18m0-18c3 3 3 15 0 18M3.5 9h17m-17 6h17',
  heart: 'M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9Z',
  microscope: 'M9 4h4l1 7H8Zm-3 16h14M8 16a5 5 0 0 0 9-3',
  wallet: 'M3 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm13 4h3',
  pin: 'M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  phone: 'M4 5c0-.6.4-1 1-1h3l2 5-2 1a12 12 0 0 0 6 6l1-2 5 2v3c0 .6-.4 1-1 1A16 16 0 0 1 4 5Z',
  star: 'm12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.4l6.1-.9Z',
  lab: 'M9 3v6l-5 9a2 2 0 0 0 1.7 3h12.6A2 2 0 0 0 20 18l-5-9V3M8 3h8M7.5 15h9',
}

export function Icon({ name, className }: { name?: string | null; className?: string }) {
  const path = ICONS[name ?? 'tooth'] ?? ICONS.tooth
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d={path}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
