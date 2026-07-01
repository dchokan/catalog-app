import type { IItem } from './item.model'

// the join returns the item WITHOUT its derived count → Omit it
export interface IFavorite {
  id: string
  userId: string
  itemId: string
  createdAt: Date | string
  item: Omit<IItem, 'favoritesCount'> | null
}

// query key for the favorites list — never hardcode the string
export enum EFavoriteKey {
  QUERY = 'query-favorites',
}
