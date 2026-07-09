'use client'

import { useTranslations } from 'next-intl'
import { type FC } from 'react'

import { useFavoritesQuery, useRemoveFavoriteMutation } from '@/app/entities/api/favorites'
import { ButtonComponent } from '@/app/shared/components/button'
import { ItemCardComponent } from '@/app/shared/components/item-card'
import { useToast } from '@/app/shared/components/toast'
import { Link } from '@/pkg/locale'

const FavoritesModule: FC = () => {
  const t = useTranslations('favorites')
  const tButton = useTranslations('favoriteButton')
  const { showToast } = useToast()
  const { data: favorites = [], isLoading, error } = useFavoritesQuery()
  const removeFavorite = useRemoveFavoriteMutation()

  if (isLoading) {
    return (
      <div className='grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='h-64 animate-pulse rounded-xl bg-gray-100' />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className='py-12 text-center'>
        <p className='text-red-600'>{t('loadError')}</p>
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className='py-16 text-center'>
        <p className='mb-4 text-lg text-gray-600'>{t('empty')}</p>
        <Link href='/items'>
          <ButtonComponent>{t('browse')}</ButtonComponent>
        </Link>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4'>
      {favorites.map((favorite) => (
        <ItemCardComponent
          key={favorite.id}
          href={`/items/${favorite.itemId}`}
          title={favorite.item?.title ?? t('unknownBook')}
          imageUrl={favorite.item?.imageUrl}
          placeholder='📖'
          footer={
            <ButtonComponent
              variant='ghost'
              size='sm'
              loading={removeFavorite.isPending}
              onClick={() =>
                removeFavorite.mutate(favorite.itemId, {
                  onSuccess: () => showToast(tButton('removed'), 'info'),
                })
              }
              className='w-full text-red-500 hover:bg-red-50 hover:text-red-700'
            >
              {t('remove')}
            </ButtonComponent>
          }
        />
      ))}
    </div>
  )
}

export default FavoritesModule
