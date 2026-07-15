import { toNextJsHandler } from 'better-auth/next-js'

import { authServer } from '@/pkg/auth/server'

export const { GET, POST } = toNextJsHandler(authServer)
