'use client'

type Props = {
  pending?: boolean
  message?: string | null
  error?: string | null
  onSave: () => void
  onPreview?: (() => void) | null
  onDelete?: (() => void) | null
  saveLabel?: string
  previewLabel?: string
}

/**
 * Full-width sticky dock: large touch targets, no empty pill chrome.
 */
export function EditorActionBar({
  pending = false,
  message,
  error,
  onSave,
  onPreview,
  onDelete,
  saveLabel = 'შენახვა',
  previewLabel = 'საიტზე ნახვა',
}: Props) {
  return (
    <div className="border-hairline bg-canvas sticky bottom-0 z-10 -mx-5 mt-8 border-t px-5 py-3 md:-mx-8 md:px-8">
      <div className="flex flex-wrap items-center gap-3">
        {onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            disabled={pending}
            className="text-ink-muted hover:text-accent min-h-12 rounded-xl px-4 text-base font-medium disabled:opacity-60"
          >
            წაშლა
          </button>
        ) : null}

        <div className="min-w-0 flex-1">
          {error ? <p className="text-accent text-sm font-medium">{error}</p> : null}
          {!error && message ? <p className="text-brand text-sm font-medium">{message}</p> : null}
        </div>

        {onPreview ? (
          <button
            type="button"
            onClick={onPreview}
            disabled={pending}
            className="border-hairline text-ink min-h-12 rounded-xl border bg-surface px-5 text-base font-semibold disabled:opacity-60"
          >
            {previewLabel}
          </button>
        ) : null}

        <button
          type="button"
          onClick={onSave}
          disabled={pending}
          className="bg-brand min-h-12 min-w-[8.5rem] rounded-xl px-6 text-base font-semibold text-white disabled:opacity-60"
        >
          {pending ? 'ინახება…' : saveLabel}
        </button>
      </div>
    </div>
  )
}
