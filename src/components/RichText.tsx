import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { cn } from '../lib/utils'

/**
 * Typographic defaults for CMS body copy. Kept in one place so every article,
 * service page and block renders with the same rhythm.
 */
export function RichText({
  data,
  className,
}: {
  data?: SerializedEditorState | null
  className?: string
}) {
  if (!data) return null

  return (
    <div
      className={cn(
        'text-ink max-w-none leading-relaxed',
        '[&_p]:text-ink-muted [&_p]:mb-4 [&_p]:text-[0.975rem] [&_p]:leading-[1.75]',
        '[&_h2]:text-ink [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-[1.5rem]',
        '[&_h3]:text-ink [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-[1.2rem]',
        '[&_ul]:mb-5 [&_ul]:space-y-2 [&_ul]:ps-5 [&_ul]:list-disc',
        '[&_ol]:mb-5 [&_ol]:space-y-2 [&_ol]:ps-5 [&_ol]:list-decimal',
        '[&_li]:text-ink-muted [&_li]:text-[0.975rem] [&_li]:leading-[1.7]',
        '[&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2',
        '[&_strong]:text-ink [&_strong]:font-semibold',
        '[&_blockquote]:border-accent [&_blockquote]:text-ink [&_blockquote]:my-6 [&_blockquote]:border-s-2 [&_blockquote]:ps-4 [&_blockquote]:italic',
        className,
      )}
    >
      <LexicalRichText data={data} />
    </div>
  )
}
