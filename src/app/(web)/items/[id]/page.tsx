import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getQueryClient } from '@/pkg/query'
import { getItemById, getAllItemIds } from '@/app/modules/item-detail'
import { itemDetailQueryOptions } from '@/app/entities/api/items'
import { ItemDetailModule } from '@/app/modules/item-detail'
import { Button } from '@/app/shared/components/button'
import type { Metadata } from 'next'

interface ItemPageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const ids = await getAllItemIds()
  return ids.map((id) => ({ id }))
}

export async function generateMetadata({ params }: ItemPageProps): Promise<Metadata> {
  const { id } = await params
  const item = await getItemById(id)

  if (!item) return { title: 'Book Not Found' }

  return {
    title: item.title,
    description: item.description ?? undefined,
  }
}

export default async function ItemDetailPage({ params }: ItemPageProps) {
  const { id } = await params
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    ...itemDetailQueryOptions(id),
    queryFn: () => getItemById(id),
  })

  const item = queryClient.getQueryData(itemDetailQueryOptions(id).queryKey)
  if (!item) {
    notFound()
  }

  return (
    <div>
      <div className='mb-6'>
        <Link href='/items'>
          <Button variant='ghost' size='sm'>
            ← Back to books
          </Button>
        </Link>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <ItemDetailModule id={id} />
      </HydrationBoundary>
    </div>
  )
}
