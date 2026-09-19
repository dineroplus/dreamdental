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
  showSlug: boolean
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
  showSlug,
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
    <div className="space-y-6">
      <div className="border-hairline flex flex-wrap items-end gap-4 rounded-2xl border bg-surface p-4">
        {showSlug ? (
          <label className="min-w-[12rem] flex-1 space-y-1">
            <span className="text-ink-muted text-xs">Slug</span>
            <input
              className="border-hairline w-full rounded-xl border px-3 py-2 text-sm"
              value={meta.slug}
              onChange={(event) => setMeta({ ...meta, slug: event.target.value })}
            />
          </label>
        ) : null}

        {showOrder ? (
          <label className="w-28 space-y-1">
            <span className="text-ink-muted text-xs">რიგი</span>
            <input
              type="number"
              className="border-hairline w-full rounded-xl border px-3 py-2 text-sm"
              value={meta.order}
              onChange={(event) => setMeta({ ...meta, order: Number(event.target.value) || 0 })}
            />
          </label>
        ) : null}

        <label className="space-y-1">
          <span className="text-ink-muted text-xs">სტატუსი</span>
          <select
            className="border-hairline block rounded-xl border px-3 py-2 text-sm"
            value={meta.status}
            onChange={(event) =>
              setMeta({ ...meta, status: event.target.value as DocumentMeta['status'] })
            }
          >
            <option value="draft">დრაფტი</option>
            <option value="published">გამოქვეყნებული</option>
          </select>
        </label>

        {showFeatured ? (
          <label className="flex items-center gap-2 pb-2 text-sm">
            <input
              type="checkbox"
              checked={meta.featured}
              onChange={(event) => setMeta({ ...meta, featured: event.target.checked })}
            />
            მთავარზე
          </label>
        ) : null}

        <div className="ml-auto flex gap-2">
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
            className="bg-brand rounded-full px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {pending ? 'ინახება…' : 'შენახვა'}
          </button>
        </div>
      </div>

      {error ? <p className="rounded-xl bg-accent-soft px-3 py-2 text-sm text-accent">{error}</p> : null}
      {message ? <p className="text-brand text-sm">{message}</p> : null}

      <FieldRenderer fields={fields} value={data} onChange={setData} />
    </div>
  )
}
