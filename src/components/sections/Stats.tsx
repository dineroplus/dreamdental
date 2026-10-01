import { CountUp } from '../motion/CountUp'
import { Reveal } from '../motion/Reveal'

/** Every field is optional: a counter is saved as soon as it is added. */
type Stat = { value?: string; suffix?: string; display?: string; label?: string }

/** Digits (with +, %, / and separators) stay large; the words around them shrink. */
function DisplayValue({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\d[\d.,/+%]*)/).map((part, index) =>
        !part.trim() ? null : /^\d/.test(part) ? (
          <span key={index}>{part}</span>
        ) : (
          <span key={index} className="mx-1.5 text-[0.45em]">
            {part.trim()}
          </span>
        ),
      )}
    </>
  )
}

export function Stats({ items }: { items: Stat[] }) {
  const usable = items.filter(
    (stat): stat is Stat & { value: string; label: string } => Boolean(stat.value && stat.label),
  )
  if (usable.length === 0) return null

  return (
    <section className="section pt-0">
      <div className="container-page">
        <div className="card grid grid-cols-2 gap-y-8 px-6 py-8 md:grid-cols-4 md:px-10 md:py-10">
          {usable.map((stat, index) => (
            <Reveal key={stat.label} delay={index} className="text-center">
              <div className="text-gradient font-display text-[clamp(1.9rem,5vw,3rem)] leading-none font-semibold">
                {stat.display ? (
                  <DisplayValue text={stat.display} />
                ) : (
                  <CountUp value={stat.value} suffix={stat.suffix} />
                )}
              </div>
              <p className="text-ink-muted mt-2 text-xs leading-snug md:text-sm">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
