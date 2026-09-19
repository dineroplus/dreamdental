'use client'

import { useState, useTransition } from 'react'
import { unstable_rethrow } from 'next/navigation'
import { FieldRenderer } from './FieldRenderer'
import { saveSingleton } from '../../admin/actions'
import type { SingletonName } from '../../content/schema'
import type { FieldMap } from '../../content/fields'

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

  return (
    <div className="space-y-6 pb-24">
      {error ? <p className="rounded-xl bg-accent-soft px-3 py-2 text-sm text-accent">{error}</p> : null}
      {message ? <p className="text-brand text-sm">{message}</p> : null}

      <FieldRenderer fields={fields} value={data} onChange={setData} />

      <div className="border-hairline bg-canvas/95 sticky bottom-4 z-10 flex justify-end rounded-full border p-2 shadow-soft backdrop-blur">
        <button
          type="button"
          disabled={pending}
          className="bg-brand rounded-full px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          onClick={() => {
            setError(null)
            setMessage(null)
            startTransition(async () => {
              try {
                await saveSingleton(singletonKey, data)
                setMessage('შენახულია')
              } catch (err) {
                unstable_rethrow(err)
                setError(err instanceof Error ? err.message : 'შენახვა ვერ მოხერხდა')
              }
            })
          }}
        >
          {pending ? 'ინახება…' : 'შენახვა'}
        </button>
      </div>
    </div>
  )
}
