import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

import { db, schema } from '@/app/shared/services/db' // schema = auth tables (user/session/account/verification)
import { envServer } from '@/config/env'

// the single server-side auth instance — imported by API routes + server session checks
export const authServer = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg', schema }),

  emailAndPassword: { enabled: true, minPasswordLength: 8 },

  socialProviders: {
    google: {
      clientId: envServer.GOOGLE_CLIENT_ID,
      clientSecret: envServer.GOOGLE_CLIENT_SECRET,
    },
  },

  account: {
    accountLinking: { enabled: true, trustedProviders: ['google'], requireLocalEmailVerified: false },
  },

  secret: envServer.BETTER_AUTH_SECRET,
  baseURL: envServer.BETTER_AUTH_URL,
})
