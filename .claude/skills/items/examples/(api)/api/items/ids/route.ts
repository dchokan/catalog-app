import { NextResponse } from 'next/server'

import { db, items } from '@/app/shared/services/db'

// GET /api/items/ids — flat id list for generateStaticParams
export async function GET() {
  try {
    const rows = await db.select({ id: items.id }).from(items)
    return NextResponse.json(rows.map((row) => row.id))
  } catch {
    return NextResponse.json({ error: 'Failed to fetch item ids' }, { status: 500 })
  }
}
