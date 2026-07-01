import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { items } from './schema'

config({ path: '.env.local' }) // load env first (standalone script, run via `tsx`)

const { envServer } = await import('@/config/env') // dynamic import AFTER dotenv

// own client — not the app `db`
const client = postgres(envServer.DATABASE_URL, { prepare: false })
const db = drizzle(client)

const booksData = [
  { title: 'The Great Gatsby', description: '...', imageUrl: 'https://.../gatsby.jpg' },
  // ...more { title, description, imageUrl } (image hosts allow-listed in next.config.ts)
]

async function seed() {
  try {
    await db.delete(items) // idempotent: clear, then insert exactly booksData
    const inserted = await db.insert(items).values(booksData).returning()
    console.log(`✓ Inserted ${inserted.length} books`)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  } finally {
    await client.end()
  }
}

seed().catch((error) => {
  console.error(error)
  process.exit(1) // non-zero exit on failure
})
