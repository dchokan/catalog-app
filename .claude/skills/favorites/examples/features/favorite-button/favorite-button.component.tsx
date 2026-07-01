'use client'

import { type FC } from 'react'

import { useAddFavoriteMutation, useFavoritesQuery, useRemoveFavoriteMutation } from '@/app/entities/api/favorites'
import { ButtonComponent } from '@/app/shared/components/button'
import { useSession } from '@/app/shared/hooks'
import { useRouter } from '@/pkg/locale'

interface IProps {
  itemId: string
}

const FavoriteButtonComponent: FC<Readonly<IProps>> = (props) => {
  const { itemId } = props

  const router = useRouter() // locale-aware
  const { data: session } = useSession()
  const { data: favorites = [] } = useFavoritesQuery()
  const addFavorite = useAddFavoriteMutation()
  const removeFavorite = useRemoveFavoriteMutation()

  const isFavorited = favorites.some((fav) => fav.itemId === itemId)

  function handleToggle() {
    if (!session?.user) return router.push('/login') // unauthenticated → login, don't throw
    if (isFavorited) removeFavorite.mutate(itemId)
    else addFavorite.mutate(itemId)
  }

  return (
    <ButtonComponent loading={addFavorite.isPending || removeFavorite.isPending} onClick={handleToggle}>
      {isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    </ButtonComponent>
  )
}

export default FavoriteButtonComponent
