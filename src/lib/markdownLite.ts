/**
 * A deliberately tiny Markdown subset - the same one the clinic's copy was
 * already authored in: `## ` and `### ` headings, `- ` bullets, `**bold**`
 * and `[label](href)` links. Everything else is a paragraph.
 *
 * Keeping the format this small is what lets the admin use a plain textarea
 * instead of shipping a rich text editor to the browser.
 */

export type Inline =
  | { type: 'text'; value: string }
  | { type: 'bold'; value: string }
  | { type: 'link'; value: string; href: string }

export type Block =
  | { type: 'heading'; level: 2 | 3; children: Inline[] }
  | { type: 'paragraph'; children: Inline[] }
  | { type: 'list'; items: Inline[][] }

const INLINE_PATTERN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g

function parseInline(line: string): Inline[] {
  return line
    .split(INLINE_PATTERN)
    .filter(Boolean)
    .map((part): Inline => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return { type: 'bold', value: part.slice(2, -2) }
      }
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (link) return { type: 'link', value: link[1], href: link[2] }
      return { type: 'text', value: part }
    })
}

export function parseMarkdownLite(source: string | undefined | null): Block[] {
  if (!source) return []

  const blocks: Block[] = []
  let items: Inline[][] | null = null

  const flushList = () => {
    if (items?.length) blocks.push({ type: 'list', items })
    items = null
  }

  for (const raw of source.split('\n')) {
    const line = raw.trim()
    if (!line) {
      flushList()
      continue
    }

    if (line.startsWith('- ')) {
      items ??= []
      items.push(parseInline(line.slice(2)))
      continue
    }

    flushList()

    if (line.startsWith('### ')) {
      blocks.push({ type: 'heading', level: 3, children: parseInline(line.slice(4)) })
    } else if (line.startsWith('## ')) {
      blocks.push({ type: 'heading', level: 2, children: parseInline(line.slice(3)) })
    } else {
      blocks.push({ type: 'paragraph', children: parseInline(line) })
    }
  }

  flushList()
  return blocks
}

/** Strips formatting for meta descriptions and structured data. */
export function markdownLiteToPlain(source: string | undefined | null, limit = 300): string {
  if (!source) return ''
  const plain = source
    .replace(/^#{2,3}\s+/gm, '')
    .replace(/^-\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
  return plain.slice(0, limit)
}

/** Rough reading time in minutes, used on blog articles. */
export function readingMinutes(source: string | undefined | null): number {
  const words = markdownLiteToPlain(source, Number.MAX_SAFE_INTEGER).split(/\s+/).filter(Boolean)
  return Math.max(1, Math.round(words.length / 200))
}
