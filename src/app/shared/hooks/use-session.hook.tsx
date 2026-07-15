'use client'

import { authClient } from '@/pkg/auth/client'

export function useSession() {
  return authClient.useSession()
}
