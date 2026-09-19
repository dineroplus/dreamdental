/**
 * Creates (or updates) a Dream Studio user from ADMIN_EMAIL + ADMIN_PASSWORD.
 * Run with: npm run admin:create
 */
import { eq } from 'drizzle-orm'
import { db, schema } from '../src/db/client'
import { hashPassword } from '../src/admin/password'

async function main() {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD || ''
  const name = process.env.ADMIN_NAME || 'Dream Admin'

  if (!email || !email.includes('@')) {
    throw new Error('Set ADMIN_EMAIL to a valid address')
  }
  if (password.length < 8) {
    throw new Error('Set ADMIN_PASSWORD (min 8 characters)')
  }

  const passwordHash = hashPassword(password)
  const existing = await db()
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1)

  if (existing[0]) {
    await db()
      .update(schema.users)
      .set({ passwordHash, name, role: 'admin' })
      .where(eq(schema.users.id, existing[0].id))
    console.log(`Updated admin user: ${email}`)
  } else {
    await db().insert(schema.users).values({
      email,
      name,
      role: 'admin',
      passwordHash,
    })
    console.log(`Created admin user: ${email}`)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
