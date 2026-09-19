import { JsonLd } from './JsonLd'

type Item = { question?: string; answer?: string }

/**
 * Built on <details> so it works with zero JavaScript, and mirrored as
 * FAQPage structured data for rich results.
 */
export function Faq({ title, items }: { title: string; items: Item[] }) {
  // A half-filled entry would produce an empty accordion row and, worse,
  // invalid FAQ structured data.
  const usable = items.filter(
    (item): item is { question: string; answer: string } => Boolean(item.question && item.answer),
  )
  if (usable.length === 0) return null

  return (
    <section className="container-page section">
      <h2 className="text-ink text-[clamp(1.5rem,4vw,2.25rem)]">{title}</h2>

      <div className="mt-7 max-w-3xl space-y-3">
        {usable.map((item) => (
          <details key={item.question} className="card group px-5 py-4 open:shadow-lift [&_summary]:list-none">
            <summary className="text-ink flex cursor-pointer items-center justify-between gap-4 text-[0.975rem] font-medium">
              {item.question}
              <span className="text-accent shrink-0 transition-transform duration-300 group-open:rotate-45">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            </summary>
            <p className="text-ink-muted mt-3 text-sm leading-relaxed">{item.answer}</p>
          </details>
        ))}
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: usable.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        }}
      />
    </section>
  )
}
