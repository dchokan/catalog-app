import { type FC, type ReactNode } from 'react'

interface IProps {
  children: ReactNode
}

const RootLayout: FC<Readonly<IProps>> = (props) => {
  const { children } = props

  return children
}

export default RootLayout
