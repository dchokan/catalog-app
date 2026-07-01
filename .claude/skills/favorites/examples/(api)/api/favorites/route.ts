import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

import { authServer } from '@/app/shared/services/auth'
import { db, favorites, items } from '@/app/shared/services/db'

// GET /api/favorites — current user's favorites, item left-joined (no favoritesCount)
export async function GET(request: NextRequest) {
  const session = await authServer.api.getSession({ headers: request.headers })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // db.select({ id, userId, itemId, createdAt, item: { id, title, description, imageUrl, createdAt } })
  //   .from(favorites)
  //   .leftJoin(items, eq(favorites.itemId, items.id))
  //   .where(eq(favorites.userId, session.user.id))
  // catch → 500 'Failed to fetch favorites'
}

// POST /api/favorites { itemId } — insert; unique_user_item_idx violation → 409
export async function POST(request: NextRequest) {
  const session = await authServer.api.getSession({ headers: request.headers })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // const { itemId } = await request.json(); !itemId → 400
  // try: db.insert(favorites).values({ userId: session.user.id, itemId }).returning() → 201
  // catch: error.message.includes('unique_user_item_idx') → 409, else 500
}
