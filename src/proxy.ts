import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

/**
 * Next 16 renamed `middleware` → `proxy`. Guards `/admin` so only signed-in
 * clinic staff can reach Dream Studio.
 */
const COOKIE = 'dream_session'

function secretKey() {
  const secret =
    process.env.ADMIN_SESSION_SECRET ||
    (process.env.NODE_ENV !== 'production' ? 'dev-only-insecure-secret-change-me' : undefined)
  if (!secret) return null
  return new TextEncoder().encode(secret)
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!pathname.startsWith('/admin')) return NextResponse.next()
  if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
    return NextResponse.next()
  }

  const token = request.cookies.get(COOKIE)?.value
  const key = secretKey()
  if (!token || !key) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  try {
    await jwtVerify(token, key)
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
