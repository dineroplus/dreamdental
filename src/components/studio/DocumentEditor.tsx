'use client'

import { useState } from 'react'
import { unstable_rethrow } from 'next/navigation'
import { FieldRenderer } from './FieldRenderer'
import { useEditorSession } from './useEditorSession'
import { EditorActionBar } from './EditorActionBar'
import { EditorPreviewCard } from './EditorPreviewCard'
import {
  absolutePreviewUrl,
  documentPreviewPath,
  previewImageId,
  previewTitle,
} from './previewUrls'
import { deleteDocument, saveDocument, type DocumentMeta } from '../../admin/actions'
import { collections, type CollectionName } from '../../content/schema'
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
  const { dirty, pending, message, error, run, startTransition } = useEditorSession({ data, meta }, () =>
    saveDocument(type, id, data, meta),
  )

  const titleKey = collections[type].titleKey
  const title = previewTitle(data, titleKey)
  const imageId = previewImageId(data)
  const previewPath = documentPreviewPath(type, meta.slug)
  const previewUrl = absolutePreviewUrl(previewPath)
  const statusLabel =
    meta.status === 'published'
      ? showFeatured && meta.featured
        ? 'საიტზე ჩანს · მთავარ გვერდზე'
        : 'საიტზე ჩანს'
      : 'დამალულია საიტიდან'

  const isPublished = meta.status === 'published'
  const previewHint = !isPublished
    ? 'ნახვისთვის ჯერ ჩართე „საიტზე ჩანს“'
    : !id
      ? 'ნახვა შესაძლებელია პირველი შენახვის შემდეგ'
      : null

  const onSave = () => run()

  const onPreview = () => {
    if (!previewUrl || previewHint) return
    run(() => window.open(previewUrl, '_blank', 'noopener,noreferrer'))
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
    <div className="space-y-6 pb-4">
      <EditorPreviewCard title={title} statusLabel={statusLabel} imageId={imageId} />

      <div className="border-hairline flex flex-wrap items-center gap-4 rounded-2xl border bg-surface p-4">
        <label className="flex min-h-12 items-center gap-3 text-base">
          <input
            type="checkbox"
            checked={meta.status === 'published'}
            onChange={(event) =>
              setMeta({ ...meta, status: event.target.checked ? 'published' : 'draft' })
            }
            className="h-5 w-5 accent-[var(--c-primary)]"
          />
          საიტზე ჩანს
        </label>

        {showFeatured ? (
          <label className="flex min-h-12 items-center gap-3 text-base">
            <input
              type="checkbox"
              checked={meta.featured}
              onChange={(event) => setMeta({ ...meta, featured: event.target.checked })}
              className="h-5 w-5 accent-[var(--c-primary)]"
            />
            მთავარ გვერდზე
          </label>
        ) : null}

        {showOrder ? (
          <label className="flex min-h-12 items-center gap-3 text-base">
            <span className="text-ink-muted">რიგი</span>
            <input
              type="number"
              className="border-hairline w-24 rounded-xl border px-3 py-2.5 text-base"
              value={meta.order}
              onChange={(event) => setMeta({ ...meta, order: Number(event.target.value) || 0 })}
            />
          </label>
        ) : null}
      </div>

      <FieldRenderer fields={fields} value={data} onChange={setData} />

      <EditorActionBar
        pending={pending}
        dirty={dirty}
        message={message}
        error={error}
        onSave={onSave}
        onPreview={previewUrl ? onPreview : null}
        previewHint={previewHint}
        onDelete={id ? onDelete : null}
      />
    </div>
  )
}
