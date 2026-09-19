import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

/**
 * Cookie-backed JWT session for Dream Studio. Kept separate from Payload's
 * `/admin` auth so the two can coexist until Payload is removed.
 */
export const SESSION_COOKIE = 'dream_session'

export type SessionUser = {
  id: number
  email: string
  name: string | null
  role: 'admin' | 'editor'
}

function secretKey() {
  // Prefer ADMIN_SESSION_SECRET; PAYLOAD_SECRET is a temporary bridge while both
  // admins share an env file. The hard-coded fallback is only for local boots.
  const secret =
    process.env.ADMIN_SESSION_SECRET ||
    process.env.PAYLOAD_SECRET ||
    (process.env.NODE_ENV !== 'production' ? 'dev-only-insecure-secret-change-me' : undefined)

  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET is not set')
  }
  return new TextEncoder().encode(secret)
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime('14d')
    .sign(secretKey())
}

export async function readSessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey())
    const id = Number(payload.sub)
    if (!Number.isFinite(id)) return null
    return {
      id,
      email: String(payload.email ?? ''),
      name: typeof payload.name === 'string' ? payload.name : null,
      role: payload.role === 'admin' ? 'admin' : 'editor',
    }
  } catch {
    return null
  }
}

export async function setSessionCookie(token: string) {
  const jar = await cookies()
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 14,
  })
}

export async function clearSessionCookie() {
  const jar = await cookies()
  jar.delete(SESSION_COOKIE)
}

export async function getSessionFromCookies(): Promise<SessionUser | null> {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE)?.value
  if (!token) return null
  return readSessionToken(token)
}
