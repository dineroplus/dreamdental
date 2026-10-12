import { ArrowIcon, ButtonLink, SectionHeading } from '../ui'
import { localePath, mediaAlt, mediaUrl } from '../../lib/utils'
import type { Locale } from '../../i18n/config'
import type { Dictionary } from '../../i18n/dictionaries'
import type { GalleryItem } from '../../content/schema'
import { PhotoLightbox } from '../PhotoLightbox'

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
        <PhotoLightbox
          layout="strip"
          photos={usable.slice(0, 10).map((item) => ({
            src: mediaUrl(item.image, 'card')!,
            full: mediaUrl(item.image) || mediaUrl(item.image, 'card')!,
            alt: mediaAlt(item.image, item.title ?? ''),
            title: item.title,
          }))}
          labels={{ close: dict.nav.close, previous: dict.labels.previous, next: dict.labels.next }}
        />
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
