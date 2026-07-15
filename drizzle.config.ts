import dotenv from 'dotenv'
import type { Config } from 'drizzle-kit'

dotenv.config({
  path: '.env.local',
})

export default {
  schema: './src/app/entities/models/schema.model.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config
