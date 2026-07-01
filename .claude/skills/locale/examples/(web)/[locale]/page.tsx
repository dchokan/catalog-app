import type { NextPage } from 'next'
import { setRequestLocale } from 'next-intl/server'

interface IProps {
  params: Promise<{ locale: string }>
}

// every [locale] page: await params → setRequestLocale before rendering
const Page: NextPage<Readonly<IProps>> = async (props) => {
  const { locale } = await props.params
  setRequestLocale(locale)

  // ... render module(s); use Link/useRouter from '@/pkg/locale' for navigation
  return null
}

export default Page
