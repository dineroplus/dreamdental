import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

const KEYLEN = 64

/** Stores as `salt:hash` so verification does not need a separate column. */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, KEYLEN).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const next = scryptSync(password, salt, KEYLEN)
  const expected = Buffer.from(hash, 'hex')
  if (expected.length !== next.length) return false
  return timingSafeEqual(expected, next)
}
