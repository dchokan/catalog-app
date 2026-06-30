import type { NextPage } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { redirect } from '@/pkg/locale'

interface IProps {
  params: Promise<{ locale: string }>
}

const Page: NextPage<Readonly<IProps>> = async (props) => {
  const { params } = props
  const { locale } = await params

  setRequestLocale(locale)
  redirect({ href: '/items', locale })

  return null
}

export default Page
