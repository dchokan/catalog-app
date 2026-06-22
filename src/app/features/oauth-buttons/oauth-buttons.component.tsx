'use client'

import { useState } from 'react'
import { authClient } from '@/pkg/auth'
import { Button } from '@/app/shared/components/button'

export function GoogleAuthButton() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleGoogleSignIn() {
    setIsLoading(true)
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/items',
    })
  }

  return (
    <Button type='button' variant='secondary' className='w-full' loading={isLoading} onClick={handleGoogleSignIn}>
      Continue with Google
    </Button>
  )
}
