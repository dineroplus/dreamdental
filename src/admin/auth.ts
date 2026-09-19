import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { db, schema } from '../db/client'
import {
  clearSessionCookie,
  createSessionToken,
  getSessionFromCookies,
  setSessionCookie,
  type SessionUser,
} from './session'
import { verifyPassword } from './password'

export type { SessionUser }

/** Current Studio user, or null when the cookie is missing/invalid. */
export async function getSession(): Promise<SessionUser | null> {
  return getSessionFromCookies()
}

/** Redirects to login when there is no valid session. */
export async function requireUser(): Promise<SessionUser> {
  const session = await getSession()
  if (!session) redirect('/studio/login')
  return session
}

async function findUserByEmail(email: string) {
  const normalized = email.trim().toLowerCase()
  const rows = await db()
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, normalized))
    .limit(1)
  return rows[0] ?? null
}

/**
 * Verifies credentials and returns a session user without writing the cookie.
 * Server actions call `login` when they also need the redirect side-effect.
 */
export async function authenticate(email: string, password: string): Promise<SessionUser | null> {
  const user = await findUserByEmail(email)
  if (!user || !verifyPassword(password, user.passwordHash)) return null

  await db()
    .update(schema.users)
    .set({ lastLoginAt: new Date() })
    .where(eq(schema.users.id, user.id))

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  }
}

/** Sets the session cookie after a successful password check. */
export async function login(email: string, password: string): Promise<SessionUser | null> {
  const user = await authenticate(email, password)
  if (!user) return null
  const token = await createSessionToken(user)
  await setSessionCookie(token)
  return user
}

export async function logout() {
  await clearSessionCookie()
}
