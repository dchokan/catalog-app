import { and, eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

import { authServer } from '@/app/shared/services/auth'
import { db, favorites } from '@/app/shared/services/db'

// DELETE /api/favorites/:itemId — remove the current user's favorite for one item
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  const session = await authServer.api.getSession({ headers: request.headers })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { itemId } = await params

  // db.delete(favorites).where(and(eq(favorites.userId, session.user.id), eq(favorites.itemId, itemId)))
  // → { success: true } | catch 500
}
