import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getQueryClient } from '@/pkg/query'
import { getItemById, getAllItemIds } from '@/app/modules/item-detail'
import { itemDetailQueryOptions } from '@/app/entities/api/items'
import { ItemDetailModule } from '@/app/modules/item-detail'
import { ButtonComponent } from '@/app/shared/components/button'
import type { Metadata, NextPage } from 'next'

interface IProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const ids = await getAllItemIds()
  return ids.map((id) => ({ id }))
}

export async function generateMetadata(props: Readonly<IProps>): Promise<Metadata> {
  const { params } = props
  const { id } = await params
  const item = await getItemById(id)

  if (!item) return { title: 'Book Not Found' }

  return {
    title: item.title,
    description: item.description ?? undefined,
  }
}

const Page: NextPage<Readonly<IProps>> = async (props) => {
  const { params } = props
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
          <ButtonComponent variant='ghost' size='sm'>
            ← Back to books
          </ButtonComponent>
        </Link>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <ItemDetailModule id={id} />
      </HydrationBoundary>
    </div>
  )
}

export default Page
