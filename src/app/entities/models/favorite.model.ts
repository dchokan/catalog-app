import type { IItem } from './item.model'

export interface IFavorite {
  id: string
  userId: string
  itemId: string
  createdAt: Date | string
  item: Omit<IItem, 'favoritesCount'> | null
}

export enum EFavoriteKey {
  QUERY = 'query-favorites',
}
