import Image from 'next/image'
import { ArrowIcon, ButtonLink, Icon } from '../ui'
import { Reveal } from '../motion/Reveal'
import { cn } from '../../lib/utils'

type Props = {
  eyebrow?: string | null
  heading: string
  text?: string | null
  imageUrl?: string | null
  imageAlt?: string
  ctaLabel?: string
  ctaHref?: string
  icon?: string
  tone?: 'soft' | 'brand'
  flip?: boolean
}

/** Shared layout for the Kids dentistry and Dental tourism promos. */
export function FeatureBanner({
  eyebrow,
  heading,
  text,
  imageUrl,
  imageAlt = '',
  ctaLabel,
  ctaHref,
  icon = 'sparkle',
  tone = 'soft',
  flip = false,
}: Props) {
  return (
    <section className="container-page section">
      <div
        className={cn(
          'relative grid items-center gap-8 overflow-hidden rounded-[2rem] p-7 md:grid-cols-2 md:gap-12 md:p-12',
          tone === 'brand' ? 'bg-ink text-white' : 'bg-brand-soft text-ink',
        )}
      >
        <Reveal className={cn(flip && 'md:order-2')}>
          <span
            className={cn(
              'grid h-12 w-12 place-items-center rounded-2xl',
              tone === 'brand' ? 'bg-white/10 text-gold' : 'bg-surface text-accent',
            )}
          >
            <Icon name={icon} className="h-6 w-6" />
          </span>

          {eyebrow && (
            <span className={cn('eyebrow mt-4 block', tone === 'brand' && 'text-gold')}>{eyebrow}</span>
          )}

          <h2 className="mt-2 text-[clamp(1.6rem,4vw,2.4rem)] leading-[1.15]">{heading}</h2>

          {text && (
            <p className={cn('mt-4 text-sm leading-relaxed md:text-base', tone === 'brand' ? 'text-white/70' : 'text-ink-muted')}>
              {text}
            </p>
          )}

          {ctaLabel && ctaHref && (
            <ButtonLink
              href={ctaHref}
              variant={tone === 'brand' ? 'primary' : 'outline'}
              className="mt-7"
            >
              {ctaLabel}
              <ArrowIcon />
            </ButtonLink>
          )}
        </Reveal>

        {imageUrl && (
          <Reveal delay={1} direction={flip ? 'right' : 'left'} className={cn(flip && 'md:order-1')}>
            <div className="relative aspect-4/3 overflow-hidden rounded-[1.5rem] shadow-lift">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
