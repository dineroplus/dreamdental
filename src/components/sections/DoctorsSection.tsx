import Image from 'next/image'
import Link from 'next/link'
import { ArrowIcon, ButtonLink, SectionHeading } from '../ui'
import { Reveal } from '../motion/Reveal'
import { DoctorsRail } from './DoctorsRail'
import { doctorPhotoBackground, doctorPhotoUrl } from '../../lib/doctorPhotos'
import { localePath, mediaAlt } from '../../lib/utils'
import type { Locale } from '../../i18n/config'
import type { Dictionary } from '../../i18n/dictionaries'
import type { Doctor } from '../../content/schema'

const RAIL_LABELS: Record<Locale, { prev: string; next: string }> = {
  ka: { prev: 'წინა ექიმები', next: 'შემდეგი ექიმები' },
  en: { prev: 'Previous doctors', next: 'Next doctors' },
  ru: { prev: 'Предыдущие врачи', next: 'Следующие врачи' },
}

export function DoctorsSection({
  locale,
  dict,
  doctors,
  heading,
  subheading,
  eyebrow,
  viewAllHref,
  hideHeading = false,
  layout = 'grid',
  size = 'default',
}: {
  locale: Locale
  dict: Dictionary
  doctors: Doctor[]
  heading?: string | null
  subheading?: string | null
  /** Pass `null` to hide the eyebrow (avoids “Our doctors / Our doctors”). */
  eyebrow?: string | null
  viewAllHref?: string
  hideHeading?: boolean
  /** Homepage uses one scrolling row with slim arrows. */
  layout?: 'grid' | 'rail'
  /** Compact cards for “other doctors” on a profile page. */
  size?: 'default' | 'compact'
}) {
  // Prefer a portrait; fall back to the public/team cut-outs; last resort
  // still show the doctor so the section never vanishes after a media migration.
  const withPhotos = doctors.filter((doctor) => doctorPhotoUrl(doctor, 'card'))
  const list = withPhotos.length > 0 ? withPhotos : doctors
  if (list.length === 0) return null

  const compact = size === 'compact'
  const showEyebrow = eyebrow !== null

  const cards = list.map((doctor, index) => {
    const photo = doctorPhotoUrl(doctor, 'card')
    return (
      <Reveal
        key={doctor.id}
        delay={index % 4}
        as="article"
        className={
          layout === 'rail'
            ? 'w-[72vw] max-w-[280px] shrink-0 snap-start sm:w-[46vw] sm:max-w-[260px] lg:w-[260px] lg:max-w-none lg:min-w-[260px]'
            : compact
              ? 'w-[42vw] max-w-[148px] shrink-0 sm:w-full sm:max-w-none sm:min-w-0'
              : 'w-[72vw] max-w-[280px] shrink-0 sm:w-full sm:max-w-none sm:min-w-0'
        }
      >
        <Link
          href={localePath(locale, `/doctors/${doctor.slug}`)}
          className={
            layout === 'rail' || compact
              ? 'bg-surface border-hairline flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border'
              : 'group card flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift'
          }
        >
          <div
            className={
              compact
                ? 'bg-brand-soft relative aspect-3/4 w-full shrink-0 overflow-hidden'
                : 'bg-brand-soft relative aspect-3/4 w-full shrink-0 overflow-hidden'
            }
            style={doctorPhotoBackground(doctor)}
          >
            {photo ? (
              <Image
                src={photo}
                alt={mediaAlt(doctor.photo, doctor.name)}
                fill
                sizes={
                  compact
                    ? '(max-width: 640px) 42vw, (max-width: 1024px) 22vw, 148px'
                    : '(max-width: 640px) 72vw, (max-width: 1024px) 46vw, 260px'
                }
                className={
                  layout === 'rail' || compact
                    ? compact
                      ? 'object-contain object-bottom px-1.5 pt-3'
                      : 'object-contain object-bottom px-3 pt-6'
                    : 'origin-bottom object-contain object-bottom px-3 pt-6 transition-transform duration-500 group-hover:scale-105'
                }
              />
            ) : (
              <div
                className={
                  compact
                    ? 'text-brand/40 grid h-full place-items-center text-2xl font-semibold'
                    : 'text-brand/40 grid h-full place-items-center text-5xl font-semibold'
                }
              >
                {(doctor.name ?? '?').trim().charAt(0) || '?'}
              </div>
            )}

            {doctor.role && !compact && (
              <span className="bg-brand/90 absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white uppercase">
                {doctor.role}
              </span>
            )}
          </div>

          <div className={compact ? 'flex flex-1 flex-col p-2.5' : 'flex flex-1 flex-col p-4'}>
            <h3
              className={
                compact ? 'text-ink text-[0.8rem] leading-snug' : 'text-ink text-base leading-snug'
              }
            >
              {doctor.name}
            </h3>
            <p
              className={
                compact
                  ? 'text-accent mt-0.5 line-clamp-2 text-[0.68rem] leading-snug'
                  : 'text-accent mt-1 text-sm'
              }
            >
              {doctor.specialty}
            </p>
            {!compact && doctor.experienceSince && (
              <p className="text-ink-muted mt-2 text-xs">
                {new Date().getFullYear() - doctor.experienceSince}+ {dict.misc.yearsOfExperience}
              </p>
            )}
          </div>
        </Link>
      </Reveal>
    )
  })

  return (
    <section
      className={hideHeading ? 'section pt-2' : compact ? 'section !py-10 md:!py-12' : 'section'}
    >
      {!hideHeading && (
        <div className="container-page">
          <SectionHeading
            eyebrow={showEyebrow ? (eyebrow ?? dict.labels.ourDoctors) : undefined}
            title={heading || dict.nav.doctors}
            subtitle={subheading}
          />
        </div>
      )}

      <div className={compact ? 'container-page mt-6' : 'container-page mt-10'}>
        {layout === 'rail' ? (
          <DoctorsRail prevLabel={RAIL_LABELS[locale].prev} nextLabel={RAIL_LABELS[locale].next}>
            {cards}
          </DoctorsRail>
        ) : (
          /*
            Avoid `.rail` here: its `flex: 0 0 auto` children size to text content,
            so cards end up different widths. Fixed mobile widths + equal grid tracks.
          */
          <div
            className={
              compact
                ? '-mx-5 flex gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 xl:grid-cols-5 [&::-webkit-scrollbar]:hidden'
                : '-mx-5 flex gap-4 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 xl:grid-cols-4 [&::-webkit-scrollbar]:hidden'
            }
          >
            {cards}
          </div>
        )}

        {viewAllHref && (
          <div className={compact ? 'mt-6 text-center' : 'mt-10 text-center'}>
            <ButtonLink href={viewAllHref} variant="outline">
              {dict.cta.viewAll}
              <ArrowIcon />
            </ButtonLink>
          </div>
        )}
      </div>
    </section>
  )
}
