export interface IItem {
  id: string
  title: string
  description: string | null
  imageUrl: string | null
  createdAt: Date | string
  favoritesCount: number
}

export interface IItemsFilters {
  search?: string
  page?: number
}

export enum EItemKey {
  QUERY = 'query-items',
}
