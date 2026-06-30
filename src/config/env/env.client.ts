import { z } from 'zod'

import { createEnv } from '@t3-oss/env-nextjs'

export const envClient = createEnv({
  client: {
    NEXT_PUBLIC_APP_URL: z.url().default('http://localhost:3000'),
  },

  shared: {
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  },

  emptyStringAsUndefined: true,

  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NODE_ENV: process.env.NODE_ENV,
  },
})
