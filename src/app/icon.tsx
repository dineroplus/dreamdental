import { renderAppIcon } from '../lib/appIcon'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default async function Icon() {
  const body = await renderAppIcon(32, 'favicon.png')
  return new Response(Uint8Array.from(body), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=60',
    },
  })
}
