'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { logoutAction } from '../../admin/actions'
import { StudioIcon, type StudioIconName } from './StudioIcon'

type NavItem = { href: string; label: string; icon: StudioIconName; badge?: boolean }

const GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: 'პაციენტები',
    items: [{ href: '/admin/bookings', label: 'ჯავშნები', icon: 'calendar', badge: true }],
  },
  {
    label: 'საიტის გვერდები',
    items: [
      { href: '/admin/singletons/home', label: 'მთავარი გვერდი', icon: 'home' },
      { href: '/admin/singletons/settings', label: 'კლინიკის მონაცემები', icon: 'settings' },
      { href: '/admin/singletons/navigation', label: 'მენიუ', icon: 'menu' },
    ],
  },
  {
    label: 'კონტენტი',
    items: [
      { href: '/admin/doctors', label: 'ექიმები', icon: 'user' },
      { href: '/admin/services', label: 'სერვისები', icon: 'list' },
      { href: '/admin/gallery', label: 'გალერეა', icon: 'image' },
      { href: '/admin/testimonials', label: 'შეფასებები', icon: 'star' },
      { href: '/admin/cases', label: 'მდე / შემდეგ', icon: 'compare' },
    ],
  },
  {
    label: 'სხვა',
    items: [
      { href: '/admin/posts', label: 'ბლოგი', icon: 'pen' },
      { href: '/admin/pages', label: 'გვერდები', icon: 'file' },
      { href: '/admin/singletons/theme', label: 'ფერები', icon: 'palette' },
    ],
  },
]

export function StudioNav({ userName, newBookings }: { userName: string; newBookings: number }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [openedAt, setOpenedAt] = useState(pathname)

  if (open && openedAt !== pathname) {
    setOpen(false)
    setOpenedAt(pathname)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header className="border-hairline bg-surface/95 sticky top-0 z-30 flex items-center justify-between border-b px-4 py-3 backdrop-blur lg:hidden">
        <Brand />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="border-hairline text-ink relative inline-flex min-h-11 items-center gap-2 rounded-xl border bg-surface px-4 text-base font-semibold"
          aria-expanded={open}
        >
          <StudioIcon name="menu" />
          მენიუ
          {newBookings > 0 ? (
            <span className="bg-accent absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] font-bold text-white">
              {newBookings}
            </span>
          ) : null}
        </button>
      </header>

      {open ? (
        <button
          type="button"
          aria-label="მენიუს დახურვა"
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={`border-hairline bg-surface fixed inset-y-0 left-0 z-50 flex w-[290px] max-w-[85vw] flex-col border-r transition-transform duration-200 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-auto lg:max-w-none lg:translate-x-0 ${
          open ? 'translate-x-0 shadow-lift' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5">
          <Brand />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-ink-muted rounded-xl p-2 lg:hidden"
            aria-label="დახურვა"
          >
            <StudioIcon name="close" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-4">
          <NavLink item={{ href: '/admin', label: 'მთავარი', icon: 'inbox' }} active={pathname === '/admin'} />

          {GROUPS.map((group) => (
            <div key={group.label}>
              <p className="text-ink-faint px-3 pb-1.5 text-xs font-semibold">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    active={pathname.startsWith(item.href)}
                    count={item.badge ? newBookings : 0}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-hairline space-y-2 border-t p-3">
          <a
            href="/ka"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:bg-brand-soft flex min-h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-semibold"
          >
            <StudioIcon name="external" />
            საიტის ნახვა
          </a>
          <div className="flex items-center gap-3 rounded-xl px-3 py-2">
            <span className="bg-brand-soft text-brand grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold">
              {(userName.trim().charAt(0) || 'A').toUpperCase()}
            </span>
            <span className="text-ink min-w-0 flex-1 truncate text-sm font-medium">{userName}</span>
            <form action={logoutAction}>
              <button
                type="submit"
                title="გასვლა"
                className="text-ink-muted hover:text-accent hover:bg-accent-soft rounded-xl p-2"
              >
                <StudioIcon name="logout" />
                <span className="sr-only">გასვლა</span>
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  )
}

function Brand() {
  return (
    <Link href="/admin" className="block">
      <p className="text-brand text-xs font-semibold tracking-[0.18em] uppercase">Dream</p>
      <p className="text-ink text-base font-semibold">კლინიკის პანელი</p>
    </Link>
  )
}

function NavLink({ item, active, count = 0 }: { item: NavItem; active: boolean; count?: number }) {
  return (
    <Link
      href={item.href}
      className={
        active
          ? 'bg-brand text-white flex min-h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-semibold'
          : 'text-ink hover:bg-brand-soft hover:text-brand flex min-h-11 items-center gap-3 rounded-xl px-3 text-[15px]'
      }
    >
      <StudioIcon name={item.icon} className={active ? 'h-5 w-5' : 'text-ink-muted h-5 w-5'} />
      <span className="flex-1">{item.label}</span>
      {count > 0 ? (
        <span
          className={
            active
              ? 'rounded-full bg-white px-2 py-0.5 text-xs font-bold text-brand'
              : 'bg-accent rounded-full px-2 py-0.5 text-xs font-bold text-white'
          }
        >
          {count}
        </span>
      ) : null}
    </Link>
  )
}
