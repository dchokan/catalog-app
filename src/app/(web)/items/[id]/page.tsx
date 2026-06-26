import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getQueryClient } from '@/pkg/query'
import { fetchItemById, fetchItemIds, itemDetailQueryOptions } from '@/app/entities/api/items'
import { ItemDetailModule } from '@/app/modules/item-detail'
import { ButtonComponent } from '@/app/shared/components/button'
import type { Metadata, NextPage } from 'next'

interface IProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const ids = await fetchItemIds()
  return ids.map((id) => ({ id }))
}

export async function generateMetadata(props: Readonly<IProps>): Promise<Metadata> {
  const { params } = props
  const { id } = await params

  try {
    const item = await fetchItemById(id)

    return {
      title: item.title,
      description: item.description ?? undefined,
    }
  } catch {
    return { title: 'Book Not Found' }
  }
}

const Page: NextPage<Readonly<IProps>> = async (props) => {
  const { params } = props
  const { id } = await params
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(itemDetailQueryOptions(id))

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
