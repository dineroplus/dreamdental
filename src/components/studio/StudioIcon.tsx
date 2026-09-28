const PATHS = {
  home: 'M3 11.5 12 4l9 7.5M5.5 10v9.5a.5.5 0 0 0 .5.5h4v-6h4v6h4a.5.5 0 0 0 .5-.5V10',
  calendar: 'M8 3v3M16 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0',
  list: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
  image: 'M4 5h16v14H4Zm0 11 4.5-4.5 3.5 3.5 2.5-2.5L20 17M15.5 9.5h.01',
  star: 'm12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.4l6.1-.9Z',
  compare: 'M12 4v16M4 6h5v12H4Zm11 0h5v12h-5',
  settings:
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4-3a7.4 7.4 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14.5 3h-4l-.4 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2l.4 2.6h4l.4-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z',
  menu: 'M4 7h16M4 12h16M4 17h16',
  palette:
    'M12 3a9 9 0 1 0 0 18c1 0 1.5-.8 1.5-1.5 0-1-.8-1.5-.8-2.5 0-1 .8-1.5 1.8-1.5H17a4 4 0 0 0 4-4c0-4.7-4-8.5-9-8.5ZM7.5 12h.01M9.5 7.5h.01M14.5 7.5h.01',
  file: 'M7 3h7l5 5v13H7Zm7 0v5h5M10 13h6M10 17h6',
  pen: 'M4 20h4L19 9l-4-4L4 16Zm9-13 4 4',
  external: 'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm9 2-4-4',
  logout: 'M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 16l-4-4 4-4M6 12h10',
  plus: 'M12 5v14M5 12h14',
  arrowLeft: 'M19 12H5m6-6-6 6 6 6',
  phone: 'M4 5c0-.6.4-1 1-1h3l2 5-2 1a12 12 0 0 0 6 6l1-2 5 2v3c0 .6-.4 1-1 1A16 16 0 0 1 4 5Z',
  whatsapp:
    'M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Zm-3 5.5c.3-.6.6-.6.9-.6h.6c.2 0 .4 0 .6.5l.8 1.8c.1.2 0 .4-.1.6l-.5.6c-.1.2-.2.3 0 .6a7 7 0 0 0 3.2 2.8c.3.1.4.1.6-.1l.7-.8c.2-.2.3-.2.6-.1l1.7.8c.3.1.4.2.4.4 0 .5-.2 1.1-.6 1.5-.5.5-1.4.8-2.3.6A9 9 0 0 1 8.6 12a4 4 0 0 1-.4-2.1c.1-.6.4-1 .8-1.4Z',
  close: 'M6 6l12 12M18 6 6 18',
  check: 'm5 13 4 4L19 7',
  clock: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  inbox: 'M4 13h4l1.5 3h5L16 13h4M4 13l2.5-8h11L20 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z',
} as const

export type StudioIconName = keyof typeof PATHS

export function StudioIcon({ name, className = 'h-5 w-5' }: { name: StudioIconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d={PATHS[name]} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
