'use client'

import { type FC } from 'react'

import { useFavoritesQuery, useRemoveFavoriteMutation } from '@/app/entities/api/favorites'
import { ButtonComponent } from '@/app/shared/components/button'
import { Link } from '@/pkg/locale'

const FavoritesModule: FC = () => {
  const { data: favorites = [], isLoading, error } = useFavoritesQuery()
  const removeFavorite = useRemoveFavoriteMutation()

  if (isLoading) return null // skeleton grid
  if (error) return null // error state
  if (favorites.length === 0) return null // empty state + <Link href='/items'>

  // grid: each card links to `/items/${favorite.itemId}` and has an inline remove:
  //   <ButtonComponent loading={removeFavorite.isPending} onClick={() => removeFavorite.mutate(favorite.itemId)}>Remove</ButtonComponent>
  return (
    <div>
      {favorites.map((favorite) => (
        <Link key={favorite.id} href={`/items/${favorite.itemId}`}>
          {favorite.item?.title ?? 'Unknown book'}
        </Link>
      ))}
    </div>
  )
}

export default FavoritesModule
