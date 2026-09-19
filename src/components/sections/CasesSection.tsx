import { SectionHeading } from '../ui'
import { Reveal } from '../motion/Reveal'
import { BeforeAfterSlider } from '../BeforeAfterSlider'
import { mediaAlt, mediaUrl } from '../../lib/utils'
import type { Dictionary } from '../../i18n/dictionaries'
import type { Case } from '../../payload-types'

export function CasesSection({
  dict,
  cases,
  heading,
  subheading,
}: {
  dict: Dictionary
  cases: Case[]
  heading?: string | null
  subheading?: string | null
}) {
  const usable = cases.filter((c) => mediaUrl(c.beforeImage) && mediaUrl(c.afterImage))
  if (usable.length === 0) return null

  return (
    <section className="bg-surface section">
      <div className="container-page">
        <SectionHeading eyebrow={dict.nav.cases} title={heading || dict.nav.cases} subtitle={subheading} />

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {usable.slice(0, 4).map((item, index) => (
            <Reveal key={item.id} delay={index % 2} as="article">
              <BeforeAfterSlider
                beforeSrc={mediaUrl(item.beforeImage, 'card')!}
                afterSrc={mediaUrl(item.afterImage, 'card')!}
                beforeAlt={mediaAlt(item.beforeImage, `${item.title} - ${dict.labels.before}`)}
                afterAlt={mediaAlt(item.afterImage, `${item.title} - ${dict.labels.after}`)}
                beforeLabel={dict.labels.before}
                afterLabel={dict.labels.after}
                hint={dict.labels.dragToCompare}
              />
              <h3 className="text-ink mt-4 text-base leading-snug">{item.title}</h3>
              {item.description && (
                <p className="text-ink-muted mt-1.5 text-sm leading-relaxed">{item.description}</p>
              )}
              {item.duration && (
                <p className="text-ink-muted mt-2 text-xs">
                  {dict.labels.duration}: {item.duration}
                </p>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
