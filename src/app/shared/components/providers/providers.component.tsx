'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, FC, ReactNode } from 'react'
import { getQueryClient } from '@/pkg/query'
import { envClient } from '@/config/env'

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
