'use client'

import { useEffect, useState } from 'react'
import { listRelated, type RelationOption } from '../../admin/actions'
import type { CollectionName } from '../../content/schema'

type Props = {
  to: string
  value: unknown
  onChange: (next: number | number[] | undefined) => void
  multiple?: boolean
}

export function RelationPicker({ to, value, onChange, multiple = false }: Props) {
  const [options, setOptions] = useState<RelationOption[]>([])
  const ids = Array.isArray(value)
    ? value.filter((id): id is number => typeof id === 'number')
    : typeof value === 'number'
      ? [value]
      : []

  useEffect(() => {
    let cancelled = false
    listRelated(to as CollectionName)
      .then((rows) => {
        if (!cancelled) setOptions(rows)
      })
      .catch(() => {
        if (!cancelled) setOptions([])
      })
    return () => {
      cancelled = true
    }
  }, [to])

  if (!multiple) {
    return (
      <select
        className="border-hairline bg-surface w-full rounded-xl border px-3 py-2 text-sm"
        value={typeof value === 'number' ? String(value) : ''}
        onChange={(event) => onChange(event.target.value ? Number(event.target.value) : undefined)}
      >
        <option value="">—</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.title}
          </option>
        ))}
      </select>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {ids.map((id) => {
          const label = options.find((option) => option.id === id)?.title || 'არჩეული'
          return (
            <button
              key={id}
              type="button"
              className="bg-brand-soft text-brand rounded-full px-3 py-1 text-xs"
              onClick={() => onChange(ids.filter((entry) => entry !== id))}
            >
              {label} ×
            </button>
          )
        })}
      </div>
      <select
        className="border-hairline bg-surface w-full rounded-xl border px-3 py-2 text-sm"
        value=""
        onChange={(event) => {
          const id = Number(event.target.value)
          if (!Number.isFinite(id) || ids.includes(id)) return
          onChange([...ids, id])
        }}
      >
        <option value="">დამატება…</option>
        {options
          .filter((option) => !ids.includes(option.id))
          .map((option) => (
            <option key={option.id} value={option.id}>
              {option.title}
            </option>
          ))}
      </select>
    </div>
  )
}
