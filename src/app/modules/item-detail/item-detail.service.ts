import { db } from '@/pkg/db'
import { items } from '@/pkg/db/schema'
import { eq } from 'drizzle-orm'
import type { Item } from '@/app/entities/models'

export async function getItemById(id: string): Promise<Item | null> {
  const [row] = await db.select().from(items).where(eq(items.id, id)).limit(1)

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
