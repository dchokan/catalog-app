'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { FC } from 'react'
import { ButtonComponent } from '@/app/shared/components/button'

interface IProps {
  page: number
  totalPages: number
}

const ItemsPaginationComponent: FC<Readonly<IProps>> = (props) => {
  const { page, totalPages } = props

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
      <ButtonComponent variant='secondary' size='sm' disabled={page <= 1} onClick={() => goTo(page - 1)}>
        Previous
      </ButtonComponent>
      <span className='text-sm text-gray-600'>
        Page {page} of {totalPages}
      </span>
      <ButtonComponent variant='secondary' size='sm' disabled={page >= totalPages} onClick={() => goTo(page + 1)}>
        Next
      </ButtonComponent>
    </div>
  )
}

export default ItemsPaginationComponent
