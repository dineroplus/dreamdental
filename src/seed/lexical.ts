/**
 * Minimal authoring helper for Lexical documents. Seed content is written as
 * plain lines - `## ` for a heading, `- ` for a list item, `**bold**` inline -
 * and converted here, so the content files stay readable.
 */

type Node = Record<string, unknown>

const BOLD = 1

function text(value: string, format = 0): Node {
  return { type: 'text', text: value, detail: 0, format, mode: 'normal', style: '', version: 1 }
}

/** Splits `a **b** c` into alternating plain and bold text nodes. */
function inline(line: string): Node[] {
  return line
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part) =>
      part.startsWith('**') && part.endsWith('**')
        ? text(part.slice(2, -2), BOLD)
        : text(part),
    )
}

function block(type: string, children: Node[], extra: Node = {}): Node {
  return {
    type,
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
    ...extra,
  }
}

export function richText(lines: string[]) {
  const children: Node[] = []
  let list: Node[] | null = null

  const flushList = () => {
    if (!list) return
    children.push(
      block('list', list, { listType: 'bullet', tag: 'ul', start: 1 }),
    )
    list = null
  }

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue

    if (line.startsWith('- ')) {
      list ??= []
      list.push(
        block('listitem', inline(line.slice(2)), { value: list.length + 1 }),
      )
      continue
    }

    flushList()

    if (line.startsWith('### ')) {
      children.push(block('heading', inline(line.slice(4)), { tag: 'h3' }))
    } else if (line.startsWith('## ')) {
      children.push(block('heading', inline(line.slice(3)), { tag: 'h2' }))
    } else {
      children.push(block('paragraph', inline(line), { textFormat: 0, textStyle: '' }))
    }
  }

  flushList()

  return {
    root: {
      type: 'root',
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  } as never
}
