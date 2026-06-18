import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/pkg/db'
import { items } from '@/pkg/db/schema'
import { desc, ilike, count } from 'drizzle-orm'
import { ITEMS_PER_PAGE } from '@/app/entities/api/items'

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams
    const search = sp.get('search')?.trim()
    const page = Math.max(1, Number(sp.get('page')) || 1)
    const limit = ITEMS_PER_PAGE
    const offset = (page - 1) * limit

    const where = search ? ilike(items.title, `%${search}%`) : undefined

    const [rows, [{ value: total }]] = await Promise.all([
      db.select().from(items).where(where).orderBy(desc(items.createdAt)).limit(limit).offset(offset),
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
