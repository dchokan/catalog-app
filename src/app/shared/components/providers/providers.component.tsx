'use client'

import { type FC, type ReactNode, useState } from 'react'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { envClient } from '@/config/env'
import { getQueryClient } from '@/pkg/query'

interface IProps {
  children: ReactNode
}

const ProvidersComponent: FC<Readonly<IProps>> = (props) => {
  const { children } = props

  const [queryClient] = useState(() => getQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {envClient.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}

export default ProvidersComponent
