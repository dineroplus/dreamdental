'use client'

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { getMedia } from '../../admin/media'
import { locales, type Locale } from '../../i18n/config'
import { emptyShape, emptyValue, type Field, type FieldMap } from '../../content/fields'
import { ImagePicker } from './ImagePicker'
import { RelationPicker } from './RelationPicker'

const LOCALE_LABEL: Record<Locale, string> = {
  ka: 'ქართული',
  en: 'English',
  ru: 'Русский',
  he: 'עברית',
  ar: 'العربية',
}

const PRIMARY_LOCALES: Locale[] = ['ka', 'en', 'ru']
const EXTRA_LOCALES: Locale[] = ['he', 'ar']

const TOOL =
  'border-hairline text-ink hover:border-brand hover:text-brand min-h-9 rounded-lg border bg-surface px-3 text-sm font-semibold disabled:opacity-40'

function fillEmptyFromGeorgian(value: unknown, locale: Locale): { next: unknown; copied: number } {
  let copied = 0
  const walk = (node: unknown): unknown => {
    if (Array.isArray(node)) return node.map(walk)
    if (!node || typeof node !== 'object') return node
    const record = node as Record<string, unknown>
    const keys = Object.keys(record)
    const localized = keys.length > 0 && keys.every((key) => (locales as readonly string[]).includes(key))
    if (localized) {
      const georgian = record.ka
      const current = record[locale]
      const empty = typeof current !== 'string' || current.trim() === ''
      if (typeof georgian === 'string' && georgian.trim() && empty) {
        copied += 1
        return { ...record, [locale]: georgian }
      }
      return record
    }
    const next: Record<string, unknown> = {}
    for (const [key, item] of Object.entries(record)) next[key] = walk(item)
    return next
  }
  return { next: walk(value), copied }
}

function moveAt<T>(items: T[], index: number, delta: number): T[] {
  const target = index + delta
  if (target < 0 || target >= items.length) return items
  const copy = [...items]
  const [item] = copy.splice(index, 1)
  copy.splice(target, 0, item)
  return copy
}

const INPUT =
  'w-full rounded-xl border border-hairline bg-surface px-3.5 py-3 text-base text-ink outline-none focus:border-brand'

const LocaleCtx = createContext<Locale>('ka')
/** Values of the fields next to the one being rendered, for cross-field previews. */
const SiblingsCtx = createContext<Record<string, unknown>>({})

const HEX = /^#[0-9a-f]{6}$/i

type Props = {
  fields: FieldMap
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  embedded?: boolean
}

function LocaleButton({
  code,
  active,
  onClick,
}: {
  code: Locale
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? 'bg-brand min-h-11 rounded-xl px-5 py-2.5 text-base font-semibold text-white'
          : 'bg-brand-soft text-brand min-h-11 rounded-xl px-5 py-2.5 text-base font-semibold'
      }
    >
      {LOCALE_LABEL[code]}
    </button>
  )
}

export function FieldRenderer({ fields, value, onChange, embedded = false }: Props) {
  const [locale, setLocale] = useState<Locale>('ka')
  const [extraOpen, setExtraOpen] = useState(false)
  const [copyNote, setCopyNote] = useState<string | null>(null)
  const showExtra = extraOpen || EXTRA_LOCALES.includes(locale)

  const body = <FieldSet fields={fields} value={value} onChange={onChange} />

  if (embedded) return body

  const copyFromGeorgian = () => {
    const filled = fillEmptyFromGeorgian(value, locale)
    if (filled.copied === 0) {
      setCopyNote('ცარიელი ველი არ დარჩა')
      return
    }
    onChange(filled.next as Record<string, unknown>)
    setCopyNote(`${filled.copied} ველი შეივსო ქართულიდან. გადაამოწმე და შეინახე.`)
  }

  return (
    <LocaleCtx.Provider value={locale}>
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {PRIMARY_LOCALES.map((code) => (
              <LocaleButton key={code} code={code} active={locale === code} onClick={() => setLocale(code)} />
            ))}
            <button
              type="button"
              onClick={() => {
                if (showExtra) {
                  setExtraOpen(false)
                  if (EXTRA_LOCALES.includes(locale)) setLocale('ka')
                  return
                }
                setExtraOpen(true)
              }}
              className="text-ink-muted hover:text-brand min-h-11 rounded-xl px-3 text-sm font-semibold"
            >
              {showExtra ? 'ებრაული და არაბული ▲' : 'ებრაული და არაბული'}
            </button>
          </div>
          {showExtra ? (
            <div className="flex flex-wrap gap-2">
              {EXTRA_LOCALES.map((code) => (
                <LocaleButton key={code} code={code} active={locale === code} onClick={() => setLocale(code)} />
              ))}
            </div>
          ) : null}
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-ink-muted text-sm">ჯერ ქართული შეავსე. სხვა ენები სურვილისამებრ.</p>
            {locale !== 'ka' ? (
              <button type="button" onClick={copyFromGeorgian} className={TOOL}>
                ცარიელი ველები ქართულიდან
              </button>
            ) : null}
            {copyNote ? <p className="text-ink text-sm">{copyNote}</p> : null}
          </div>
        </div>
        {body}
      </div>
    </LocaleCtx.Provider>
  )
}

function FieldSet({
  fields,
  value,
  onChange,
}: {
  fields: FieldMap
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
}) {
  const entries = useMemo(() => Object.entries(fields), [fields])
  const setField = (name: string, next: unknown) => onChange({ ...value, [name]: next })

  const main = entries.filter(([, field]) => !field.sidebar && !field.advanced)
  const side = entries.filter(([, field]) => field.sidebar && !field.advanced)
  const extra = entries.filter(([, field]) => field.advanced)

  return (
    <SiblingsCtx.Provider value={value}>
      <div className={side.length > 0 ? 'grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]' : ''}>
        <div className="space-y-5">
          {main.map(([name, field]) => (
            <FieldControl
              key={name}
              name={name}
              field={field}
              value={value[name]}
              onChange={(next) => setField(name, next)}
            />
          ))}
          {extra.length > 0 ? (
            <details className="border-hairline rounded-2xl border bg-surface px-4 py-4">
              <summary className="text-ink-muted cursor-pointer text-base font-medium">
                დამატებით
              </summary>
              <div className="mt-4 space-y-5">
                {extra.map(([name, field]) => (
                  <FieldControl
                    key={name}
                    name={name}
                    field={field}
                    value={value[name]}
                    onChange={(next) => setField(name, next)}
                  />
                ))}
              </div>
            </details>
          ) : null}
        </div>

        {side.length > 0 ? (
          <aside className="space-y-5">
            {side.map(([name, field]) => (
              <FieldControl
                key={name}
                name={name}
                field={field}
                value={value[name]}
                onChange={(next) => setField(name, next)}
              />
            ))}
          </aside>
        ) : null}
      </div>
    </SiblingsCtx.Provider>
  )
}

function FieldControl({
  name,
  field,
  value,
  onChange,
}: {
  name: string
  field: Field
  value: unknown
  onChange: (next: unknown) => void
}) {
  if (field.kind === 'group') {
    return (
      <section className="border-hairline overflow-hidden rounded-2xl border bg-surface">
        <header className="border-hairline bg-brand-soft/40 border-b px-4 py-3">
          <h3 className="text-ink text-base font-semibold">{field.label}</h3>
          {field.hint ? (
            <p className="text-ink-muted mt-0.5 text-sm leading-relaxed">{field.hint}</p>
          ) : null}
        </header>
        <div className="p-4">
          <FieldSet
            fields={field.fields}
            value={(value as Record<string, unknown>) ?? {}}
            onChange={onChange}
          />
        </div>
      </section>
    )
  }

  return (
    <div className="block space-y-2">
      <span className="text-ink text-base font-semibold">
        {field.label}
        {field.required ? <span className="text-brand"> *</span> : null}
      </span>
      {field.hint ? (
        <span className="text-ink-muted block text-sm leading-relaxed">{field.hint}</span>
      ) : null}
      <FieldInput field={field} value={value} onChange={onChange} name={name} />
    </div>
  )
}

function FieldInput({
  field,
  value,
  onChange,
  name,
}: {
  field: Field
  value: unknown
  onChange: (next: unknown) => void
  name: string
}) {
  const locale = useContext(LocaleCtx)

  if (field.localized) {
    const map = (value as Record<string, unknown> | undefined) ?? {}
    const setLocaleValue = (next: unknown) => onChange({ ...map, [locale]: next })
    return (
      <FieldInput
        field={{ ...field, localized: false }}
        value={map[locale]}
        onChange={setLocaleValue}
        name={name}
      />
    )
  }

  switch (field.kind) {
    case 'textarea':
      return (
        <textarea
          className={INPUT}
          rows={field.rows ?? 4}
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(event.target.value)}
        />
      )
    case 'markdown':
      return <MarkdownField value={value} onChange={onChange} />
    case 'number':
      return (
        <input
          type="number"
          className={INPUT}
          value={typeof value === 'number' ? value : ''}
          onChange={(event) =>
            onChange(event.target.value === '' ? undefined : Number(event.target.value))
          }
        />
      )
    case 'boolean':
      return (
        <label className="flex min-h-12 items-center gap-3 text-base">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event) => onChange(event.target.checked)}
            className="h-5 w-5 accent-[var(--c-primary)]"
          />
          <span className="text-ink-muted">{value ? 'ჩართული' : 'გამორთული'}</span>
        </label>
      )
    case 'select':
      return (
        <select
          className={INPUT}
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(event.target.value || undefined)}
        >
          <option value="">—</option>
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )
    case 'multiselect':
      return (
        <div className="flex flex-wrap gap-2">
          {field.options.map((option) => {
            const selected = Array.isArray(value) && value.includes(option.value)
            return (
              <button
                key={option.value}
                type="button"
                className={
                  selected
                    ? 'bg-brand min-h-11 rounded-xl px-4 py-2.5 text-sm text-white'
                    : 'border-hairline min-h-11 rounded-xl border px-4 py-2.5 text-sm'
                }
                onClick={() => {
                  const current = Array.isArray(value) ? [...value] : []
                  onChange(
                    selected
                      ? current.filter((entry) => entry !== option.value)
                      : [...current, option.value],
                  )
                }}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      )
    case 'color':
      return <ColorInput field={field} value={value} onChange={onChange} />
    case 'date':
      return (
        <input
          type="date"
          className={INPUT}
          value={typeof value === 'string' ? value.slice(0, 10) : ''}
          onChange={(event) => onChange(event.target.value)}
        />
      )
    case 'image':
      return <ImagePicker value={value} onChange={onChange} fit={field.fit} locale={locale} />
    case 'imageList':
      return <ImagePicker value={value} onChange={onChange} multiple locale={locale} />
    case 'relation':
      return <RelationPicker to={field.to} value={value} onChange={onChange} />
    case 'relationList':
      return <RelationPicker to={field.to} value={value} onChange={onChange} multiple />
    case 'list':
      return (
        <ListEditor field={field} value={Array.isArray(value) ? value : []} onChange={onChange} />
      )
    case 'objectList':
      return (
        <ObjectListEditor
          field={field}
          value={Array.isArray(value) ? (value as Record<string, unknown>[]) : []}
          onChange={onChange}
        />
      )
    case 'group':
      return (
        <div className="border-hairline space-y-3 rounded-2xl border p-4">
          <FieldSet
            fields={field.fields}
            value={(value as Record<string, unknown>) ?? {}}
            onChange={onChange}
          />
        </div>
      )
    case 'blocks':
      return (
        <BlocksEditor
          field={field}
          value={Array.isArray(value) ? (value as Record<string, unknown>[]) : []}
          onChange={onChange}
        />
      )
    default:
      return (
        <input
          className={INPUT}
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(event.target.value)}
        />
      )
  }
}

function ColorInput({
  field,
  value,
  onChange,
}: {
  field: Extract<Field, { kind: 'color' }>
  value: unknown
  onChange: (next: unknown) => void
}) {
  const siblings = useContext(SiblingsCtx)
  const current = typeof value === 'string' && HEX.test(value) ? value.toLowerCase() : ''
  const imageId = field.previewImage ? siblings[field.previewImage] : undefined
  const [preview, setPreview] = useState<{ id: number; url: string } | null>(null)
  const previewUrl = preview && preview.id === imageId ? preview.url : null

  useEffect(() => {
    if (typeof imageId !== 'number') return
    let cancelled = false
    getMedia(imageId)
      .then((media) => {
        if (!cancelled && media) setPreview({ id: imageId, url: media.url })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [imageId])

  return (
    <div className="flex flex-wrap items-start gap-5">
      {field.previewImage ? (
        <div
          className="bg-brand-soft relative aspect-3/4 w-32 shrink-0 overflow-hidden rounded-2xl border border-hairline"
          style={current ? { backgroundColor: current } : undefined}
        >
          {previewUrl ? (
            // Admin preview; next/image is unnecessary for a local picker.
            <img
              src={previewUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-contain object-bottom px-2 pt-4"
            />
          ) : (
            <span className="text-ink-muted absolute inset-0 grid place-items-center px-3 text-center text-xs">
              ჯერ ფოტო ატვირთე
            </span>
          )}
        </div>
      ) : null}

      <div className="min-w-0 flex-1 space-y-3">
        {field.swatches?.length ? (
          <div className="flex flex-wrap gap-2">
            {field.swatches.map((swatch) => {
              const selected = current === swatch.value.toLowerCase()
              return (
                <button
                  key={swatch.value}
                  type="button"
                  title={swatch.label}
                  aria-label={swatch.label}
                  aria-pressed={selected}
                  onClick={() => onChange(swatch.value)}
                  className={
                    selected
                      ? 'ring-brand h-10 w-10 rounded-full border border-hairline ring-2 ring-offset-2'
                      : 'h-10 w-10 rounded-full border border-hairline hover:scale-110 transition-transform'
                  }
                  style={{ backgroundColor: swatch.value }}
                />
              )
            })}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <label className="text-ink-muted flex items-center gap-2 text-sm">
            <input
              type="color"
              className="h-10 w-16 cursor-pointer rounded-lg border border-hairline bg-transparent p-1"
              value={current || '#ffffff'}
              onChange={(event) => onChange(event.target.value)}
            />
            {field.swatches?.length ? 'სხვა ფერი' : null}
          </label>
          {current ? <code className="text-ink-muted text-sm">{current}</code> : null}
          {current && !field.required ? (
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="text-accent text-sm font-semibold"
            >
              ნაგულისხმევზე დაბრუნება
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function applyMarkup(
  current: string,
  start: number,
  end: number,
  kind: 'bold' | 'list' | 'heading',
): { next: string; from: number; to: number } {
  if (kind === 'bold') {
    const selected = current.slice(start, end) || 'ტექსტი'
    const wrapped = `**${selected}**`
    return {
      next: current.slice(0, start) + wrapped + current.slice(end),
      from: start + 2,
      to: start + 2 + selected.length,
    }
  }
  const lineStart = current.lastIndexOf('\n', Math.max(0, start - 1)) + 1
  const lineEnd = current.indexOf('\n', end)
  const endAt = lineEnd === -1 ? current.length : lineEnd
  const block = current.slice(lineStart, endAt)
  const lines = (block || (kind === 'list' ? 'პუნქტი' : 'სათაური')).split('\n')
  const formatted = lines
    .map((line) => {
      if (kind === 'heading') return line.startsWith('## ') ? line : `## ${line}`
      return line.startsWith('- ') ? line : `- ${line}`
    })
    .join('\n')
  return {
    next: current.slice(0, lineStart) + formatted + current.slice(endAt),
    from: lineStart,
    to: lineStart + formatted.length,
  }
}

function MarkdownField({ value, onChange }: { value: unknown; onChange: (next: unknown) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const text = typeof value === 'string' ? value : ''

  const apply = (kind: 'bold' | 'list' | 'heading') => {
    const el = ref.current
    const start = el?.selectionStart ?? text.length
    const end = el?.selectionEnd ?? text.length
    const result = applyMarkup(text, start, end, kind)
    onChange(result.next)
    requestAnimationFrame(() => {
      el?.focus()
      el?.setSelectionRange(result.from, result.to)
    })
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={TOOL} onClick={() => apply('bold')}>
          მუქი
        </button>
        <button type="button" className={TOOL} onClick={() => apply('list')}>
          სია
        </button>
        <button type="button" className={TOOL} onClick={() => apply('heading')}>
          სათაური
        </button>
      </div>
      <textarea
        ref={ref}
        className={INPUT}
        rows={8}
        value={text}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

function ShiftButtons({
  index,
  total,
  onMove,
  onRemove,
  stacked = false,
}: {
  index: number
  total: number
  onMove: (delta: number) => void
  onRemove: () => void
  stacked?: boolean
}) {
  return (
    <div className={stacked ? 'flex shrink-0 flex-col items-stretch gap-1' : 'flex shrink-0 items-center gap-1'}>
      <button type="button" aria-label="ზემოთ" disabled={index === 0} onClick={() => onMove(-1)} className={TOOL}>
        ↑
      </button>
      <button
        type="button"
        aria-label="ქვემოთ"
        disabled={index === total - 1}
        onClick={() => onMove(1)}
        className={TOOL}
      >
        ↓
      </button>
      <button type="button" onClick={onRemove} className="text-accent min-h-9 rounded-lg px-2 text-sm font-semibold">
        წაშლა
      </button>
    </div>
  )
}

function ListEditor({
  field,
  value,
  onChange,
}: {
  field: Extract<Field, { kind: 'list' }>
  value: unknown[]
  onChange: (next: unknown) => void
}) {
  return (
    <div className="space-y-2">
      {value.map((item, index) => (
        <div key={index} className="flex gap-2">
          <div className="min-w-0 flex-1">
            <FieldInput
              field={field.of}
              value={item}
              onChange={(next) => {
                const copy = [...value]
                copy[index] = next
                onChange(copy)
              }}
              name={`${index}`}
            />
          </div>
          <ShiftButtons
            index={index}
            total={value.length}
            onMove={(delta) => onChange(moveAt(value, index, delta))}
            onRemove={() => onChange(value.filter((_, i) => i !== index))}
          />
        </div>
      ))}
      <button
        type="button"
        className="text-accent text-sm font-semibold"
        onClick={() => onChange([...value, emptyValue(field.of)])}
      >
        {field.addLabel || 'დამატება'}
      </button>
    </div>
  )
}

function itemTitle(item: Record<string, unknown>, field: Extract<Field, { kind: 'objectList' }>) {
  const titleKey = field.titleKey
  if (!titleKey) return ''
  const raw = item[titleKey]
  const child = field.fields[titleKey]
  if (child?.kind === 'select' && typeof raw === 'string') {
    return child.options.find((option) => option.value === raw)?.label || raw
  }
  if (typeof raw === 'string') return raw
  if (raw && typeof raw === 'object') {
    const map = raw as Record<string, unknown>
    return String(locales.map((code) => map[code]).find((part) => typeof part === 'string' && part) || '')
  }
  return ''
}

function ObjectListEditor({
  field,
  value,
  onChange,
}: {
  field: Extract<Field, { kind: 'objectList' }>
  value: Record<string, unknown>[]
  onChange: (next: unknown) => void
}) {
  const [initialCount] = useState(value.length)
  const openAll = initialCount <= 2

  return (
    <div className="space-y-3">
      {value.map((item, index) => (
        <div key={index} className="border-hairline flex items-start gap-2 overflow-hidden rounded-2xl border bg-surface">
          <details open={openAll || index >= initialCount || undefined} className="group/item min-w-0 flex-1">
            <summary className="hover:bg-canvas flex min-h-12 cursor-pointer list-none items-center gap-3 py-2 pr-3 pl-4">
              <span className="bg-brand-soft text-brand grid h-7 w-7 shrink-0 place-items-center rounded-lg text-sm font-semibold">
                {index + 1}
              </span>
              <span className="text-ink min-w-0 flex-1 truncate text-base font-medium">
                {itemTitle(item, field) || `ჩანაწერი ${index + 1}`}
              </span>
              {item.enabled === false ? <span className="text-ink-faint shrink-0 text-sm">გამორთული</span> : null}
              <span className="text-ink-faint text-sm transition group-open/item:rotate-180">▾</span>
            </summary>
            <div className="border-hairline space-y-4 border-t p-4">
              {Object.entries(field.fields).map(([key, child]) => (
                <FieldControl
                  key={key}
                  name={key}
                  field={child}
                  value={item[key]}
                  onChange={(next) => {
                    const copy = [...value]
                    copy[index] = { ...item, [key]: next }
                    onChange(copy)
                  }}
                />
              ))}
            </div>
          </details>
          <div className="py-2 pr-2">
            <ShiftButtons
              stacked
              index={index}
              total={value.length}
              onMove={(delta) => onChange(moveAt(value, index, delta))}
              onRemove={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        className="border-hairline text-brand hover:border-brand min-h-11 w-full rounded-xl border border-dashed px-4 text-base font-semibold"
        onClick={() => onChange([...value, emptyShape(field.fields)])}
      >
        {field.addLabel || 'დამატება'}
      </button>
    </div>
  )
}

function BlocksEditor({
  field,
  value,
  onChange,
}: {
  field: Extract<Field, { kind: 'blocks' }>
  value: Record<string, unknown>[]
  onChange: (next: unknown) => void
}) {
  const blockTypes = Object.entries(field.blocks)

  return (
    <div className="space-y-3">
      {value.map((block, index) => {
        const type = String(block.type ?? '')
        const definition = field.blocks[type]
        return (
          <div
            key={String(block.id ?? index)}
            className="border-hairline space-y-3 rounded-2xl border p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <select
                className={`${INPUT} min-w-[12rem] flex-1`}
                value={type}
                onChange={(event) => {
                  const nextType = event.target.value
                  const nextDef = field.blocks[nextType]
                  const copy = [...value]
                  copy[index] = {
                    type: nextType,
                    id: String(block.id ?? crypto.randomUUID()),
                    ...emptyShape(nextDef.fields),
                  }
                  onChange(copy)
                }}
              >
                {blockTypes.map(([key, def]) => (
                  <option key={key} value={key}>
                    {def.label}
                  </option>
                ))}
              </select>
              <ShiftButtons
                index={index}
                total={value.length}
                onMove={(delta) => onChange(moveAt(value, index, delta))}
                onRemove={() => onChange(value.filter((_, i) => i !== index))}
              />
            </div>
            {definition
              ? Object.entries(definition.fields).map(([key, child]) => (
                  <FieldControl
                    key={key}
                    name={key}
                    field={child}
                    value={block[key]}
                    onChange={(next) => {
                      const copy = [...value]
                      copy[index] = { ...block, [key]: next }
                      onChange(copy)
                    }}
                  />
                ))
              : null}
          </div>
        )
      })}
      <div className="flex flex-wrap gap-2">
        {blockTypes.map(([key, def]) => (
          <button
            key={key}
            type="button"
            className="border-hairline min-h-11 rounded-xl border px-4 py-2.5 text-sm font-semibold"
            onClick={() =>
              onChange([
                ...value,
                { type: key, id: crypto.randomUUID(), ...emptyShape(def.fields) },
              ])
            }
          >
            + {def.label}
          </button>
        ))}
      </div>
    </div>
  )
}
