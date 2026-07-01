import type { Metadata, NextPage } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { AuthLoginModule } from '@/app/modules/auth-login'

interface IProps {
  params: Promise<{ locale: string }>
}

export const generateMetadata = async (props: Readonly<IProps>): Promise<Metadata> => {
  const { locale } = await props.params
  const t = await getTranslations({ locale, namespace: 'auth' })

  return {
    title: t('login.metaTitle'),
  }
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
