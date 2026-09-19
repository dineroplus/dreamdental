'use client'

import { useActionState } from 'react'
import { loginAction } from '../../admin/actions'

export function LoginForm() {
  const [state, action, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => loginAction(formData),
    null,
  )

  return (
    <form action={action} className="card w-full max-w-md space-y-4 p-8">
      <div>
        <p className="text-brand text-xs font-semibold tracking-wide uppercase">Dream Studio</p>
        <h1 className="text-ink mt-2 text-2xl font-semibold">შესვლა</h1>
        <p className="text-ink-muted mt-1 text-sm">კონტენტის მართვა კლინიკის გუნდისთვის.</p>
      </div>

      {state?.error ? (
        <p className="rounded-xl bg-accent-soft px-3 py-2 text-sm text-accent">{state.error}</p>
      ) : null}

      <label className="block space-y-1.5">
        <span className="text-sm">ელფოსტა</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          className="border-hairline w-full rounded-xl border bg-surface px-3 py-2 text-sm"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm">პაროლი</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="border-hairline w-full rounded-xl border bg-surface px-3 py-2 text-sm"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="bg-brand w-full rounded-full px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? 'შესვლა…' : 'შესვლა'}
      </button>
    </form>
  )
}
