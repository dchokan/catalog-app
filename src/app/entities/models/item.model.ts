export interface Item {
  id: string
  title: string
  description: string | null
  imageUrl: string | null
  createdAt: Date | string
  favoritesCount: number
}

export interface ItemsFilters {
  search?: string
  page?: number
}
