import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { envServer } from '@/config/env'

import * as schema from './schema'

const client = postgres(envServer.DATABASE_URL, { prepare: false })

export const db = drizzle(client, { schema })

export * from './schema'
