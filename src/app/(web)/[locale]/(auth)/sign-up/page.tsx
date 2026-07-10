import type { Metadata, NextPage } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { AuthRegisterModule } from '@/app/modules/auth-register'

interface IProps {
  params: Promise<{ locale: string }>
}

export const generateMetadata = async (props: Readonly<IProps>): Promise<Metadata> => {
  const { locale } = await props.params
  const t = await getTranslations({ locale, namespace: 'auth' })

  return {
    title: t('register.metaTitle'),
  }
}

const Page: NextPage<Readonly<IProps>> = async (props) => {
  const { params } = props
  const { locale } = await params

  setRequestLocale(locale)

  return <AuthRegisterModule />
}

export default Page
