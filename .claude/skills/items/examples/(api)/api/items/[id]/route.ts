import { count, eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

import { db, favorites, items } from '@/app/shared/services/db'

// GET /api/items/:id — single item + favoritesCount, 404 if missing
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // select({ ...cols, favoritesCount: count(favorites.id) })
  //   .from(items).leftJoin(favorites, eq(favorites.itemId, items.id))
  //   .where(eq(items.id, id)).groupBy(items.id).limit(1)
  // !item → 404 'Item not found' ; catch → 500
}
