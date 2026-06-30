import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

import { authServer } from '@/app/shared/services/auth'
import { db, favorites, items } from '@/app/shared/services/db'

export async function GET(request: NextRequest) {
  const session = await authServer.api.getSession({ headers: request.headers })

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const userFavorites = await db
      .select({
        id: favorites.id,
        userId: favorites.userId,
        itemId: favorites.itemId,
        createdAt: favorites.createdAt,
        item: {
          id: items.id,
          title: items.title,
          description: items.description,
          imageUrl: items.imageUrl,
          createdAt: items.createdAt,
        },
      })
      .from(favorites)
      .leftJoin(items, eq(favorites.itemId, items.id))
      .where(eq(favorites.userId, session.user.id))

    return NextResponse.json(userFavorites)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await authServer.api.getSession({ headers: request.headers })

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { itemId } = await request.json()

    if (!itemId) {
      return NextResponse.json({ error: 'itemId is required' }, { status: 400 })
    }

    const [favorite] = await db.insert(favorites).values({ userId: session.user.id, itemId }).returning()

    return NextResponse.json(favorite, { status: 201 })
  } catch (error) {
    const isUniqueViolation = error instanceof Error && error.message.includes('unique_user_item_idx')

    if (isUniqueViolation) {
      return NextResponse.json({ error: 'Item already in favorites' }, { status: 409 })
    }

    return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 })
  }
}
