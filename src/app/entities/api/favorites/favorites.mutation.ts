'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addFavorite, removeFavorite } from './favorites.api'
import { EEntityKey } from '@/app/shared/interfaces'
import type { Favorite } from '@/app/entities/models'

export function useAddFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId: string) => addFavorite(itemId),

    onMutate: async (itemId: string) => {
      await queryClient.cancelQueries({ queryKey: [EEntityKey.QUERY_FAVORITES] })
      const previousFavorites = queryClient.getQueryData<Favorite[]>([EEntityKey.QUERY_FAVORITES])
      queryClient.setQueryData<Favorite[]>([EEntityKey.QUERY_FAVORITES], (old = []) => [
        ...old,
        {
          id: `optimistic-${itemId}`,
          userId: 'current',
          itemId,
          createdAt: new Date().toISOString(),
          item: null,
        },
      ])

      return { previousFavorites }
    },

    onError: (_error, _itemId, context) => {
      if (context?.previousFavorites !== undefined) {
        queryClient.setQueryData([EEntityKey.QUERY_FAVORITES], context.previousFavorites)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [EEntityKey.QUERY_FAVORITES] })
      queryClient.invalidateQueries({ queryKey: [EEntityKey.QUERY_ITEMS] })
    },
  })
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId: string) => removeFavorite(itemId),

    onMutate: async (itemId: string) => {
      await queryClient.cancelQueries({ queryKey: [EEntityKey.QUERY_FAVORITES] })
      const previousFavorites = queryClient.getQueryData<Favorite[]>([EEntityKey.QUERY_FAVORITES])
      queryClient.setQueryData<Favorite[]>([EEntityKey.QUERY_FAVORITES], (old = []) =>
        old.filter((fav) => fav.itemId !== itemId),
      )

      return { previousFavorites }
    },

    onError: (_error, _itemId, context) => {
      if (context?.previousFavorites !== undefined) {
        queryClient.setQueryData([EEntityKey.QUERY_FAVORITES], context.previousFavorites)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [EEntityKey.QUERY_FAVORITES] })
      queryClient.invalidateQueries({ queryKey: [EEntityKey.QUERY_ITEMS] })
    },
  })
}
