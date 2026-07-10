import { toNextJsHandler } from 'better-auth/next-js'

import { authServer } from '@/app/shared/services/auth/server'

export const { GET, POST } = toNextJsHandler(authServer)
