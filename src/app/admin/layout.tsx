import { Inter, Noto_Sans_Georgian } from 'next/font/google'
import '../(frontend)/globals.css'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

const georgian = Noto_Sans_Georgian({
  subsets: ['georgian'],
  variable: '--font-georgian',
  display: 'swap',
})

export const metadata = {
  title: 'კლინიკის პანელი',
  robots: { index: false, follow: false },
}

export default function StudioRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka" className={`${inter.variable} ${georgian.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
