'use client'

import { useSearchParams } from 'next/navigation'
import { type FC } from 'react'

import { ButtonComponent } from '@/app/shared/components/button'
import { usePathname, useRouter } from '@/pkg/locale'

interface IProps {
  page: number
  totalPages: number
}

const ItemsPaginationComponent: FC<Readonly<IProps>> = (props) => {
  const { page, totalPages } = props
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null // nothing to paginate

  function goTo(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString())
    if (nextPage <= 1) params.delete('page') // page 1 = clean URL
    else params.set('page', String(nextPage))
    router.push(`${pathname}?${params.toString()}`)
  }

  // Previous (disabled at page<=1) | Page x of y | Next (disabled at page>=totalPages)
  return (
    <div>
      <ButtonComponent disabled={page <= 1} onClick={() => goTo(page - 1)}>Previous</ButtonComponent>
      <ButtonComponent disabled={page >= totalPages} onClick={() => goTo(page + 1)}>Next</ButtonComponent>
    </div>
  )
}

export default ItemsPaginationComponent
