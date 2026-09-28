'use client'

import { useState } from 'react'
import { FieldRenderer } from './FieldRenderer'
import { useEditorSession } from './useEditorSession'
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
  const { dirty, pending, message, error, run } = useEditorSession(data, () =>
    saveSingleton(singletonKey, data),
  )

  const title = previewTitle(data) || SINGLETON_LABEL[singletonKey]
  const imageId = previewImageId(data)
  const previewUrl = absolutePreviewUrl(singletonPreviewPath(singletonKey))

  const onSave = () => run()

  const onPreview = () => {
    if (!previewUrl) return
    run(() => window.open(previewUrl, '_blank', 'noopener,noreferrer'))
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
        dirty={dirty}
        message={message}
        error={error}
        onSave={onSave}
        onPreview={previewUrl ? onPreview : null}
      />
    </div>
  )
}
