import { envClient } from '@/config/env'

export const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') return ''
  return envClient.NEXT_PUBLIC_APP_URL
}
