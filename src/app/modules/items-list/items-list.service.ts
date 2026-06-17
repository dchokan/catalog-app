import { db } from '@/pkg/db'
import { items } from '@/pkg/db/schema'
import { desc } from 'drizzle-orm'
import type { Item } from '@/app/entities/models'

export async function getAllItems(): Promise<Item[]> {
  const rows = await db.select().from(items).orderBy(desc(items.createdAt))

  return rows.map((row) => ({
    ...row,
    createdAt: row.createdAt.toISOString(),
  }))
}
