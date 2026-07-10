'use client'

import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { type FC } from 'react'

import { useFavoritesQuery, useRemoveFavoriteMutation } from '@/app/entities/api/favorites'
import { ItemsPaginationComponent } from '@/app/features/items-pagination'
import { ButtonComponent } from '@/app/shared/components/button'
import { ItemCardComponent } from '@/app/shared/components/item-card'
import { useToast } from '@/app/shared/components/toast'
import { ITEMS_PER_PAGE } from '@/app/shared/constants'
import { Link } from '@/pkg/locale'

const FavoritesModule: FC = () => {
  const t = useTranslations('favorites')
  const tButton = useTranslations('favoriteButton')
  const { showToast } = useToast()
  const searchParams = useSearchParams()
  const { data: favorites = [], isLoading, error } = useFavoritesQuery()
  const removeFavorite = useRemoveFavoriteMutation()

  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const totalPages = Math.max(1, Math.ceil(favorites.length / ITEMS_PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * ITEMS_PER_PAGE
  const pageFavorites = favorites.slice(start, start + ITEMS_PER_PAGE)

  if (isLoading) {
    return (
      <div className='grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='bg-muted h-64 animate-pulse rounded-xl' />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className='py-12 text-center'>
        <p className='text-destructive'>{t('loadError')}</p>
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className='py-16 text-center'>
        <p className='text-muted-foreground mb-4 text-lg'>{t('empty')}</p>
        <Link href='/items'>
          <ButtonComponent>{t('browse')}</ButtonComponent>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className='grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4'>
        {pageFavorites.map((favorite) => (
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
                className='text-destructive hover:bg-destructive/10 hover:text-destructive w-full'
              >
                {t('remove')}
              </ButtonComponent>
            }
          />
        ))}
      </div>

      <ItemsPaginationComponent page={safePage} totalPages={totalPages} />
    </>
  )
}

export default FavoritesModule
