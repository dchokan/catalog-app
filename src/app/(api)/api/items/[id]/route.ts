import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/pkg/db'
import { items } from '@/pkg/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const [item] = await db.select().from(items).where(eq(items.id, id)).limit(1)

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 })
  }
}
