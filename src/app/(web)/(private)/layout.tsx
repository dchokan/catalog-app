import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/app/shared/services/auth'
import type { FC, ReactNode } from 'react'

interface IProps {
  children: ReactNode
}

const PrivateLayout: FC<Readonly<IProps>> = async (props) => {
  const { children } = props

  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect('/login')
  }

  return <>{children}</>
}

export default PrivateLayout
