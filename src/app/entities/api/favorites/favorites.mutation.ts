'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { EFavoriteKey, EItemKey, type IFavorite } from '@/app/entities/models'

import { addFavorite, removeFavorite } from './favorites.api'

export function useAddFavoriteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId: string) => addFavorite(itemId),

    onMutate: async (itemId: string) => {
      await queryClient.cancelQueries({ queryKey: [EFavoriteKey.QUERY] })
      const previousFavorites = queryClient.getQueryData<IFavorite[]>([EFavoriteKey.QUERY])
      queryClient.setQueryData<IFavorite[]>([EFavoriteKey.QUERY], (old = []) => [
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

export function useRemoveFavoriteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId: string) => removeFavorite(itemId),

    onMutate: async (itemId: string) => {
      await queryClient.cancelQueries({ queryKey: [EFavoriteKey.QUERY] })
      const previousFavorites = queryClient.getQueryData<IFavorite[]>([EFavoriteKey.QUERY])
      queryClient.setQueryData<IFavorite[]>([EFavoriteKey.QUERY], (old = []) =>
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
