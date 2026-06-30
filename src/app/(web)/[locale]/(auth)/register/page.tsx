import type { Metadata, NextPage } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { AuthRegisterModule } from '@/app/modules/auth-register'

export const metadata: Metadata = {
  title: 'Create Account',
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
      <AuthRegisterModule />
    </div>
  )
}

export default Page
