'use client'

import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { type FC } from 'react'

import { useFavoritesQuery, useRemoveFavoriteMutation } from '@/app/entities/api/favorites'
import { ItemsPaginationComponent } from '@/app/features/items-pagination'
import { ItemCardComponent } from '@/app/shared/components/item-card'
import { ITEMS_PER_PAGE } from '@/app/shared/constants'
import { Link } from '@/pkg/locale'
import { toastService } from '@/pkg/theme/services/toast.service'
import { Button } from '@/pkg/theme/ui/button'
import { Spinner } from '@/pkg/theme/ui/spinner'

const FavoritesModule: FC = () => {
  const t = useTranslations('favorites')
  const tButton = useTranslations('favoriteButton')
  const searchParams = useSearchParams()
  const { data: favorites = [], isLoading, error } = useFavoritesQuery()
  const removeFavorite = useRemoveFavoriteMutation()

  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const totalPages = Math.max(1, Math.ceil(favorites.length / ITEMS_PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * ITEMS_PER_PAGE
  const pageFavorites = favorites.slice(start, start + ITEMS_PER_PAGE)

  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-foreground text-3xl font-bold'>{t('title')}</h1>
        <p className='text-muted-foreground mt-1'>{t('subtitle')}</p>
      </div>

      {isLoading ? (
        <div className='grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='bg-muted h-64 animate-pulse rounded-xl' />
          ))}
        </div>
      ) : error ? (
        <div className='py-12 text-center'>
          <p className='text-destructive'>{t('loadError')}</p>
        </div>
      ) : favorites.length === 0 ? (
        <div className='py-16 text-center'>
          <p className='text-muted-foreground mb-4 text-lg'>{t('empty')}</p>
          <Link href='/items'>
            <Button>{t('browse')}</Button>
          </Link>
        </div>
      ) : (
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
                  <Button
                    variant='ghost'
                    size='sm'
                    disabled={removeFavorite.isPending}
                    onClick={() =>
                      removeFavorite.mutate(favorite.itemId, {
                        onSuccess: () => toastService.info(tButton('removed')),
                      })
                    }
                    className='text-destructive hover:bg-destructive/10 hover:text-destructive w-full'
                  >
                    {removeFavorite.isPending && <Spinner />}
                    {t('remove')}
                  </Button>
                }
              />
            ))}
          </div>

          <ItemsPaginationComponent page={safePage} totalPages={totalPages} />
        </>
      )}
    </div>
  )
}

export default FavoritesModule
