import Image from 'next/image'
import Link from 'next/link'
import { Icon, SectionHeading } from '../ui'
import { Reveal } from '../motion/Reveal'
import { localePath, mediaAlt, mediaUrl } from '../../lib/utils'
import type { Locale } from '../../i18n/config'
import type { Dictionary } from '../../i18n/dictionaries'
import type { Doctor } from '../../payload-types'

export function DoctorsSection({
  locale,
  dict,
  doctors,
  heading,
  subheading,
}: {
  locale: Locale
  dict: Dictionary
  doctors: Doctor[]
  heading?: string | null
  subheading?: string | null
}) {
  if (doctors.length === 0) return null

  return (
    <section className="section">
      <div className="container-page">
        <SectionHeading eyebrow={dict.labels.ourDoctors} title={heading || dict.nav.doctors} subtitle={subheading} />
      </div>

      {/* Horizontal rail on phones, grid from tablet up. */}
      <div className="container-page mt-10">
        <div className="rail -mx-5 px-5 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {doctors.map((doctor, index) => {
            const photo = mediaUrl(doctor.photo, 'card')
            return (
              <Reveal key={doctor.id} delay={index % 4} as="article" className="w-[70vw] sm:w-auto">
                <Link
                  href={localePath(locale, `/doctors/${doctor.slug}`)}
                  className="group card block h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="bg-brand-soft relative aspect-3/4 overflow-hidden">
                    {photo ? (
                      <Image
                        src={photo}
                        alt={mediaAlt(doctor.photo, doctor.name)}
                        fill
                        sizes="(max-width: 640px) 70vw, (max-width: 1024px) 45vw, 22vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="grid h-full place-items-center">
                        <Icon name="tooth" className="text-brand/25 h-14 w-14" />
                      </div>
                    )}

                    {doctor.role && (
                      <span className="bg-brand/90 absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white uppercase">
                        {doctor.role}
                      </span>
                    )}
                  </div>

                  <div className="p-4">
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
      </div>
    </section>
  )
}
