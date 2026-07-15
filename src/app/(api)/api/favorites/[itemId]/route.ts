import { and, eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

import { favorites } from '@/app/entities/models/schema.model'
import { authServer } from '@/pkg/auth/server'
import { db } from '@/pkg/db'

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  const session = await authServer.api.getSession({ headers: request.headers })

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
