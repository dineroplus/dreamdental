import Link from 'next/link'
import { StudioIcon } from './StudioIcon'

export function StudioPageHeader({
  title,
  subtitle,
  back,
  actions,
}: {
  title: string
  subtitle?: string | null
  back?: { href: string; label: string }
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-6 space-y-3">
      {back ? (
        <Link
          href={back.href}
          className="text-ink-muted hover:text-brand inline-flex min-h-10 items-center gap-2 text-base font-medium"
        >
          <StudioIcon name="arrowLeft" className="h-4 w-4" />
          {back.label}
        </Link>
      ) : null}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-ink text-2xl leading-tight font-semibold tracking-tight md:text-3xl">{title}</h1>
          {subtitle ? <p className="text-ink-muted mt-1.5 text-base">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  )
}
