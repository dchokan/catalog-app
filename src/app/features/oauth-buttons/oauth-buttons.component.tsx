'use client'

import { useLocale, useTranslations } from 'next-intl'
import { type FC, useState } from 'react'

import { authClient } from '@/pkg/auth/client'
import { getPathname } from '@/pkg/locale'
import { Button } from '@/pkg/theme/ui/button'
import { Spinner } from '@/pkg/theme/ui/spinner'

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
    <Button type='button' variant='secondary' className='w-full' disabled={isLoading} onClick={handleGoogleSignIn}>
      {isLoading && <Spinner />}
      {t('google')}
    </Button>
  )
}

export default OauthButtonsComponent
