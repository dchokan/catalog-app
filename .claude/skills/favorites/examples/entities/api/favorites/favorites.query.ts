import { queryOptions, useQuery } from '@tanstack/react-query'

import { EFavoriteKey } from '@/app/entities/models'

import { fetchFavorites } from './favorites.api'

// server-composable (no 'use client') so the page can prefetchQuery
export const favoritesQueryOptions = () =>
  queryOptions({
    queryKey: [EFavoriteKey.QUERY],
    queryFn: () => fetchFavorites(),
  })

// query + hook live together — no separate .hook.ts
export const useFavoritesQuery = () => useQuery(favoritesQueryOptions())
