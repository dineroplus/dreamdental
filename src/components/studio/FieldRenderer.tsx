'use client'

import { useMemo, useState } from 'react'
import { locales, type Locale } from '../../i18n/config'
import { emptyShape, emptyValue, type Field, type FieldMap } from '../../content/fields'

const LOCALE_LABEL: Record<Locale, string> = {
  ka: 'ქარ',
  en: 'EN',
  ru: 'RU',
}

const INPUT =
  'w-full rounded-xl border border-hairline bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent'

type Props = {
  fields: FieldMap
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
}

export function FieldRenderer({ fields, value, onChange }: Props) {
  const [locale, setLocale] = useState<Locale>('ka')
  const entries = useMemo(() => Object.entries(fields), [fields])
  const main = entries.filter(([, field]) => !field.sidebar)
  const side = entries.filter(([, field]) => field.sidebar)

  const setField = (name: string, next: unknown) => {
    onChange({ ...value, [name]: next })
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="space-y-5">
        <div className="flex gap-2">
          {locales.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setLocale(code)}
              className={
                locale === code
                  ? 'bg-brand rounded-full px-3 py-1 text-xs font-semibold text-white'
                  : 'bg-brand-soft text-brand rounded-full px-3 py-1 text-xs font-semibold'
              }
            >
              {LOCALE_LABEL[code]}
            </button>
          ))}
        </div>

        {main.map(([name, field]) => (
          <FieldControl
            key={name}
            name={name}
            field={field}
            locale={locale}
            value={value[name]}
            onChange={(next) => setField(name, next)}
          />
        ))}
      </div>

      {side.length > 0 && (
        <aside className="space-y-5">
          {side.map(([name, field]) => (
            <FieldControl
              key={name}
              name={name}
              field={field}
              locale={locale}
              value={value[name]}
              onChange={(next) => setField(name, next)}
            />
          ))}
        </aside>
      )}
    </div>
  )
}

function FieldControl({
  name,
  field,
  locale,
  value,
  onChange,
}: {
  name: string
  field: Field
  locale: Locale
  value: unknown
  onChange: (next: unknown) => void
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-ink text-sm font-medium">
        {field.label}
        {field.required ? <span className="text-brand"> *</span> : null}
      </span>
      {field.hint ? <span className="text-ink-muted block text-xs">{field.hint}</span> : null}
      <FieldInput field={field} locale={locale} value={value} onChange={onChange} name={name} />
    </label>
  )
}

function FieldInput({
  field,
  locale,
  value,
  onChange,
  name,
}: {
  field: Field
  locale: Locale
  value: unknown
  onChange: (next: unknown) => void
  name: string
}) {
  if (field.localized) {
    const map = (value as Record<string, unknown> | undefined) ?? {}
    const setLocaleValue = (next: unknown) => onChange({ ...map, [locale]: next })
    return (
      <FieldInput
        field={{ ...field, localized: false }}
        locale={locale}
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
          rows={field.kind === 'markdown' ? 12 : field.rows ?? 4}
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
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
          className="h-4 w-4 accent-[var(--c-primary)]"
        />
      )
    case 'select':
      return (
        <select
          className={INPUT}
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(event.target.value)}
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
                    ? 'bg-brand rounded-full px-3 py-1 text-xs text-white'
                    : 'border-hairline rounded-full border px-3 py-1 text-xs'
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
    case 'relation':
      return (
        <input
          type="number"
          className={INPUT}
          placeholder="ID"
          value={typeof value === 'number' ? value : ''}
          onChange={(event) =>
            onChange(event.target.value === '' ? undefined : Number(event.target.value))
          }
        />
      )
    case 'imageList':
    case 'relationList':
      return (
        <input
          className={INPUT}
          placeholder="1, 2, 3"
          value={Array.isArray(value) ? value.join(', ') : ''}
          onChange={(event) => {
            const ids = event.target.value
              .split(',')
              .map((part) => Number(part.trim()))
              .filter((id) => Number.isFinite(id) && id > 0)
            onChange(ids)
          }}
        />
      )
    case 'list':
      return (
        <ListEditor
          field={field}
          value={Array.isArray(value) ? value : []}
          locale={locale}
          onChange={onChange}
        />
      )
    case 'objectList':
      return (
        <ObjectListEditor
          field={field}
          value={Array.isArray(value) ? (value as Record<string, unknown>[]) : []}
          locale={locale}
          onChange={onChange}
        />
      )
    case 'group':
      return (
        <div className="border-hairline space-y-3 rounded-2xl border p-4">
          <FieldRenderer
            fields={field.fields}
            value={(value as Record<string, unknown>) ?? {}}
            onChange={onChange}
          />
        </div>
      )
    case 'blocks':
      return (
        <p className="text-ink-muted text-xs">
          ბლოკების რედაქტორი მალე დაემატება. ახლა კონტენტი DB-ში უკვე შენახულია.
        </p>
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
  locale,
  onChange,
}: {
  field: Extract<Field, { kind: 'list' }>
  value: unknown[]
  locale: Locale
  onChange: (next: unknown) => void
}) {
  return (
    <div className="space-y-2">
      {value.map((item, index) => (
        <div key={index} className="flex gap-2">
          <div className="min-w-0 flex-1">
            <FieldInput
              field={field.of}
              locale={locale}
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
            className="text-ink-muted text-xs"
            onClick={() => onChange(value.filter((_, i) => i !== index))}
          >
            წაშლა
          </button>
        </div>
      ))}
      <button
        type="button"
        className="text-accent text-xs font-semibold"
        onClick={() => onChange([...value, emptyValue(field.of)])}
      >
        {field.addLabel || 'დამატება'}
      </button>
    </div>
  )
}

function ObjectListEditor({
  field,
  value,
  locale,
  onChange,
}: {
  field: Extract<Field, { kind: 'objectList' }>
  value: Record<string, unknown>[]
  locale: Locale
  onChange: (next: unknown) => void
}) {
  return (
    <div className="space-y-3">
      {value.map((item, index) => (
        <div key={index} className="border-hairline space-y-3 rounded-2xl border p-4">
          <div className="flex items-center justify-between">
            <span className="text-ink-muted text-xs">#{index + 1}</span>
            <button
              type="button"
              className="text-ink-muted text-xs"
              onClick={() => onChange(value.filter((_, i) => i !== index))}
            >
              წაშლა
            </button>
          </div>
          {Object.entries(field.fields).map(([key, child]) => (
            <FieldControl
              key={key}
              name={key}
              field={child}
              locale={locale}
              value={item[key]}
              onChange={(next) => {
                const copy = [...value]
                copy[index] = { ...item, [key]: next }
                onChange(copy)
              }}
            />
          ))}
        </div>
      ))}
      <button
        type="button"
        className="text-accent text-xs font-semibold"
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
  locale,
  onChange,
}: {
  field: Extract<Field, { kind: 'blocks' }>
  value: Record<string, unknown>[]
  locale: Locale
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
                className="text-ink-muted text-xs"
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
                    locale={locale}
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
            className="text-accent text-xs font-semibold"
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
