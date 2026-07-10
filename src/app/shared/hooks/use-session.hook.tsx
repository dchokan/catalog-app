'use client'

import { authClient } from '@/app/shared/services/auth/client'

export function useSession() {
  return authClient.useSession()
}
