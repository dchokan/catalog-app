import type { Metadata, NextPage } from 'next'
import { headers } from 'next/headers'
import { setRequestLocale } from 'next-intl/server'

import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { favoritesQueryOptions, fetchFavorites } from '@/app/entities/api/favorites'
import { FavoritesModule } from '@/app/modules/favorites'
import { getQueryClient } from '@/pkg/query'

export const metadata: Metadata = {
  title: 'My Favorites',
}

interface IProps {
  params: Promise<{ locale: string }>
}

const Page: NextPage<Readonly<IProps>> = async (props) => {
  const { params } = props
  const { locale } = await params

  setRequestLocale(locale)

  const requestHeaders = await headers()

  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    ...favoritesQueryOptions(),
    queryFn: () => fetchFavorites(requestHeaders.get('cookie') ?? undefined),
  })

  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>My Favorites</h1>
        <p className='mt-1 text-gray-500'>Books you have saved</p>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <FavoritesModule />
      </HydrationBoundary>
    </div>
  )
}

export default Page
