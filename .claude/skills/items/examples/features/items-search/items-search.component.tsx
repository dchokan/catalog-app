'use client'

import { useSearchParams } from 'next/navigation'
import { type FC } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { ButtonComponent } from '@/app/shared/components/button'
import { InputComponent } from '@/app/shared/components/input'
import { usePathname, useRouter } from '@/pkg/locale' // locale-aware navigation

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
    if (search) params.set('search', search)
    else params.delete('search')
    params.delete('page') // a new search resets to page 1
    router.push(`${pathname}?${params.toString()}`)
  }

  // onClear: reset({ search: '' }); params.delete('search'); router.push(...)
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller name='search' control={control} render={({ field }) => <InputComponent id='search' type='search' {...field} />} />
      <ButtonComponent type='submit'>Search</ButtonComponent>
    </form>
  )
}

export default ItemsSearchComponent
