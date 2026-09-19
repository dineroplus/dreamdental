'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { getMedia, listMedia, uploadMedia, type MediaOption } from '../../admin/media'

type Props = {
  value: unknown
  onChange: (next: number | number[] | undefined) => void
  multiple?: boolean
}

export function ImagePicker({ value, onChange, multiple = false }: Props) {
  const ids = Array.isArray(value)
    ? value.filter((id): id is number => typeof id === 'number')
    : typeof value === 'number'
      ? [value]
      : []
  const [previews, setPreviews] = useState<MediaOption[]>([])
  const [library, setLibrary] = useState<MediaOption[]>([])
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all(ids.map((id) => getMedia(id)))
      .then((rows) => {
        if (!cancelled) setPreviews(rows.filter((row): row is MediaOption => Boolean(row)))
      })
      .catch(() => {
        if (!cancelled) setPreviews([])
      })
    return () => {
      cancelled = true
    }
    // ids joined so we don't refetch on new array identity
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(',')])

  const addId = (item: MediaOption) => {
    setError(null)
    setPreviews((current) =>
      current.some((entry) => entry.id === item.id) ? current : multiple ? [...current, item] : [item],
    )
    if (multiple) {
      const next = ids.includes(item.id) ? ids : [...ids, item.id]
      onChange(next)
    } else {
      onChange(item.id)
    }
  }

  const removeId = (id: number) => {
    setPreviews((current) => current.filter((entry) => entry.id !== id))
    if (multiple) {
      const next = ids.filter((entry) => entry !== id)
      onChange(next.length > 0 ? next : undefined)
    } else {
      onChange(undefined)
    }
  }

  const onFiles = (files: FileList | null) => {
    if (!files?.length) return
    const file = files[0]
    const form = new FormData()
    form.append('file', file)
    setError(null)
    startTransition(async () => {
      try {
        const uploaded = await uploadMedia(form)
        addId(uploaded)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'ატვირთვა ვერ მოხერხდა')
      }
    })
  }

  const openLibrary = () => {
    startTransition(async () => {
      try {
        setLibrary(await listMedia())
      } catch {
        setError('არსებული სურათები ვერ ჩაიტვირთა')
      }
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {previews.map((item) => (
          <figure key={item.id} className="relative h-28 w-28 overflow-hidden rounded-2xl bg-brand-soft">
            {/* Admin preview; next/image is unnecessary for a local picker. */}
            <img src={item.url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeId(item.id)}
              className="absolute top-1 right-1 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-medium"
            >
              წაშლა
            </button>
          </figure>
        ))}

        <button
          type="button"
          disabled={pending}
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault()
            onFiles(event.dataTransfer.files)
          }}
          className="border-hairline text-ink-muted hover:border-brand hover:text-brand flex h-28 min-w-28 flex-col items-center justify-center rounded-2xl border border-dashed px-4 text-xs disabled:opacity-60"
        >
          {pending ? 'იტვირთება…' : 'სურათის ატვირთვა'}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(event) => {
          onFiles(event.target.files)
          event.target.value = ''
        }}
      />

      <button type="button" onClick={openLibrary} className="text-accent text-xs font-semibold">
        არჩევა არსებულიდან
      </button>

      {library.length > 0 ? (
        <div className="grid max-h-48 grid-cols-6 gap-2 overflow-y-auto">
          {library.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => addId(item)}
              className="h-14 overflow-hidden rounded-xl bg-brand-soft"
            >
              <img src={item.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      {error ? <p className="text-accent text-xs">{error}</p> : null}
    </div>
  )
}
