import { db } from '@/pkg/db'
import { items, favorites } from '@/pkg/db/schema'
import { desc, ilike, count, eq } from 'drizzle-orm'
import type { Item } from '@/app/entities/models'
import type { PaginatedResponse } from '@/app/shared/interfaces'
import { ITEMS_PER_PAGE, type ItemsFilters } from '@/app/entities/api/items'

export async function getAllItems(filters: ItemsFilters = {}): Promise<PaginatedResponse<Item>> {
  const search = filters.search?.trim()
  const page = Math.max(1, filters.page ?? 1)
  const limit = ITEMS_PER_PAGE
  const offset = (page - 1) * limit

  const where = search ? ilike(items.title, `%${search}%`) : undefined

  const [rows, [{ value: total }]] = await Promise.all([
    db
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
      .where(where)
      .groupBy(items.id)
      .orderBy(desc(items.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ value: count() }).from(items).where(where),
  ])

  return {
    data: rows.map((row) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
    })),
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  }
}
