import { NextResponse } from 'next/server'
import { db } from '@/app/shared/db'
import { items } from '@/app/shared/db/schema'

export async function GET() {
  try {
    const rows = await db.select({ id: items.id }).from(items)
    return NextResponse.json(rows.map((row) => row.id))
  } catch {
    return NextResponse.json({ error: 'Failed to fetch item ids' }, { status: 500 })
  }
}
