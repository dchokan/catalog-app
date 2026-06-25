'use client'

import { useState, FC } from 'react'
import { authClient } from '@/pkg/auth'
import { ButtonComponent } from '@/app/shared/components/button'

const OauthButtonsComponent: FC = () => {
  const [isLoading, setIsLoading] = useState(false)

  async function handleGoogleSignIn() {
    setIsLoading(true)
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/items',
    })
  }

  return (
    <ButtonComponent type='button' variant='secondary' className='w-full' loading={isLoading} onClick={handleGoogleSignIn}>
      Continue with Google
    </ButtonComponent>
  )
}

export default OauthButtonsComponent
