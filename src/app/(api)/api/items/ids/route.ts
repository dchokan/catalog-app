import { NextResponse } from 'next/server'

import { db, items } from '@/app/shared/services/db'

export async function GET() {
  try {
    const rows = await db.select({ id: items.id }).from(items)
    return NextResponse.json(rows.map((row) => row.id))
  } catch (error) {
    console.error('Failed to fetch item ids:', error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
