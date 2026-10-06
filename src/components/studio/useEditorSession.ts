'use client'

import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { unstable_rethrow } from 'next/navigation'

function saveError(err: unknown) {
  const message = err instanceof Error ? err.message : ''
  if (/invalid server actions request|forbidden|permission denied|unauthorized/i.test(message)) {
    return 'შეცვლა ვერ მოხერხდა. გვერდი განაახლე და თავიდან სცადე.'
  }
  if (message && !message.startsWith('An error occurred')) return message
  return 'შენახვა ვერ მოხერხდა'
}

function savedAtLabel() {
  const time = new Date().toLocaleTimeString('ka-GE', { hour: '2-digit', minute: '2-digit' })
  return `შენახულია ${time}`
}

/**
 * Save flow shared by editors: unsaved-changes tracking, leave-page warning,
 * Cmd/Ctrl+S and a save message that fades after a few seconds.
 */
export function useEditorSession(snapshot: unknown, save: () => Promise<unknown>) {
  const current = JSON.stringify(snapshot)
  const [saved, setSaved] = useState(current)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const timer = useRef<number | null>(null)

  const dirty = current !== saved

  const run = useCallback(
    (after?: () => void) => {
      setError(null)
      setMessage(null)
      startTransition(async () => {
        try {
          await save()
          setSaved(current)
          setMessage(savedAtLabel())
          if (timer.current) window.clearTimeout(timer.current)
          timer.current = window.setTimeout(() => setMessage(null), 3000)
          after?.()
        } catch (err) {
          unstable_rethrow(err)
          setError(saveError(err))
        }
      })
    },
    [current, save],
  )

  const runRef = useRef(run)
  useEffect(() => {
    runRef.current = run
  }, [run])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        runRef.current()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current)
  }, [])

  return { dirty, pending, message, error, run, startTransition }
}
