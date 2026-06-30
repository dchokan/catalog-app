import type { Metadata, NextPage } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { AuthLoginModule } from '@/app/modules/auth-login'

export const metadata: Metadata = {
  title: 'Sign In',
}

interface IProps {
  params: Promise<{ locale: string }>
}

const Page: NextPage<Readonly<IProps>> = async (props) => {
  const { params } = props
  const { locale } = await params

  setRequestLocale(locale)

  return (
    <div className='flex min-h-[70vh] items-center justify-center'>
      <AuthLoginModule />
    </div>
  )
}

export default Page
