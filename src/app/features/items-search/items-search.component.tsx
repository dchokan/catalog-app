'use client'

import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { type FC } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { ButtonComponent } from '@/app/shared/components/button'
import { InputComponent } from '@/app/shared/components/input'
import { usePathname, useRouter } from '@/pkg/locale'

type ItemsSearchValues = { search: string }

const ItemsSearchComponent: FC = () => {
  const t = useTranslations('items')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { control, handleSubmit, reset } = useForm<ItemsSearchValues>({
    defaultValues: { search: searchParams.get('search') ?? '' },
  })

  function onSubmit(data: ItemsSearchValues) {
    const params = new URLSearchParams(searchParams.toString())
    const search = data.search.trim()

    if (search) {
      params.set('search', search)
    } else {
      params.delete('search')
    }

    params.delete('page')

    router.push(`${pathname}?${params.toString()}`)
  }

  function onClear() {
    reset({ search: '' })
    const params = new URLSearchParams(searchParams.toString())
    params.delete('search')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='mb-6 flex items-end gap-3'>
      <div className='flex-1'>
        <Controller
          name='search'
          control={control}
          render={({ field }) => (
            <InputComponent
              id='search'
              type='search'
              label={t('search.label')}
              placeholder={t('search.placeholder')}
              {...field}
            />
          )}
        />
      </div>
      <ButtonComponent type='submit'>{t('search.submit')}</ButtonComponent>
      <ButtonComponent type='button' variant='secondary' onClick={onClear}>
        {t('search.clear')}
      </ButtonComponent>
    </form>
  )
}

export default ItemsSearchComponent
