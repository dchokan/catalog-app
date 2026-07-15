'use client'

import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { type FC } from 'react'

import { usePathname, useRouter } from '@/pkg/locale'
import { Button } from '@/pkg/theme/ui/button'

interface IProps {
  page: number
  totalPages: number
}

const ItemsPaginationComponent: FC<Readonly<IProps>> = (props) => {
  const { page, totalPages } = props

  const t = useTranslations('items')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  function goTo(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString())
    if (nextPage <= 1) {
      params.delete('page')
    } else {
      params.set('page', String(nextPage))
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className='mt-8 flex items-center justify-center gap-4'>
      <Button variant='secondary' size='sm' disabled={page <= 1} onClick={() => goTo(page - 1)}>
        {t('pagination.previous')}
      </Button>
      <span className='text-muted-foreground text-sm'>
        {t('pagination.pageInfo', { page: String(page), totalPages: String(totalPages) })}
      </span>
      <Button variant='secondary' size='sm' disabled={page >= totalPages} onClick={() => goTo(page + 1)}>
        {t('pagination.next')}
      </Button>
    </div>
  )
}

export default ItemsPaginationComponent
