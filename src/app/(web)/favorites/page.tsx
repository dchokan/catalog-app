import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getQueryClient } from '@/pkg/query'
import { auth } from '@/app/shared/auth/auth'
import { getUserFavorites } from '@/app/modules/favorites'
import { favoritesQueryOptions } from '@/app/entities/api/favorites'
import { FavoritesModule } from '@/app/modules/favorites'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Favorites',
}

export default async function FavoritesPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect('/login')
  }

  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    ...favoritesQueryOptions(),
    queryFn: () => getUserFavorites(session.user.id),
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
