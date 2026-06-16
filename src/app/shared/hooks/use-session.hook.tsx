'use client'

import { authClient } from '@/pkg/auth/auth-client'

export function useSession() {
  return authClient.useSession()
}
