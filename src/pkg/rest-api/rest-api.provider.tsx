'use client'

import { type FC, type ReactNode } from 'react'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { getQueryClient } from './service'

interface IProps {
  children: ReactNode
}

const RestApiProvider: FC<Readonly<IProps>> = (props) => {
  const { children } = props

  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default RestApiProvider
