'use client'

import { type FC, useState } from 'react'

import { ButtonComponent } from '@/app/shared/components/button'
import { authClient } from '@/pkg/auth'

const OauthButtonsComponent: FC = () => {
  const [isLoading, setIsLoading] = useState(false)

  async function handleGoogleSignIn() {
    setIsLoading(true)
    // full-page redirect to Google; control returns via callbackURL — no onSuccess needed
    await authClient.signIn.social({ provider: 'google', callbackURL: '/items' })
  }

  return (
    <ButtonComponent type='button' variant='secondary' loading={isLoading} onClick={handleGoogleSignIn}>
      Continue with Google
    </ButtonComponent>
  )
}

export default OauthButtonsComponent
