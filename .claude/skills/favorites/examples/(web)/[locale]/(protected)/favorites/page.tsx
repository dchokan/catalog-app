import type { Metadata, NextPage } from 'next'
import { headers } from 'next/headers'
import { setRequestLocale } from 'next-intl/server'

import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { favoritesQueryOptions, fetchFavorites } from '@/app/entities/api/favorites'
import { FavoritesModule } from '@/app/modules/favorites'
import { getQueryClient } from '@/pkg/query'

export const metadata: Metadata = { title: 'My Favorites' }

interface IProps {
  params: Promise<{ locale: string }>
}

const Page: NextPage<Readonly<IProps>> = async (props) => {
  const { locale } = await props.params
  setRequestLocale(locale)

  const requestHeaders = await headers()
  const queryClient = getQueryClient()

  // forward the request cookie so the server-side fetch is authenticated
  await queryClient.prefetchQuery({
    ...favoritesQueryOptions(),
    queryFn: () => fetchFavorites(requestHeaders.get('cookie') ?? undefined),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FavoritesModule />
    </HydrationBoundary>
  )
}

export default Page
