'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { getMedia, listMedia, uploadMedia, type MediaOption } from '../../admin/media'

/** Phone photos are often larger than the host allows, so shrink them in the browser first. */
async function shrinkForUpload(file: File): Promise<File> {
  if (file.size < 1_200_000 && /jpe?g|png|webp/i.test(file.type)) return file
  try {
    const bitmap = await createImageBitmap(file)
    const max = 2000
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(bitmap.width * scale))
    canvas.height = Math.max(1, Math.round(bitmap.height * scale))
    const context = canvas.getContext('2d')
    if (!context) return file
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.82))
    if (!blob) return file
    const name = file.name.replace(/\.[^.]+$/, '') || 'photo'
    return new File([blob], `${name}.webp`, { type: 'image/webp' })
  } catch {
    return file
  }
}

function uploadError(err: unknown) {
  const message = err instanceof Error ? err.message : ''
  if (/invalid server actions request|forbidden|permission denied|unauthorized/i.test(message)) {
    return 'სურათის შეცვლა ვერ მოხერხდა. გვერდი განაახლე და თავიდან სცადე.'
  }
  if (message && !message.startsWith('An error occurred')) return message
  return 'ატვირთვა ვერ მოხერხდა'
}

type Props = {
  value: unknown
  onChange: (next: number | number[] | undefined) => void
  multiple?: boolean
  /** `contain` shows the whole photo. Used for before/after results so lips are not cropped in the form. */
  fit?: 'cover' | 'contain'
}

export function ImagePicker({ value, onChange, multiple = false, fit = 'cover' }: Props) {
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
    setError(null)
    startTransition(async () => {
      try {
        const ready = await shrinkForUpload(file)
        const form = new FormData()
        form.append('file', ready)
        const uploaded = await uploadMedia(form)
        addId(uploaded)
      } catch (err) {
        setError(uploadError(err))
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
          <figure
            key={item.id}
            className={
              fit === 'contain'
                ? 'relative h-36 w-64 overflow-hidden rounded-2xl bg-brand-soft'
                : 'relative h-36 w-36 overflow-hidden rounded-2xl bg-brand-soft'
            }
          >
            {/* Admin preview; next/image is unnecessary for a local picker. */}
            <img
              src={item.url}
              alt=""
              className={fit === 'contain' ? 'h-full w-full object-contain' : 'h-full w-full object-cover'}
            />
            <button
              type="button"
              onClick={() => removeId(item.id)}
              className="absolute top-2 right-2 rounded-full bg-white/95 px-3 py-1 text-sm font-medium shadow-sm"
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
          className="border-hairline text-ink-muted hover:border-brand hover:text-brand flex h-36 min-w-44 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed px-5 text-sm font-medium disabled:opacity-60"
        >
          {pending ? 'იტვირთება…' : (
            <>
              <span className="text-base font-semibold">დააჭირე ან ჩააგდე ფოტო</span>
              <span className="text-xs">JPG, PNG ან WEBP</span>
            </>
          )}
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

      <button type="button" onClick={openLibrary} className="text-accent text-sm font-semibold">
        არჩევა არსებულიდან
      </button>

      {library.length > 0 ? (
        <div className="grid max-h-56 grid-cols-4 gap-2 overflow-y-auto sm:grid-cols-6">
          {library.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => addId(item)}
              className="h-16 overflow-hidden rounded-xl bg-brand-soft"
            >
              <img
                src={item.url}
                alt=""
                className={fit === 'contain' ? 'h-full w-full object-contain' : 'h-full w-full object-cover'}
              />
            </button>
          ))}
        </div>
      ) : null}

      {error ? <p className="text-accent text-sm">{error}</p> : null}
    </div>
  )
}
