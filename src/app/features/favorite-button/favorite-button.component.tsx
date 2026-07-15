'use client'

import { useTranslations } from 'next-intl'
import { type FC } from 'react'

import { useAddFavoriteMutation, useFavoritesQuery, useRemoveFavoriteMutation } from '@/app/entities/api/favorites'
import { useSession } from '@/app/shared/hooks'
import { useRouter } from '@/pkg/locale'
import { toastService } from '@/pkg/theme/services/toast.service'
import { Button } from '@/pkg/theme/ui/button'
import { Spinner } from '@/pkg/theme/ui/spinner'

interface IProps {
  itemId: string
}

const FavoriteButtonComponent: FC<Readonly<IProps>> = (props) => {
  const { itemId } = props

  const t = useTranslations('favoriteButton')
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
      router.push('/sign-in')
      return
    }

    if (isFavorited) {
      removeFavorite.mutate(itemId, {
        onSuccess: () => toastService.info(t('removed')),
      })
    } else {
      addFavorite.mutate(itemId, {
        onSuccess: () => toastService.success(t('added')),
      })
    }
  }

  return (
    <Button
      variant={isFavorited ? 'destructive' : 'secondary'}
      size='sm'
      disabled={isPending}
      onClick={handleToggle}
      aria-label={isFavorited ? t('remove') : t('add')}
    >
      {isPending && <Spinner />}
      {isFavorited ? t('remove') : t('add')}
    </Button>
  )
}

export default FavoriteButtonComponent
