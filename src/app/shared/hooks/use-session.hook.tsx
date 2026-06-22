'use client'

import { authClient } from '@/pkg/auth'

export function useSession() {
  return authClient.useSession()
}
