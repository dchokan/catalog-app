import type { Metadata, NextPage } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { itemsListQueryOptions } from '@/app/entities/api/items'
import { EItemsSort } from '@/app/entities/models'
import { ItemsListModule } from '@/app/modules/items-list'
import { getQueryClient } from '@/pkg/rest-api'

interface IProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ search?: string; page?: string; sort?: EItemsSort }>
}

export const generateMetadata = async (props: Pick<IProps, 'params'>): Promise<Metadata> => {
  const { locale } = await props.params
  const t = await getTranslations({ locale, namespace: 'items' })

  return {
    title: t('title'),
  }
}

const Page: NextPage<Readonly<IProps>> = async (props) => {
  const { params, searchParams } = props
  const { locale } = await params
  const { search = '', page = '1', sort } = await searchParams

  setRequestLocale(locale)

  const t = await getTranslations('items')
  const filters = { search, page: Math.max(1, Number(page) || 1), sort }
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(itemsListQueryOptions(filters))

  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>{t('title')}</h1>
        <p className='mt-1 text-gray-500'>{t('subtitle')}</p>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <ItemsListModule />
      </HydrationBoundary>
    </div>
  )
}

export default Page
