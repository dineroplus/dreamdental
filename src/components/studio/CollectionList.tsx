'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { CollectionName } from '../../content/schema'
import { documentPreviewPath } from './previewUrls'
import { StudioIcon } from './StudioIcon'
import { badge, btnPrimary, card, input } from './ui'

export type CollectionRow = {
  id: number
  title: string
  image: string | null
  status: 'draft' | 'published'
  featured: boolean
  slug: string
}

type Filter = 'all' | 'published' | 'draft'

export function CollectionList({
  collection,
  rows,
  singular,
  showFeatured,
}: {
  collection: CollectionName
  rows: CollectionRow[]
  singular: string
  showFeatured: boolean
}) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const counts = useMemo(
    () => ({
      all: rows.length,
      published: rows.filter((row) => row.status === 'published').length,
      draft: rows.filter((row) => row.status === 'draft').length,
    }),
    [rows],
  )

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (filter !== 'all' && row.status !== filter) return false
      if (needle && !row.title.toLowerCase().includes(needle)) return false
      return true
    })
  }, [rows, query, filter])

  if (rows.length === 0) {
    return (
      <div className={`${card} flex flex-col items-center gap-4 px-6 py-14 text-center`}>
        <span className="bg-brand-soft text-brand grid h-14 w-14 place-items-center rounded-2xl">
          <StudioIcon name="plus" className="h-7 w-7" />
        </span>
        <p className="text-ink text-lg font-semibold">ჯერ არაფერია დამატებული</p>
        <Link href={`/admin/${collection}/new`} className={btnPrimary}>
          დაამატე პირველი {singular}
        </Link>
      </div>
    )
  }

  const chips: { key: Filter; label: string }[] = [
    { key: 'all', label: 'ყველა' },
    { key: 'published', label: 'საიტზე ჩანს' },
    { key: 'draft', label: 'დამალული' },
  ]

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <label className="relative md:max-w-sm md:flex-1">
          <span className="sr-only">ძებნა</span>
          <StudioIcon name="search" className="text-ink-faint pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ძებნა სახელით…"
            className={`${input} pl-11`}
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => setFilter(chip.key)}
              className={
                filter === chip.key
                  ? 'bg-ink min-h-11 rounded-xl px-4 text-sm font-semibold text-white'
                  : 'border-hairline text-ink min-h-11 rounded-xl border bg-surface px-4 text-sm font-medium hover:border-brand'
              }
            >
              {chip.label} <span className="opacity-60">{counts[chip.key]}</span>
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="text-ink-muted py-10 text-center text-base">ვერაფერი მოიძებნა.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((row) => {
            const sitePath = row.status === 'published' ? documentPreviewPath(collection, row.slug) : null
            return (
              <div key={row.id} className={`${card} group relative flex gap-4 p-3 transition hover:border-brand`}>
                <Link href={`/admin/${collection}/${row.id}`} className="absolute inset-0 rounded-2xl" aria-label={row.title} />
                <div className="bg-brand-soft h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                  {row.image ? (
                    // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail
                    <img
                      src={row.image}
                      alt=""
                      className={
                        collection === 'cases' ? 'h-full w-full object-contain' : 'h-full w-full object-cover'
                      }
                    />
                  ) : (
                    <div className="text-brand/40 grid h-full place-items-center text-2xl font-semibold">
                      {row.title.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 py-1">
                  <p className="text-ink group-hover:text-brand line-clamp-2 text-base font-semibold">{row.title}</p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className={badge(row.status === 'published' ? 'published' : 'draft')}>
                      {row.status === 'published' ? 'საიტზე ჩანს' : 'დამალული'}
                    </span>
                    {showFeatured && row.featured ? <span className={badge('featured')}>მთავარზე</span> : null}
                  </div>
                </div>
                {sitePath ? (
                  <a
                    href={sitePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="საიტზე ნახვა"
                    className="text-ink-muted hover:text-brand hover:bg-brand-soft relative z-10 self-start rounded-lg p-2"
                  >
                    <StudioIcon name="external" className="h-4 w-4" />
                    <span className="sr-only">საიტზე ნახვა</span>
                  </a>
                ) : null}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
