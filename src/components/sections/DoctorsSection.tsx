import Image from 'next/image'
import Link from 'next/link'
import { ArrowIcon, ButtonLink, SectionHeading } from '../ui'
import { Reveal } from '../motion/Reveal'
import { doctorPhotoUrl } from '../../lib/doctorPhotos'
import { localePath, mediaAlt } from '../../lib/utils'
import type { Locale } from '../../i18n/config'
import type { Dictionary } from '../../i18n/dictionaries'
import type { Doctor } from '../../content/schema'

export function DoctorsSection({
  locale,
  dict,
  doctors,
  heading,
  subheading,
  viewAllHref,
  hideHeading = false,
}: {
  locale: Locale
  dict: Dictionary
  doctors: Doctor[]
  heading?: string | null
  subheading?: string | null
  viewAllHref?: string
  hideHeading?: boolean
}) {
  // Prefer a portrait; fall back to the public/team cut-outs; last resort
  // still show the doctor so the section never vanishes after a media migration.
  const withPhotos = doctors.filter((doctor) => doctorPhotoUrl(doctor, 'card'))
  const list = withPhotos.length > 0 ? withPhotos : doctors
  if (list.length === 0) return null

  return (
    <section className={hideHeading ? 'section pt-2' : 'section'}>
      {!hideHeading && (
        <div className="container-page">
          <SectionHeading eyebrow={dict.labels.ourDoctors} title={heading || dict.nav.doctors} subtitle={subheading} />
        </div>
      )}

      <div className="container-page mt-10">
        {/*
          Avoid `.rail` here: its `flex: 0 0 auto` children size to text content,
          so cards end up different widths. Fixed mobile widths + equal grid tracks.
        */}
        <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 xl:grid-cols-4 [&::-webkit-scrollbar]:hidden">
          {list.map((doctor, index) => {
            const photo = doctorPhotoUrl(doctor, 'card')
            return (
              <Reveal
                key={doctor.id}
                delay={index % 4}
                as="article"
                className="w-[72vw] max-w-[280px] shrink-0 sm:w-full sm:max-w-none sm:min-w-0"
              >
                <Link
                  href={localePath(locale, `/doctors/${doctor.slug}`)}
                  className="group card flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="bg-brand-soft relative aspect-3/4 w-full shrink-0 overflow-hidden">
                    {photo ? (
                      <Image
                        src={photo}
                        alt={mediaAlt(doctor.photo, doctor.name)}
                        fill
                        sizes="(max-width: 640px) 72vw, (max-width: 1024px) 45vw, (max-width: 1280px) 30vw, 22vw"
                        className="object-contain object-bottom p-3 pt-6 transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="text-brand/40 grid h-full place-items-center text-5xl font-semibold">
                        {(doctor.name ?? '?').trim().charAt(0) || '?'}
                      </div>
                    )}

                    {doctor.role && (
                      <span className="bg-brand/90 absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white uppercase">
                        {doctor.role}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-ink text-base leading-snug">{doctor.name}</h3>
                    <p className="text-accent mt-1 text-sm">{doctor.specialty}</p>
                    {doctor.experienceSince && (
                      <p className="text-ink-muted mt-2 text-xs">
                        {new Date().getFullYear() - doctor.experienceSince}+ {dict.misc.yearsOfExperience}
                      </p>
                    )}
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>

        {viewAllHref && (
          <div className="mt-10 text-center">
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
