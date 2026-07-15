import { count, eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

import { favorites, items } from '@/app/entities/models/schema.model'
import { db } from '@/pkg/db'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const [item] = await db
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

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 })
  }
}
