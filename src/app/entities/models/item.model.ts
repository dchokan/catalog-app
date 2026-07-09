export interface IItem {
  id: string
  title: string
  description: string | null
  imageUrl: string | null
  createdAt: Date | string
  favoritesCount: number
}

export enum EItemsSort {
  NEWEST = 'newest',
  TITLE = 'title',
  POPULARITY = 'popularity',
}

export interface IItemsFilters {
  search?: string
  page?: number
  sort?: EItemsSort
}

export enum EItemKey {
  QUERY = 'query-items',
}
