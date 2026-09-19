import { Fragment } from 'react'
import { parseMarkdownLite, type Inline } from '../lib/markdownLite'
import { cn } from '../lib/utils'

/**
 * Typographic defaults for body copy. Kept in one place so every article,
 * service page and block renders with the same rhythm.
 */
export function RichText({ value, className }: { value?: string | null; className?: string }) {
  const blocks = parseMarkdownLite(value)
  if (!blocks.length) return null

  return (
    <div
      className={cn(
        'text-ink max-w-none leading-relaxed',
        '[&_p]:text-ink-muted [&_p]:mb-4 [&_p]:text-[0.975rem] [&_p]:leading-[1.75]',
        '[&_h2]:text-ink [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-[1.5rem]',
        '[&_h3]:text-ink [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-[1.2rem]',
        '[&_ul]:mb-5 [&_ul]:space-y-2 [&_ul]:ps-5 [&_ul]:list-disc',
        '[&_li]:text-ink-muted [&_li]:text-[0.975rem] [&_li]:leading-[1.7]',
        '[&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2',
        '[&_strong]:text-ink [&_strong]:font-semibold',
        className,
      )}
    >
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          const Heading = block.level === 2 ? 'h2' : 'h3'
          return (
            <Heading key={index}>
              <InlineRun parts={block.children} />
            </Heading>
          )
        }

        if (block.type === 'list') {
          return (
            <ul key={index}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <InlineRun parts={item} />
                </li>
              ))}
            </ul>
          )
        }

        return (
          <p key={index}>
            <InlineRun parts={block.children} />
          </p>
        )
      })}
    </div>
  )
}

function InlineRun({ parts }: { parts: Inline[] }) {
  return (
    <>
      {parts.map((part, index) => {
        if (part.type === 'bold') return <strong key={index}>{part.value}</strong>
        if (part.type === 'link') {
          return (
            <a key={index} href={part.href}>
              {part.value}
            </a>
          )
        }
        return <Fragment key={index}>{part.value}</Fragment>
      })}
    </>
  )
}
