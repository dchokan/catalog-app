import type { FC, ReactNode } from 'react'

interface IProps {
  children: ReactNode
}

const ProtectedLayout: FC<Readonly<IProps>> = (props) => {
  const { children } = props

  return <>{children}</>
}

export default ProtectedLayout
