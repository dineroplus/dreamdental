'use client'

import { useState, useTransition } from 'react'
import { unstable_rethrow } from 'next/navigation'
import { FieldRenderer } from './FieldRenderer'
import { deleteDocument, saveDocument, type DocumentMeta } from '../../admin/actions'
import type { CollectionName } from '../../content/schema'
import type { FieldMap } from '../../content/fields'

type Props = {
  type: CollectionName
  id: number | null
  fields: FieldMap
  initialData: Record<string, unknown>
  initialMeta: DocumentMeta
  showOrder: boolean
  showFeatured: boolean
  singular: string
}

export function DocumentEditor({
  type,
  id,
  fields,
  initialData,
  initialMeta,
  showOrder,
  showFeatured,
  singular,
}: Props) {
  const [data, setData] = useState(initialData)
  const [meta, setMeta] = useState(initialMeta)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const onSave = () => {
    setError(null)
    setMessage(null)
    startTransition(async () => {
      try {
        await saveDocument(type, id, data, meta)
        setMessage('შენახულია')
      } catch (err) {
        unstable_rethrow(err)
        setError(err instanceof Error ? err.message : 'შენახვა ვერ მოხერხდა')
      }
    })
  }

  const onDelete = () => {
    if (!id) return
    if (!confirm(`წავშალოთ ეს ${singular}?`)) return
    startTransition(async () => {
      try {
        await deleteDocument(type, id)
      } catch (err) {
        unstable_rethrow(err)
      }
    })
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="border-hairline flex flex-wrap items-center gap-4 rounded-2xl border bg-surface p-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={meta.status === 'published'}
            onChange={(event) =>
              setMeta({ ...meta, status: event.target.checked ? 'published' : 'draft' })
            }
            className="h-4 w-4 accent-[var(--c-primary)]"
          />
          საიტზე ჩანს
        </label>

        {showFeatured ? (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={meta.featured}
              onChange={(event) => setMeta({ ...meta, featured: event.target.checked })}
              className="h-4 w-4 accent-[var(--c-primary)]"
            />
            მთავარ გვერდზე
          </label>
        ) : null}

        {showOrder ? (
          <label className="flex items-center gap-2 text-sm">
            <span className="text-ink-muted">რიგი</span>
            <input
              type="number"
              className="border-hairline w-20 rounded-xl border px-2 py-1.5 text-sm"
              value={meta.order}
              onChange={(event) => setMeta({ ...meta, order: Number(event.target.value) || 0 })}
            />
          </label>
        ) : null}
      </div>

      {error ? <p className="rounded-xl bg-accent-soft px-3 py-2 text-sm text-accent">{error}</p> : null}
      {message ? <p className="text-brand text-sm">{message}</p> : null}

      <FieldRenderer fields={fields} value={data} onChange={setData} />

      <div className="border-hairline bg-canvas/95 sticky bottom-4 z-10 flex justify-end gap-2 rounded-full border p-2 shadow-soft backdrop-blur">
        {id ? (
          <button
            type="button"
            onClick={onDelete}
            disabled={pending}
            className="text-ink-muted rounded-full px-4 py-2 text-sm hover:text-accent"
          >
            წაშლა
          </button>
        ) : null}
        <button
          type="button"
          onClick={onSave}
          disabled={pending}
          className="bg-brand rounded-full px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? 'ინახება…' : 'შენახვა'}
        </button>
      </div>
    </div>
  )
}
