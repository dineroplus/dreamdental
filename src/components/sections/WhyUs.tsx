import { Icon, SectionHeading } from '../ui'
import { Reveal } from '../motion/Reveal'

type Advantage = { title?: string; description?: string; icon?: string }

export function WhyUs({
  heading,
  subheading,
  items,
}: {
  heading: string
  subheading?: string | null
  items: Advantage[]
}) {
  const usable = items.filter((item): item is Advantage & { title: string } => Boolean(item.title))
  if (usable.length === 0) return null

  return (
    <section className="relative isolate overflow-hidden">
      <div className="mesh opacity-50" aria-hidden="true" />
      <div className="container-page section relative">
        <SectionHeading title={heading} subtitle={subheading} />

        <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {usable.map((item, index) => (
            <Reveal key={item.title} delay={index % 3}>
              <div className="flex gap-4">
                <span className="bg-surface text-accent shadow-soft grid h-12 w-12 shrink-0 place-items-center rounded-2xl">
                  <Icon name={item.icon} className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-ink text-base leading-snug">{item.title}</h3>
                  {item.description && (
                    <p className="text-ink-muted mt-1.5 text-sm leading-relaxed">{item.description}</p>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
