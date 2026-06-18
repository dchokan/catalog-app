import { db } from '@/pkg/db'
import { items, favorites } from '@/pkg/db/schema'
import { eq, count } from 'drizzle-orm'
import type { Item } from '@/app/entities/models'

export async function getItemById(id: string): Promise<Item | null> {
  const [row] = await db
    .select({
      id: items.id,
      title: items.title,
      description: items.description,
      imageUrl: items.imageUrl,
      createdAt: items.createdAt,
      favoritesCount: count(favorites.id),
    })
    .from(items)
    .leftJoin(favorites, eq(favorites.itemId, items.id))
    .where(eq(items.id, id))
    .groupBy(items.id)
    .limit(1)

  if (!row) return null

  return {
    ...row,
    createdAt: row.createdAt.toISOString(),
  }
}

export async function getAllItemIds(): Promise<string[]> {
  const rows = await db.select({ id: items.id }).from(items)
  return rows.map((row) => row.id)
}
