'use client'

import { useSession } from '@/app/shared/hooks'
import { useFavorites, useAddFavorite, useRemoveFavorite } from '@/app/entities/api/favorites'
import { Button } from '@/app/shared/ui/button'
import { useRouter } from 'next/navigation'

interface FavoriteButtonProps {
  itemId: string
}

export function FavoriteButton({ itemId }: FavoriteButtonProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const isAuthenticated = !!session?.user

  const { data: favorites = [] } = useFavorites()
  const addFavorite = useAddFavorite()
  const removeFavorite = useRemoveFavorite()

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
    <Button
      variant={isFavorited ? 'danger' : 'secondary'}
      size='sm'
      loading={isPending}
      onClick={handleToggle}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    </Button>
  )
}
