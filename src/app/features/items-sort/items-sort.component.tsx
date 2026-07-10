'use client'

import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { type ChangeEvent, type FC } from 'react'

import { EItemsSort } from '@/app/entities/models'
import { usePathname, useRouter } from '@/pkg/locale'

const ItemsSortComponent: FC = () => {
  const t = useTranslations('items')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const value = searchParams.get('sort') ?? EItemsSort.NEWEST

  function onChange(event: ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString())
    const sort = event.target.value

    if (sort && sort !== EItemsSort.NEWEST) {
      params.set('sort', sort)
    } else {
      params.delete('sort')
    }

    params.delete('page')

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className='flex flex-col gap-1 sm:w-48'>
      <label htmlFor='sort' className='text-foreground text-sm font-medium'>
        {t('sort.label')}
      </label>
      <select
        id='sort'
        value={value}
        onChange={onChange}
        className='border-input bg-card focus:ring-ring w-full rounded-lg border px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none'
      >
        <option value={EItemsSort.NEWEST}>{t('sort.newest')}</option>
        <option value={EItemsSort.TITLE}>{t('sort.title')}</option>
        <option value={EItemsSort.POPULARITY}>{t('sort.popularity')}</option>
      </select>
    </div>
  )
}

export default ItemsSortComponent
