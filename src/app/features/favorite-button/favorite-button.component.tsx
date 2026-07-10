'use client'

import { useTranslations } from 'next-intl'
import { type FC } from 'react'

import { useAddFavoriteMutation, useFavoritesQuery, useRemoveFavoriteMutation } from '@/app/entities/api/favorites'
import { ButtonComponent } from '@/app/shared/components/button'
import { useToast } from '@/app/shared/components/toast'
import { useSession } from '@/app/shared/hooks'
import { useRouter } from '@/pkg/locale'

interface IProps {
  itemId: string
}

const FavoriteButtonComponent: FC<Readonly<IProps>> = (props) => {
  const { itemId } = props

  const t = useTranslations('favoriteButton')
  const router = useRouter()
  const { showToast } = useToast()
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
        onSuccess: () => showToast(t('removed'), 'info'),
      })
    } else {
      addFavorite.mutate(itemId, {
        onSuccess: () => showToast(t('added'), 'success'),
      })
    }
  }

  return (
    <ButtonComponent
      variant={isFavorited ? 'danger' : 'secondary'}
      size='sm'
      loading={isPending}
      onClick={handleToggle}
      aria-label={isFavorited ? t('remove') : t('add')}
    >
      {isFavorited ? t('remove') : t('add')}
    </ButtonComponent>
  )
}

export default FavoriteButtonComponent
