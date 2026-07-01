import { toNextJsHandler } from 'better-auth/next-js'

import { authServer } from '@/app/shared/services/auth'

// the ONLY auth HTTP surface — serves every better-auth endpoint (login, logout, session, oauth callback, ...)
export const { GET, POST } = toNextJsHandler(authServer)
