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
    variant === 'outline' &&
      'border border-brand/25 text-brand hover:border-brand/45 hover:bg-brand-soft',
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
export function SmileDivider({ flip = false, className }: { flip?: boolean; className?: string }) {
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
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden="true"
    >
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
export function Marquee({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <div className={cn('mask-fade-r relative flex overflow-hidden', className)}>
      <div className="animate-marquee flex min-w-max items-center gap-10 pr-10">
        {[...items, ...items].map((item, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-2.5"
            aria-hidden={i >= items.length}
          >
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
  implant:
    'M8 2c-1.9 0-3.3 1.4-3.3 3.3 0 1.9 1 3.2 1.8 4.2.4.5 1 .8 1.6.8h7.8c.6 0 1.2-.3 1.6-.8.8-1 1.8-2.3 1.8-4.2C19.3 3.4 17.9 2 16 2c-1.6 0-2.4.8-4 .8S9.6 2 8 2Zm2 8.3v1.2h4v-1.2M9 11.5h6l-1.2 9.5h-3.6Zm-.8 3 7.6-1.2M8.6 18l6.8-1.1',
  veneer:
    'M10 3h7a1.8 1.8 0 0 1 1.8 2l-1.3 9.6C17.2 17.6 16 20.5 13.5 20.5S9.8 17.6 9.5 14.6L8.2 5A1.8 1.8 0 0 1 10 3ZM6.5 4.5 5 5.3l1.3 9.6c.4 3 1.6 5.9 4.2 6.1',
  whitening:
    'M5.04 8.46c-1.58 0 -2.88 1.3 -2.88 3.02 0 1.66 0.65 2.59 1.08 4.18 0.5 1.8 0.65 5.76 2.16 5.76 1.15 0 1.3 -1.87 1.58 -3.31 0.22 -1.01 0.65 -1.73 1.66 -1.73s1.44 0.72 1.66 1.73c0.29 1.44 0.43 3.31 1.58 3.31 1.51 0 1.66 -3.96 2.16 -5.76 0.43 -1.58 1.08 -2.52 1.08 -4.18C15.12 9.76 13.82 8.46 12.24 8.46c-1.37 0 -2.16 0.72 -3.6 0.72S6.41 8.46 5.04 8.46ZM18.5 1.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9ZM21 9v.01M15.5 1.5v.01',
  braces:
    'M2.9 5.3c-1.32 0 -2.4 1.08 -2.4 2.52 0 1.38 0.54 2.16 0.9 3.48 0.42 1.5 0.54 4.8 1.8 4.8 0.96 0 1.08 -1.56 1.32 -2.76 0.18 -0.84 0.54 -1.44 1.38 -1.44s1.2 0.6 1.38 1.44c0.24 1.2 0.36 2.76 1.32 2.76 1.26 0 1.38 -3.3 1.8 -4.8 0.36 -1.32 0.9 -2.1 0.9 -3.48C11.3 6.38 10.22 5.3 8.9 5.3c-1.14 0 -1.8 0.6 -3 0.6S4.04 5.3 2.9 5.3ZM14.3 5.3c-1.32 0 -2.4 1.08 -2.4 2.52 0 1.38 0.54 2.16 0.9 3.48 0.42 1.5 0.54 4.8 1.8 4.8 0.96 0 1.08 -1.56 1.32 -2.76 0.18 -0.84 0.54 -1.44 1.38 -1.44s1.2 0.6 1.38 1.44c0.24 1.2 0.36 2.76 1.32 2.76 1.26 0 1.38 -3.3 1.8 -4.8 0.36 -1.32 0.9 -2.1 0.9 -3.48C22.7 6.38 21.62 5.3 20.3 5.3c-1.14 0 -1.8 0.6 -3 0.6S15.44 5.3 14.3 5.3ZM1.5 10h21M4.5 8.5h3v3h-3Zm11.4 0h3v3h-3Z',
  surgery:
    'M8.4 9.16c-1.58 0 -2.88 1.3 -2.88 3.02 0 1.66 0.65 2.59 1.08 4.18 0.5 1.8 0.65 5.76 2.16 5.76 1.15 0 1.3 -1.87 1.58 -3.31 0.22 -1.01 0.65 -1.73 1.66 -1.73s1.44 0.72 1.66 1.73c0.29 1.44 0.43 3.31 1.58 3.31 1.51 0 1.66 -3.96 2.16 -5.76 0.43 -1.58 1.08 -2.52 1.08 -4.18C18.48 10.46 17.18 9.16 15.6 9.16c-1.37 0 -2.16 0.72 -3.6 0.72S9.77 9.16 8.4 9.16ZM12 1.5V7M9.5 4 12 1.5 14.5 4',
  filling:
    'M7 3c-2.2 0-4 1.8-4 4.2 0 2.3.9 3.6 1.5 5.8.7 2.5.9 8 3 8 1.6 0 1.8-2.6 2.2-4.6.3-1.4.9-2.4 2.3-2.4s2 1 2.3 2.4c.4 2 .6 4.6 2.2 4.6 2.1 0 2.3-5.5 3-8 .6-2.2 1.5-3.5 1.5-5.8C21 4.8 19.2 3 17 3c-1.9 0-3 1-5 1S8.9 3 7 3ZM9.5 7.5h5v2a2.5 2.5 0 0 1-5 0Z',
  toothbrush:
    'M2.5 14h8v3h-8Zm1.5 0v-4m2.5 4v-4M9 14v-4m1.5 4.5h10a1.5 1.5 0 0 1 0 3h-10M18 3l.8 1.7 1.7.8-1.7.8L18 8l-.8-1.7-1.7-.8 1.7-.8Z',
  child:
    'M7 3c-2.2 0-4 1.8-4 4.2 0 2.3.9 3.6 1.5 5.8.7 2.5.9 8 3 8 1.6 0 1.8-2.6 2.2-4.6.3-1.4.9-2.4 2.3-2.4s2 1 2.3 2.4c.4 2 .6 4.6 2.2 4.6 2.1 0 2.3-5.5 3-8 .6-2.2 1.5-3.5 1.5-5.8C21 4.8 19.2 3 17 3c-1.9 0-3 1-5 1S8.9 3 7 3ZM9.5 7.8h.01M14.5 7.8h.01M9.8 10.2c1.3 1.3 3.1 1.3 4.4 0',
  crown:
    'M11.6 3.3a.5.5 0 0 1 .8 0l3 5.6a1 1 0 0 0 1.5.3l4.3-3.7a.5.5 0 0 1 .8.5l-2.9 10.3a1 1 0 0 1-1 .7H5.8a1 1 0 0 1-1-.7L2 6a.5.5 0 0 1 .8-.5l4.3 3.7a1 1 0 0 0 1.5-.3ZM5 21h14',
  scan: 'M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2m4-5h10',
  tooth:
    'M7 3c-2.2 0-4 1.8-4 4.2 0 2.3.9 3.6 1.5 5.8.7 2.5.9 8 3 8 1.6 0 1.8-2.6 2.2-4.6.3-1.4.9-2.4 2.3-2.4s2 1 2.3 2.4c.4 2 .6 4.6 2.2 4.6 2.1 0 2.3-5.5 3-8 .6-2.2 1.5-3.5 1.5-5.8C21 4.8 19.2 3 17 3c-1.9 0-3 1-5 1S8.9 3 7 3Z',
  check: 'M20 6 9 17l-5-5',
  shield:
    'M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1Zm-11-1 2 2 4-4',
  clock: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM12 6v6l4 2',
  sparkle:
    'M9.9 15.5a2 2 0 0 0-1.4-1.4l-6.1-1.6a.5.5 0 0 1 0-1l6.1-1.6a2 2 0 0 0 1.4-1.4l1.6-6.1a.5.5 0 0 1 1 0l1.6 6.1a2 2 0 0 0 1.4 1.4l6.1 1.6a.5.5 0 0 1 0 1l-6.1 1.6a2 2 0 0 0-1.4 1.4l-1.6 6.1a.5.5 0 0 1-1 0ZM20 3v4m2-2h-4M4 17v2m1-1H3',
  globe:
    'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20',
  heart:
    'M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z',
  microscope:
    'M6 18h8M3 22h18m-7 0a7 7 0 1 0 0-14h-1m-4 6h2m-2-2a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Zm3-6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3',
  wallet:
    'M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4',
  pin: 'M20 10c0 5-5.5 10.2-7.4 11.8a1 1 0 0 1-1.2 0C9.5 20.2 4 15 4 10a8 8 0 0 1 16 0Zm-5 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  phone: 'M4 5c0-.6.4-1 1-1h3l2 5-2 1a12 12 0 0 0 6 6l1-2 5 2v3c0 .6-.4 1-1 1A16 16 0 0 1 4 5Z',
  calendar:
    'M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
  star: 'm12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.4l6.1-.9Z',
  lab: 'M14 2v6a2 2 0 0 0 .2 1l5.5 10a2 2 0 0 1-1.7 3H6a2 2 0 0 1-1.8-3l5.5-10a2 2 0 0 0 .3-1V2M6.5 15h11m-9-13h7',
  user: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  home: 'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8M3 10a2 2 0 0 1 .7-1.5l7-6a2 2 0 0 1 2.6 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z',
  languages: 'm5 8 6 6m-7 0 6-6 2-3M2 5h12M7 2h1m14 20-5-10-5 10m2-4h6',
  stethoscope:
    'M11 2v2M5 2v2m0-1H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1M8 15a6 6 0 0 0 12 0v-3m2-2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z',
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
