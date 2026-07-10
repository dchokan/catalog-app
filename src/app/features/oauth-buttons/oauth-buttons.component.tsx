'use client'

import { useLocale, useTranslations } from 'next-intl'
import { type FC, useState } from 'react'

import { ButtonComponent } from '@/app/shared/components/button'
import { authClient } from '@/app/shared/services/auth/client'
import { getPathname } from '@/pkg/locale'

const OauthButtonsComponent: FC = () => {
  const t = useTranslations('auth')
  const locale = useLocale()
  const [isLoading, setIsLoading] = useState(false)

  async function handleGoogleSignIn() {
    setIsLoading(true)
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: getPathname({ href: '/items', locale }),
    })
  }

  return (
    <ButtonComponent
      type='button'
      variant='secondary'
      className='w-full'
      loading={isLoading}
      onClick={handleGoogleSignIn}
    >
      {t('google')}
    </ButtonComponent>
  )
}

export default OauthButtonsComponent
