import type { Metadata, NextPage } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { fetchItemById, fetchItemIds, itemDetailQueryOptions } from '@/app/entities/api/items'
import { ItemDetailModule } from '@/app/modules/item-detail'
import { getQueryClient } from '@/pkg/rest-api'

interface IProps {
  params: Promise<{ locale: string; id: string }>
}

export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams(): Promise<{ id: string }[]> {
  const ids = await fetchItemIds()
  return ids.map((id) => ({ id }))
}

export async function generateMetadata(props: Readonly<IProps>): Promise<Metadata> {
  const { params } = props
  const { locale, id } = await params

  try {
    const item = await fetchItemById(id)

    return {
      title: item.title,
      description: item.description ?? undefined,
    }
  } catch {
    const t = await getTranslations({ locale, namespace: 'items' })
    return { title: t('detail.metaNotFound') }
  }
}

const Page: NextPage<Readonly<IProps>> = async (props) => {
  const { params } = props
  const { locale, id } = await params

  setRequestLocale(locale)

  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(itemDetailQueryOptions(id))

  const item = queryClient.getQueryData(itemDetailQueryOptions(id).queryKey)
  if (!item) {
    notFound()
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ItemDetailModule id={id} />
    </HydrationBoundary>
  )
}

export default Page
