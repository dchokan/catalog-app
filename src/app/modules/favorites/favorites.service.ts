import { db } from '@/app/shared/db'
import { favorites, items } from '@/app/shared/db/schema'
import { eq } from 'drizzle-orm'
import type { Favorite } from '@/app/entities/models'

export async function getUserFavorites(userId: string): Promise<Favorite[]> {
  const rows = await db
    .select({
      id: favorites.id,
      userId: favorites.userId,
      itemId: favorites.itemId,
      createdAt: favorites.createdAt,
      item: {
        id: items.id,
        title: items.title,
        description: items.description,
        imageUrl: items.imageUrl,
        createdAt: items.createdAt,
      },
    })
    .from(favorites)
    .leftJoin(items, eq(favorites.itemId, items.id))
    .where(eq(favorites.userId, userId))

  return rows.map((row) => ({
    ...row,
    createdAt: row.createdAt.toISOString(),
    item: row.item ? { ...row.item, createdAt: row.item.createdAt.toISOString() } : null,
  }))
}
