import { count, desc, eq, ilike } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

import { ITEMS_PER_PAGE } from '@/app/shared/constants'
import { db, favorites, items } from '@/app/shared/services/db'

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams
    const search = sp.get('search')?.trim()
    const page = Math.max(1, Number(sp.get('page')) || 1)
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

    return NextResponse.json({
      data: rows,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}
