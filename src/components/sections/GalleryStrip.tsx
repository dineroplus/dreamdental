import Image from 'next/image'
import { ArrowIcon, ButtonLink, SectionHeading } from '../ui'
import { Reveal } from '../motion/Reveal'
import { localePath, mediaAlt, mediaUrl } from '../../lib/utils'
import type { Locale } from '../../i18n/config'
import type { Dictionary } from '../../i18n/dictionaries'
import type { GalleryItem } from '../../payload-types'

export function GalleryStrip({
  locale,
  dict,
  items,
  heading,
  subheading,
}: {
  locale: Locale
  dict: Dictionary
  items: GalleryItem[]
  heading?: string | null
  subheading?: string | null
}) {
  const usable = items.filter((item) => mediaUrl(item.image))
  if (usable.length === 0) return null

  return (
    <section className="section">
      <div className="container-page">
        <SectionHeading title={heading || dict.nav.gallery} subtitle={subheading} />
      </div>

      <div className="mt-10">
        <div className="rail px-5">
          {usable.slice(0, 10).map((item, index) => (
            <Reveal key={item.id} delay={index % 4}>
              <figure className="relative h-56 w-[72vw] overflow-hidden rounded-[var(--radius-card)] sm:h-72 sm:w-[46vw] lg:w-[28vw]">
                <Image
                  src={mediaUrl(item.image, 'card')!}
                  alt={mediaAlt(item.image, item.title ?? '')}
                  fill
                  sizes="(max-width: 640px) 72vw, (max-width: 1024px) 46vw, 28vw"
                  className="object-cover"
                />
                {item.title && (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-sm font-medium text-white">
                    {item.title}
                  </figcaption>
                )}
              </figure>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="container-page mt-8 text-center">
        <ButtonLink href={localePath(locale, '/gallery')} variant="outline">
          {dict.cta.viewAll}
          <ArrowIcon />
        </ButtonLink>
      </div>
    </section>
  )
}
