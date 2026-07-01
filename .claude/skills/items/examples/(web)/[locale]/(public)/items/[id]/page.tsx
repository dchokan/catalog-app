import type { Metadata, NextPage } from 'next'
import { notFound } from 'next/navigation'

import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { fetchItemById, fetchItemIds, itemDetailQueryOptions } from '@/app/entities/api/items'
import { ItemDetailModule } from '@/app/modules/item-detail'
import { getQueryClient } from '@/pkg/query'

interface IProps {
  params: Promise<{ id: string }>
}

// pre-render every item page from the id list
export async function generateStaticParams() {
  const ids = await fetchItemIds()
  return ids.map((id) => ({ id }))
}

// per-item SEO; falls back when the item is missing
export async function generateMetadata(props: Readonly<IProps>): Promise<Metadata> {
  const { id } = await props.params
  try {
    const item = await fetchItemById(id)
    return { title: item.title, description: item.description ?? undefined }
  } catch {
    return { title: 'Book Not Found' }
  }
}

const Page: NextPage<Readonly<IProps>> = async (props) => {
  const { id } = await props.params
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(itemDetailQueryOptions(id))
  if (!queryClient.getQueryData(itemDetailQueryOptions(id).queryKey)) notFound()

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ItemDetailModule id={id} />
    </HydrationBoundary>
  )
}

export default Page
