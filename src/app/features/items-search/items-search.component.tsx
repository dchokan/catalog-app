'use client'

import { useForm } from 'react-hook-form'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Button } from '@/app/shared/ui/button'
import { Input } from '@/app/shared/ui/input'
import type { ItemsSearchValues } from './items-search.interface'

export function ItemsSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { register, handleSubmit, reset } = useForm<ItemsSearchValues>({
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
        <Input id='search' type='search' label='Search books' placeholder='Search by title…' {...register('search')} />
      </div>
      <Button type='submit'>Search</Button>
      <Button type='button' variant='secondary' onClick={onClear}>
        Clear
      </Button>
    </form>
  )
}
