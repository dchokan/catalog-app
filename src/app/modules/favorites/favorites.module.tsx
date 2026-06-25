'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FC } from 'react'
import { useFavoritesQuery, useRemoveFavorite } from '@/app/entities/api/favorites'
import { CardComponent } from '@/app/shared/components/card'
import { ButtonComponent } from '@/app/shared/components/button'

const FavoritesModule: FC = () => {
  const { data: favorites = [], isLoading, error } = useFavoritesQuery()
  const removeFavorite = useRemoveFavorite()

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='h-72 animate-pulse rounded-xl bg-gray-100' />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className='py-12 text-center'>
        <p className='text-red-600'>Failed to load favorites.</p>
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className='py-16 text-center'>
        <p className='mb-4 text-lg text-gray-600'>No favorites yet</p>
        <Link href='/items'>
          <ButtonComponent>Browse books</ButtonComponent>
        </Link>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {favorites.map((favorite) => (
        <CardComponent key={favorite.id} className='flex flex-col'>
          {favorite.item?.imageUrl && (
            <Link href={`/items/${favorite.itemId}`}>
              <div className='relative aspect-2/3 bg-gray-50'>
                <Image
                  src={favorite.item.imageUrl}
                  alt={favorite.item.title ?? ''}
                  fill
                  className='object-cover'
                  sizes='(max-width: 768px) 100vw, 33vw'
                />
              </div>
            </Link>
          )}

          <div className='flex flex-1 flex-col gap-3 p-4'>
            <Link href={`/items/${favorite.itemId}`}>
              <h3 className='line-clamp-2 font-semibold text-gray-900 transition-colors hover:text-blue-600'>
                {favorite.item?.title ?? 'Unknown book'}
              </h3>
            </Link>

            <ButtonComponent
              variant='ghost'
              size='sm'
              loading={removeFavorite.isPending}
              onClick={() => removeFavorite.mutate(favorite.itemId)}
              className='mt-auto text-red-500 hover:bg-red-50 hover:text-red-700'
            >
              Remove
            </ButtonComponent>
          </div>
        </CardComponent>
      ))}
    </div>
  )
}

export default FavoritesModule
