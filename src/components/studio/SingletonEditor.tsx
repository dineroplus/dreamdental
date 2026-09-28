'use client'

import { useState, useTransition } from 'react'
import { unstable_rethrow } from 'next/navigation'
import { FieldRenderer } from './FieldRenderer'
import { EditorActionBar } from './EditorActionBar'
import { EditorPreviewCard } from './EditorPreviewCard'
import {
  absolutePreviewUrl,
  previewImageId,
  previewTitle,
  singletonPreviewPath,
} from './previewUrls'
import { saveSingleton } from '../../admin/actions'
import type { SingletonName } from '../../content/schema'
import type { FieldMap } from '../../content/fields'

const SINGLETON_LABEL: Record<SingletonName, string> = {
  home: 'მთავარი გვერდი',
  settings: 'კლინიკის მონაცემები',
  navigation: 'მენიუ',
  theme: 'ფერები',
}

export function SingletonEditor({
  singletonKey,
  fields,
  initialData,
}: {
  singletonKey: SingletonName
  fields: FieldMap
  initialData: Record<string, unknown>
}) {
  const [data, setData] = useState(initialData)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const title = previewTitle(data) || SINGLETON_LABEL[singletonKey]
  const imageId = previewImageId(data)
  const previewUrl = absolutePreviewUrl(singletonPreviewPath(singletonKey))

  const persist = async () => {
    await saveSingleton(singletonKey, data)
  }

  const onSave = () => {
    setError(null)
    setMessage(null)
    startTransition(async () => {
      try {
        await persist()
        setMessage('შენახულია')
      } catch (err) {
        unstable_rethrow(err)
        setError(err instanceof Error ? err.message : 'შენახვა ვერ მოხერხდა')
      }
    })
  }

  const onPreview = () => {
    if (!previewUrl) return
    setError(null)
    setMessage(null)
    startTransition(async () => {
      try {
        await persist()
        setMessage('შენახულია')
        window.open(previewUrl, '_blank', 'noopener,noreferrer')
      } catch (err) {
        unstable_rethrow(err)
        setError(err instanceof Error ? err.message : 'შენახვა ვერ მოხერხდა')
      }
    })
  }

  return (
    <div className="space-y-6 pb-4">
      <EditorPreviewCard
        title={title}
        statusLabel={SINGLETON_LABEL[singletonKey]}
        imageId={imageId}
        eyebrow="ასე გამოჩნდება საიტზე"
      />

      <FieldRenderer fields={fields} value={data} onChange={setData} />

      <EditorActionBar
        pending={pending}
        message={message}
        error={error}
        onSave={onSave}
        onPreview={previewUrl ? onPreview : null}
      />
    </div>
  )
}
