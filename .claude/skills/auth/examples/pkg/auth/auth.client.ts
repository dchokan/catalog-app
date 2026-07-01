'use client'

import { createAuthClient } from 'better-auth/react'

import { envClient } from '@/config/env'

// the browser-side auth instance — imported by client components + the useSession hook
export const authClient = createAuthClient({
  baseURL: envClient.NEXT_PUBLIC_APP_URL,
})
