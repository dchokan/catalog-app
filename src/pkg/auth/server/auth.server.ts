import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

import { schema } from '@/app/entities/models/schema.model'
import { envServer } from '@/config/env'
import { db } from '@/pkg/db'

export const authServer = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  socialProviders: {
    google: {
      clientId: envServer.GOOGLE_CLIENT_ID,
      clientSecret: envServer.GOOGLE_CLIENT_SECRET,
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google'],
      requireLocalEmailVerified: false,
    },
  },

  secret: envServer.BETTER_AUTH_SECRET,
  baseURL: envServer.BETTER_AUTH_URL,
})
