import { CountUp } from '../motion/CountUp'
import { Reveal } from '../motion/Reveal'

type Stat = { value: string; suffix?: string | null; label: string }

export function Stats({ items }: { items: Stat[] }) {
  if (items.length === 0) return null

  return (
    <section className="section pt-0">
      <div className="container-page">
        <div className="card grid grid-cols-2 gap-y-8 px-6 py-8 md:grid-cols-4 md:px-10 md:py-10">
          {items.map((stat, index) => (
            <Reveal key={stat.label} delay={index} className="text-center">
              <div className="text-gradient font-display text-[clamp(1.9rem,5vw,3rem)] leading-none font-semibold">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-ink-muted mt-2 text-xs leading-snug md:text-sm">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
