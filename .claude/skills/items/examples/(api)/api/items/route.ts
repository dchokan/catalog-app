import { count, desc, eq, ilike } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

import { ITEMS_PER_PAGE } from '@/app/shared/constants'
import { db, favorites, items } from '@/app/shared/services/db'

// GET /api/items?search=&page= — search + offset pagination + derived favoritesCount
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams
  const search = sp.get('search')?.trim()
  const page = Math.max(1, Number(sp.get('page')) || 1)
  const limit = ITEMS_PER_PAGE
  const offset = (page - 1) * limit

  const where = search ? ilike(items.title, `%${search}%`) : undefined

  // rows + total in parallel; both apply the SAME `where`
  // rows: select({ ...cols, favoritesCount: count(favorites.id) })
  //   .from(items).leftJoin(favorites, eq(favorites.itemId, items.id))
  //   .where(where).groupBy(items.id).orderBy(desc(items.createdAt)).limit(limit).offset(offset)
  // total: select({ value: count() }).from(items).where(where)

  // return { data: rows, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) }
}
