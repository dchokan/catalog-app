import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/pkg/db'
import { favorites } from '@/pkg/db/schema'
import { auth } from '@/pkg/auth'
import { and, eq } from 'drizzle-orm'

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  const session = await auth.api.getSession({ headers: request.headers })

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { itemId } = await params

  try {
    await db.delete(favorites).where(and(eq(favorites.userId, session.user.id), eq(favorites.itemId, itemId)))
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 })
  }
}
