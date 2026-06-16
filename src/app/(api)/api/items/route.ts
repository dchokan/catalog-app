import { NextResponse } from 'next/server'
import { db } from '@/pkg/db'
import { items } from '@/pkg/db/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
  try {
    const allItems = await db.select().from(items).orderBy(desc(items.createdAt))

    return NextResponse.json(allItems)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}
