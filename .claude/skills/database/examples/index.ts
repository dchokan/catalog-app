import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { envServer } from '@/config/env'

import * as schema from './schema' // module namespace (all tables) → drizzle query API

// prepare: false is required for the Supabase/pgbouncer transaction pooler
const client = postgres(envServer.DATABASE_URL, { prepare: false })

export const db = drizzle(client, { schema })

export * from './schema' // re-export every table + the `schema` auth-map from the barrel
