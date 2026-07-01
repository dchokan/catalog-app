import dotenv from 'dotenv'
import type { Config } from 'drizzle-kit'

// standalone CLI — loads .env.local and reads process.env directly (outside the @/config/env gate)
dotenv.config({ path: '.env.local' })

export default {
  schema: './src/app/shared/services/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
} satisfies Config
