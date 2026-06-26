'use client'

import { useForm, Controller } from 'react-hook-form'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { FC } from 'react'
import { ButtonComponent } from '@/app/shared/components/button'
import { InputComponent } from '@/app/shared/components/input'

type ItemsSearchValues = { search: string }

const ItemsSearchComponent: FC = () => {
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
              label='Search books'
              placeholder='Search by title…'
              {...field}
            />
          )}
        />
      </div>
      <ButtonComponent type='submit'>Search</ButtonComponent>
      <ButtonComponent type='button' variant='secondary' onClick={onClear}>
        Clear
      </ButtonComponent>
    </form>
  )
}

export default ItemsSearchComponent
