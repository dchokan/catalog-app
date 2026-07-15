import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from '@/app/entities/models/schema.model'
import { envServer } from '@/config/env'

const client = postgres(envServer.DATABASE_URL, { prepare: false })

export const db = drizzle(client, { schema })
