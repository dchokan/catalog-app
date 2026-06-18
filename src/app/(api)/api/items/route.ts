import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/pkg/db'
import { items } from '@/pkg/db/schema'
import { desc, ilike } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get('search')?.trim()
    const allItems = await db
      .select()
      .from(items)
      .where(search ? ilike(items.title, `%${search}%`) : undefined)
      .orderBy(desc(items.createdAt))

    return NextResponse.json(allItems)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}
