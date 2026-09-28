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
  child: 'M9 12h.01M15 12h.01M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5m5-9.7a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5S14.6 8 13.5 8c-.8 0-1.5-.4-1.5-1',
  crown: 'M11.6 3.3a.5.5 0 0 1 .8 0l3 5.6a1 1 0 0 0 1.5.3l4.3-3.7a.5.5 0 0 1 .8.5l-2.9 10.3a1 1 0 0 1-1 .7H5.8a1 1 0 0 1-1-.7L2 6a.5.5 0 0 1 .8-.5l4.3 3.7a1 1 0 0 0 1.5-.3ZM5 21h14',
  scan: 'M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2m4-5h10',
  tooth: 'M12 3c-2.2 0-3.3 1-5 1a3 3 0 0 0-3 3.2c0 2.8 1 4.2 1.7 6.8.6 2.2.4 5 2 5 1.3 0 1.4-2.3 2-4.3.4-1.4.9-2.2 2.3-2.2s1.9.8 2.3 2.2c.6 2 .7 4.3 2 4.3 1.6 0 1.4-2.8 2-5 .7-2.6 1.7-4 1.7-6.8A3 3 0 0 0 17 4c-1.7 0-2.8-1-5-1Z',
  check: 'M20 6 9 17l-5-5',
  shield: 'M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1Zm-11-1 2 2 4-4',
  clock: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM12 6v6l4 2',
  sparkle: 'M9.9 15.5a2 2 0 0 0-1.4-1.4l-6.1-1.6a.5.5 0 0 1 0-1l6.1-1.6a2 2 0 0 0 1.4-1.4l1.6-6.1a.5.5 0 0 1 1 0l1.6 6.1a2 2 0 0 0 1.4 1.4l6.1 1.6a.5.5 0 0 1 0 1l-6.1 1.6a2 2 0 0 0-1.4 1.4l-1.6 6.1a.5.5 0 0 1-1 0ZM20 3v4m2-2h-4M4 17v2m1-1H3',
  globe: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20',
  heart: 'M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z',
  microscope: 'M6 18h8M3 22h18m-7 0a7 7 0 1 0 0-14h-1m-4 6h2m-2-2a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Zm3-6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3',
  wallet: 'M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4',
  pin: 'M20 10c0 5-5.5 10.2-7.4 11.8a1 1 0 0 1-1.2 0C9.5 20.2 4 15 4 10a8 8 0 0 1 16 0Zm-5 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  phone: 'M4 5c0-.6.4-1 1-1h3l2 5-2 1a12 12 0 0 0 6 6l1-2 5 2v3c0 .6-.4 1-1 1A16 16 0 0 1 4 5Z',
  calendar: 'M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
  star: 'm12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.4l6.1-.9Z',
  lab: 'M14 2v6a2 2 0 0 0 .2 1l5.5 10a2 2 0 0 1-1.7 3H6a2 2 0 0 1-1.8-3l5.5-10a2 2 0 0 0 .3-1V2M6.5 15h11m-9-13h7',
  user: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  home: 'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8M3 10a2 2 0 0 1 .7-1.5l7-6a2 2 0 0 1 2.6 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z',
  languages: 'm5 8 6 6m-7 0 6-6 2-3M2 5h12M7 2h1m14 20-5-10-5 10m2-4h6',
  stethoscope: 'M11 2v2M5 2v2m0-1H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1M8 15a6 6 0 0 0 12 0v-3m2-2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z',
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
