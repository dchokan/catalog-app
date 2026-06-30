'use client'

import { useRouter } from 'next/navigation'
import { useFavoritesQuery, useAddFavoriteMutation, useRemoveFavoriteMutation } from '@/app/entities/api/favorites'
import { useSession } from '@/app/shared/hooks'
import { FC } from 'react'
import { ButtonComponent } from '@/app/shared/components/button'

interface IProps {
  itemId: string
}

const FavoriteButtonComponent: FC<Readonly<IProps>> = (props) => {
  const { itemId } = props

  const router = useRouter()
  const { data: session } = useSession()
  const isAuthenticated = !!session?.user

  const { data: favorites = [] } = useFavoritesQuery()
  const addFavorite = useAddFavoriteMutation()
  const removeFavorite = useRemoveFavoriteMutation()

  const isFavorited = favorites.some((fav) => fav.itemId === itemId)
  const isPending = addFavorite.isPending || removeFavorite.isPending

  function handleToggle() {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (isFavorited) {
      removeFavorite.mutate(itemId)
    } else {
      addFavorite.mutate(itemId)
    }
  }

  return (
    <ButtonComponent
      variant={isFavorited ? 'danger' : 'secondary'}
      size='sm'
      loading={isPending}
      onClick={handleToggle}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    </ButtonComponent>
  )
}

export default FavoriteButtonComponent
