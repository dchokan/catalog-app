import type { Metadata, NextPage } from 'next'

import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { itemsListQueryOptions } from '@/app/entities/api/items'
import { ItemsListModule } from '@/app/modules/items-list'
import { getQueryClient } from '@/pkg/query'

export const metadata: Metadata = { title: 'Browse Books' }

interface IProps {
  searchParams: Promise<{ search?: string; page?: string }>
}

// reads searchParams (→ dynamic render), prefetches the exact filtered query, hydrates the module
const Page: NextPage<Readonly<IProps>> = async (props) => {
  const { search = '', page = '1' } = await props.searchParams
  const filters = { search, page: Math.max(1, Number(page) || 1) }

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(itemsListQueryOptions(filters))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ItemsListModule />
    </HydrationBoundary>
  )
}

export default Page
