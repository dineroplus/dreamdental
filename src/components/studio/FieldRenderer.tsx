'use client'

import { createContext, useContext, useMemo, useState } from 'react'
import { locales, type Locale } from '../../i18n/config'
import { emptyShape, emptyValue, type Field, type FieldMap } from '../../content/fields'
import { ImagePicker } from './ImagePicker'
import { RelationPicker } from './RelationPicker'

const LOCALE_LABEL: Record<Locale, string> = {
  ka: 'ქართული',
  en: 'English',
  ru: 'Русский',
}

const INPUT =
  'w-full rounded-xl border border-hairline bg-surface px-3.5 py-3 text-base text-ink outline-none focus:border-brand'

const LocaleCtx = createContext<Locale>('ka')

type Props = {
  fields: FieldMap
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  embedded?: boolean
}

export function FieldRenderer({ fields, value, onChange, embedded = false }: Props) {
  const [locale, setLocale] = useState<Locale>('ka')

  const body = (
    <FieldSet fields={fields} value={value} onChange={onChange} />
  )

  if (embedded) return body

  return (
    <LocaleCtx.Provider value={locale}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          {locales.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setLocale(code)}
              className={
                locale === code
                  ? 'bg-brand min-h-11 rounded-xl px-5 py-2.5 text-base font-semibold text-white'
                  : 'bg-brand-soft text-brand min-h-11 rounded-xl px-5 py-2.5 text-base font-semibold'
              }
            >
              {LOCALE_LABEL[code]}
            </button>
          ))}
          <p className="text-ink-muted text-sm">ჯერ ქართული შეავსე. სხვა ენები სურვილისამებრ.</p>
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
            <summary className="text-ink-muted cursor-pointer text-base font-medium">დამატებით</summary>
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
          {field.hint ? <p className="text-ink-muted mt-0.5 text-sm leading-relaxed">{field.hint}</p> : null}
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
      {field.hint ? <span className="text-ink-muted block text-sm leading-relaxed">{field.hint}</span> : null}
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
    case 'markdown':
      return (
        <textarea
          className={INPUT}
          rows={field.kind === 'markdown' ? 8 : field.rows ?? 4}
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(event.target.value)}
        />
      )
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
      return (
        <input
          type="color"
          className="h-10 w-16 cursor-pointer rounded-lg border border-hairline bg-transparent p-1"
          value={typeof value === 'string' && value ? value : '#000000'}
          onChange={(event) => onChange(event.target.value)}
        />
      )
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
      return <ImagePicker value={value} onChange={onChange} />
    case 'imageList':
      return <ImagePicker value={value} onChange={onChange} multiple />
    case 'relation':
      return <RelationPicker to={field.to} value={value} onChange={onChange} />
    case 'relationList':
      return <RelationPicker to={field.to} value={value} onChange={onChange} multiple />
    case 'list':
      return (
        <ListEditor
          field={field}
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
        />
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
          <button
            type="button"
            className="text-ink-muted text-sm font-medium"
            onClick={() => onChange(value.filter((_, i) => i !== index))}
          >
            წაშლა
          </button>
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

function itemTitle(item: Record<string, unknown>, titleKey?: string) {
  if (!titleKey) return ''
  const raw = item[titleKey]
  if (typeof raw === 'string') return raw
  if (raw && typeof raw === 'object') {
    const map = raw as Record<string, unknown>
    return String(map.ka || map.en || map.ru || '')
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
        <details
          key={index}
          open={openAll || index >= initialCount || undefined}
          className="border-hairline group/item overflow-hidden rounded-2xl border bg-surface"
        >
          <summary className="hover:bg-canvas flex min-h-12 cursor-pointer list-none items-center gap-3 px-4 py-2">
            <span className="bg-brand-soft text-brand grid h-7 w-7 shrink-0 place-items-center rounded-lg text-sm font-semibold">
              {index + 1}
            </span>
            <span className="text-ink min-w-0 flex-1 truncate text-base font-medium">
              {itemTitle(item, field.titleKey) || `ჩანაწერი ${index + 1}`}
            </span>
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
            <button
              type="button"
              className="text-ink-muted hover:text-accent min-h-11 rounded-xl px-2 text-sm font-medium"
              onClick={() => {
                if (confirm('წავშალოთ ეს ჩანაწერი?')) onChange(value.filter((_, i) => i !== index))
              }}
            >
              ამ ჩანაწერის წაშლა
            </button>
          </div>
        </details>
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
          <div key={String(block.id ?? index)} className="border-hairline space-y-3 rounded-2xl border p-4">
            <div className="flex items-center justify-between gap-3">
              <select
                className={INPUT}
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
              <button
                type="button"
                className="text-ink-muted text-sm font-medium"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
              >
                წაშლა
              </button>
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
              onChange([...value, { type: key, id: crypto.randomUUID(), ...emptyShape(def.fields) }])
            }
          >
            + {def.label}
          </button>
        ))}
      </div>
    </div>
  )
}
