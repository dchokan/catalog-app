'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Button } from '@/app/shared/ui/button'

interface ItemsPaginationProps {
  page: number
  totalPages: number
}

export function ItemsPagination({ page, totalPages }: ItemsPaginationProps) {
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
        Previous
      </Button>
      <span className='text-sm text-gray-600'>
        Page {page} of {totalPages}
      </span>
      <Button variant='secondary' size='sm' disabled={page >= totalPages} onClick={() => goTo(page + 1)}>
        Next
      </Button>
    </div>
  )
}
