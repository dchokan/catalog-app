import { NextResponse } from 'next/server'

import { items } from '@/app/entities/models/schema.model'
import { db } from '@/pkg/db'

export async function GET() {
  try {
    const rows = await db.select({ id: items.id }).from(items)
    return NextResponse.json(rows.map((row) => row.id))
  } catch {
    return NextResponse.json({ error: 'Failed to fetch item ids' }, { status: 500 })
  }
}
