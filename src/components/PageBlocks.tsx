import Image from 'next/image'
import { ButtonLink, ArrowIcon, SectionHeading } from './ui'
import { Reveal } from './motion/Reveal'
import { RichText } from './RichText'
import { localePath, mediaAlt, mediaDimensions, mediaUrl } from '../lib/utils'
import type { Locale } from '../i18n/config'
import type { Page } from '../payload-types'

type Blocks = NonNullable<Page['layout']>

/**
 * Renders the block layout editors compose in /admin. Every block is
 * self-contained so blocks can be reordered without the page falling apart.
 */
export function PageBlocks({ locale, blocks }: { locale: Locale; blocks?: Blocks | null }) {
  if (!blocks || blocks.length === 0) return null

  return (
    <>
      {blocks.map((block) => {
        switch (block.blockType) {
          case 'richText':
            return (
              <section key={block.id} className="section pb-0 last:pb-[var(--section-y)]">
                <div className="container-page">
                  <div className={block.width === 'wide' ? '' : 'max-w-3xl'}>
                    {block.heading && (
                      <h2 className="text-ink mb-5 text-[clamp(1.5rem,4vw,2.25rem)]">{block.heading}</h2>
                    )}
                    <RichText data={block.content} />
                  </div>
                </div>
              </section>
            )

          case 'imageText': {
            const src = mediaUrl(block.image, 'wide')
            const dims = mediaDimensions(block.image)
            return (
              <section key={block.id} className="section pb-0 last:pb-[var(--section-y)]">
                <div className="container-page grid items-center gap-8 md:grid-cols-2 md:gap-12">
                  <Reveal className={block.imagePosition === 'left' ? 'md:order-1' : 'md:order-2'}>
                    {src && (
                      <Image
                        src={src}
                        alt={mediaAlt(block.image, block.heading ?? '')}
                        width={dims.width}
                        height={dims.height}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="shadow-soft w-full rounded-[var(--radius-card)] object-cover"
                      />
                    )}
                  </Reveal>
                  <Reveal delay={1} className={block.imagePosition === 'left' ? 'md:order-2' : 'md:order-1'}>
                    {block.heading && (
                      <h2 className="text-ink mb-4 text-[clamp(1.4rem,3.6vw,2rem)]">{block.heading}</h2>
                    )}
                    <RichText data={block.content} />
                  </Reveal>
                </div>
              </section>
            )
          }

          case 'featureGrid':
            return (
              <section key={block.id} className="bg-surface section">
                <div className="container-page">
                  {block.heading && <SectionHeading title={block.heading} />}
                  <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {(block.items ?? []).map((item, index) => (
                      <Reveal key={item.id ?? index} delay={index % 3}>
                        <div className="card h-full p-6">
                          <h3 className="text-ink text-base leading-snug">{item.title}</h3>
                          {item.description && (
                            <p className="text-ink-muted mt-2 text-sm leading-relaxed">{item.description}</p>
                          )}
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </section>
            )

          case 'gallery': {
            const images = (block.images ?? []).filter((img) => mediaUrl(img))
            if (images.length === 0) return null
            return (
              <section key={block.id} className="section">
                <div className="container-page">
                  {block.heading && <SectionHeading title={block.heading} />}
                  <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
                    {images.map((img, index) => (
                      <Reveal key={index} delay={index % 3}>
                        <figure className="relative aspect-4/3 overflow-hidden rounded-[var(--radius-card)]">
                          <Image
                            src={mediaUrl(img, 'card')!}
                            alt={mediaAlt(img)}
                            fill
                            sizes="(max-width: 768px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </figure>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </section>
            )
          }

          case 'cta':
            return (
              <section key={block.id} className="section">
                <div className="container-page">
                  <div className="bg-brand shadow-lift relative isolate overflow-hidden rounded-[var(--radius-card)] p-8 text-center md:p-14">
                    <div
                      className="bg-gold/20 absolute -top-24 -right-16 h-64 w-64 rounded-full blur-3xl"
                      aria-hidden="true"
                    />
                    <h2 className="relative text-[clamp(1.5rem,4vw,2.25rem)] text-white">{block.heading}</h2>
                    {block.text && (
                      <p className="relative mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/75">
                        {block.text}
                      </p>
                    )}
                    {block.buttonLabel && (
                      <div className="relative mt-7">
                        <ButtonLink
                          href={localePath(locale, block.buttonHref || '/contact')}
                          variant="light"
                        >
                          {block.buttonLabel}
                          <ArrowIcon />
                        </ButtonLink>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )

          default:
            return null
        }
      })}
    </>
  )
}
