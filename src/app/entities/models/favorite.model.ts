import type { Item } from './item.model'

export interface Favorite {
  id: string
  userId: string
  itemId: string
  createdAt: Date | string
  item: Item | null
}
