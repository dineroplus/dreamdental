'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '../../admin/actions'

const GROUPS = [
  {
    label: 'დღეს',
    items: [{ href: '/admin/bookings', label: 'ჯავშნები', badgeKey: 'bookings' as const }],
  },
  {
    label: 'საიტი',
    items: [
      { href: '/admin/singletons/home', label: 'მთავარი გვერდი' },
      { href: '/admin/singletons/settings', label: 'კლინიკის მონაცემები' },
      { href: '/admin/singletons/navigation', label: 'მენიუ' },
    ],
  },
  {
    label: 'კონტენტი',
    items: [
      { href: '/admin/doctors', label: 'ექიმები' },
      { href: '/admin/services', label: 'სერვისები' },
      { href: '/admin/gallery', label: 'გალერეა' },
      { href: '/admin/testimonials', label: 'შეფასებები' },
      { href: '/admin/cases', label: 'მდე / შემდეგ' },
    ],
  },
  {
    label: 'სხვა',
    items: [
      { href: '/admin/posts', label: 'ბლოგი' },
      { href: '/admin/pages', label: 'გვერდები' },
      { href: '/admin/singletons/theme', label: 'ფერები' },
    ],
  },
]

export function StudioNav({
  userName,
  newBookings,
}: {
  userName: string
  newBookings: number
}) {
  const pathname = usePathname()

  return (
    <aside className="border-hairline bg-surface/80 border-b backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-b-0">
      <div className="p-5">
        <Link href="/admin" className="block">
          <p className="text-brand text-xs font-semibold tracking-[0.18em] uppercase">Dream</p>
          <p className="text-ink mt-1 text-base font-semibold">კლინიკის პანელი</p>
        </Link>
        <p className="text-ink-muted mt-2 truncate text-xs">{userName}</p>
      </div>

      <nav className="space-y-5 px-3 pb-6 text-sm">
        <Link
          href="/admin"
          className={navClass(pathname === '/admin')}
        >
          მთავარი
        </Link>

        {GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-ink-muted px-3 pb-1 text-[11px] tracking-wide uppercase">{group.label}</p>
            {group.items.map((item) => (
              <Link key={item.href} href={item.href} className={navClass(pathname.startsWith(item.href))}>
                <span>{item.label}</span>
                {'badgeKey' in item && newBookings > 0 ? (
                  <span className="bg-brand ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold text-white">
                    {newBookings}
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
        ))}

        <form action={logoutAction}>
          <button type="submit" className="text-ink-muted hover:text-brand px-3 py-2 text-left">
            გასვლა
          </button>
        </form>
      </nav>
    </aside>
  )
}

function navClass(active: boolean) {
  return active
    ? 'bg-brand-soft text-brand mb-0.5 flex items-center rounded-xl px-3 py-2 font-medium'
    : 'hover:bg-brand-soft/60 mb-0.5 flex items-center rounded-xl px-3 py-2'
}
