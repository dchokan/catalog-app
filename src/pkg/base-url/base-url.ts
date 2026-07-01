import { envClient } from '@/config/env'

export const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') return ''
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return envClient.NEXT_PUBLIC_APP_URL
}
