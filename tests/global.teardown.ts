import { config as loadEnv } from 'dotenv'
import postgres from 'postgres'

import { TEST_USER_EMAIL_PREFIX } from './support/constants'

export default async function globalTeardown(): Promise<void> {
  loadEnv({ path: '.env.local' })

  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.warn('[teardown] DATABASE_URL is not set — leaving test accounts in place')
    return
  }

  const sql = postgres(databaseUrl, { prepare: false })

  try {
    const deleted = await sql`delete from "user" where email like ${`${TEST_USER_EMAIL_PREFIX}%`} returning email`
    console.log(`[teardown] removed ${deleted.length} test account(s)`)
  } finally {
    await sql.end()
  }
}
