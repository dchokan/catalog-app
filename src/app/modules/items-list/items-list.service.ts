import { db } from '@/pkg/db'
import { items } from '@/pkg/db/schema'
import { desc, ilike } from 'drizzle-orm'
import type { Item } from '@/app/entities/models'
import type { ItemsFilters } from '@/app/entities/api/items'

export async function getAllItems(filters: ItemsFilters = {}): Promise<Item[]> {
  const search = filters.search?.trim()
  const rows = await db
    .select()
    .from(items)
    .where(search ? ilike(items.title, `%${search}%`) : undefined)
    .orderBy(desc(items.createdAt))

  return rows.map((row) => ({
    ...row,
    createdAt: row.createdAt.toISOString(),
  }))
}
