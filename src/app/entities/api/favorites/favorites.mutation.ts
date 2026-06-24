'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addFavorite, removeFavorite } from './favorites.api'
import { EFavoriteKey, EItemKey, type Favorite } from '@/app/entities/models'

export function useAddFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId: string) => addFavorite(itemId),

    onMutate: async (itemId: string) => {
      await queryClient.cancelQueries({ queryKey: [EFavoriteKey.QUERY] })
      const previousFavorites = queryClient.getQueryData<Favorite[]>([EFavoriteKey.QUERY])
      queryClient.setQueryData<Favorite[]>([EFavoriteKey.QUERY], (old = []) => [
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
        queryClient.setQueryData([EFavoriteKey.QUERY], context.previousFavorites)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [EFavoriteKey.QUERY] })
      queryClient.invalidateQueries({ queryKey: [EItemKey.QUERY] })
    },
  })
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId: string) => removeFavorite(itemId),

    onMutate: async (itemId: string) => {
      await queryClient.cancelQueries({ queryKey: [EFavoriteKey.QUERY] })
      const previousFavorites = queryClient.getQueryData<Favorite[]>([EFavoriteKey.QUERY])
      queryClient.setQueryData<Favorite[]>([EFavoriteKey.QUERY], (old = []) =>
        old.filter((fav) => fav.itemId !== itemId),
      )

      return { previousFavorites }
    },

    onError: (_error, _itemId, context) => {
      if (context?.previousFavorites !== undefined) {
        queryClient.setQueryData([EFavoriteKey.QUERY], context.previousFavorites)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [EFavoriteKey.QUERY] })
      queryClient.invalidateQueries({ queryKey: [EItemKey.QUERY] })
    },
  })
}
