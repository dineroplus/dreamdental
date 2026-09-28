'use client'

type Props = {
  pending?: boolean
  dirty?: boolean
  message?: string | null
  error?: string | null
  onSave: () => void
  onPreview?: (() => void) | null
  previewHint?: string | null
  onDelete?: (() => void) | null
  saveLabel?: string
  previewLabel?: string
}

/**
 * Full-width sticky dock: large touch targets, no empty pill chrome.
 */
export function EditorActionBar({
  pending = false,
  dirty = false,
  message,
  error,
  onSave,
  onPreview,
  previewHint,
  onDelete,
  saveLabel = 'შენახვა',
  previewLabel = 'საიტზე ნახვა',
}: Props) {
  const previewDisabled = pending || Boolean(previewHint)

  return (
    <div className="border-hairline bg-canvas/95 sticky bottom-0 z-10 -mx-4 mt-8 border-t px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
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

        <div className="min-w-0 flex-1" aria-live="polite">
          {error ? (
            <p className="text-accent text-sm font-medium">{error}</p>
          ) : message ? (
            <p className="text-sm font-medium text-emerald-700">✓ {message}</p>
          ) : dirty ? (
            <p className="flex items-center gap-2 text-sm font-medium text-amber-700">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              შეუნახავი ცვლილებები
            </p>
          ) : previewHint ? (
            <p className="text-ink-muted text-sm">{previewHint}</p>
          ) : null}
        </div>

        {onPreview ? (
          <button
            type="button"
            onClick={onPreview}
            disabled={previewDisabled}
            title={previewHint ?? undefined}
            className="border-hairline text-ink min-h-12 rounded-xl border bg-surface px-5 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            {previewLabel}
          </button>
        ) : null}

        <button
          type="button"
          onClick={onSave}
          disabled={pending}
          title="Ctrl/⌘ + S"
          className="bg-brand min-h-12 min-w-[8.5rem] rounded-xl px-6 text-base font-semibold text-white disabled:opacity-60"
        >
          {pending ? 'ინახება…' : saveLabel}
        </button>
      </div>
    </div>
  )
}
