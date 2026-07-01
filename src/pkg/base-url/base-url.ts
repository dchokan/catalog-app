import { envClient } from '@/config/env'

export const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') return ''
<<<<<<< HEAD
=======
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
>>>>>>> d3054faddd259ab894949e7ada1a8f29a8e74a5a
  return envClient.NEXT_PUBLIC_APP_URL
}
