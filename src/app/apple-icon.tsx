import { renderAppIcon } from '../lib/appIcon'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default async function AppleIcon() {
  const body = await renderAppIcon(180, 'apple-icon.png')
  return new Response(Uint8Array.from(body), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=60',
    },
  })
}
