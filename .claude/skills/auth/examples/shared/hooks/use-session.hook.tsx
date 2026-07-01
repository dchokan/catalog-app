'use client'

import { authClient } from '@/pkg/auth'

// the client session accessor used across components
export function useSession() {
  return authClient.useSession()
}
