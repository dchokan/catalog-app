---
name: favorites-counter
description: Add a favorites count to each item. Use when adding the favoritesCount field to the Item model, computing it via SQL aggregation in the items service, and displaying it on the item card. Requires favorites table to exist.
---

# Favorites Counter

Each item displays how many users have favorited it. The count is computed at the database level using a LEFT JOIN + COUNT aggregation. It's included in every items query — no separate API call needed.

## What Changes

| File | Change |
|---|---|
| `src/app/entities/models/item.model.ts` | Add `favoritesCount: number` field |
| `src/app/modules/items-list/items-list.service.ts` | Add LEFT JOIN + COUNT to query |
| `src/app/modules/item-detail/item-detail.service.ts` | Same join for detail view |
| `src/app/(api)/api/items/route.ts` | No change — service handles it |
| `src/app/widgets/item-card/item-card.component.tsx` | Display the count |

## `item.model.ts` — Add Field

Add to the `Item` interface:
```typescript
favoritesCount: number
```

This field is always present (0 for items with no favorites).

## `items-list.service.ts` — SQL Aggregation

The `getAllItems` query needs to compute `favoritesCount` for each item.

### Drizzle Query Pattern

Use `leftJoin` + `count` from `drizzle-orm`:

```typescript
import { count, ilike, sql } from "drizzle-orm"

const rows = await db
  .select({
    id: items.id,
    title: items.title,
    description: items.description,
    imageUrl: items.imageUrl,
    createdAt: items.createdAt,
    favoritesCount: count(favorites.id),    // COUNT of joined rows
  })
  .from(items)
  .leftJoin(favorites, eq(favorites.itemId, items.id))   // LEFT JOIN preserves items with 0 favorites
  .where(/* search condition */)
  .groupBy(items.id)                        // GROUP BY required for aggregation
  .limit(limit)
  .offset(offset)
  .orderBy(items.createdAt)
```

**Why LEFT JOIN:** An INNER JOIN would exclude items with 0 favorites. LEFT JOIN keeps all items; `COUNT(favorites.id)` returns 0 when there's no match (NULL rows from the join).

**Why GROUP BY:** SQL requires grouping when using aggregate functions. Group by `items.id` (the PK) — Drizzle may require listing all selected non-aggregate columns in `.groupBy()` for strict mode databases.

### Separate Count Query

The total count query (for pagination) should NOT use the JOIN, since you're counting items, not favorites:
```typescript
const [{ total }] = await db
  .select({ total: count() })
  .from(items)
  .where(/* same search condition */)
```

Running JOIN + COUNT in the total query would give incorrect totals.

## `item-detail.service.ts` — Single Item with Count

For a single item fetch, add the same LEFT JOIN + COUNT:

```typescript
const [item] = await db
  .select({
    id: items.id,
    title: items.title,
    description: items.description,
    imageUrl: items.imageUrl,
    createdAt: items.createdAt,
    favoritesCount: count(favorites.id),
  })
  .from(items)
  .leftJoin(favorites, eq(favorites.itemId, items.id))
  .where(eq(items.id, id))
  .groupBy(items.id)
```

## `item-card.component.tsx` — Display

Add a counter below or beside the item title:

```
♥ {item.favoritesCount}
```

Or use a heart icon + number. Keep it compact — this is secondary information.

Display `0` explicitly for items with no favorites (not hidden, not dashed).

## Hard Rules

- `favoritesCount` is computed in the DB query, never in JavaScript by loading all favorites — SQL aggregation at DB level is always more efficient
- LEFT JOIN (not INNER JOIN) — items with 0 favorites must appear in results
- `groupBy(items.id)` is required when using `count()` — omitting it causes a SQL error
- The pagination count query must NOT use the favorites join — it would return 1 row per group, not the correct paginated count
- `favoritesCount` is always a number in the model — default is 0, never null or undefined

## Verification

- Items with favorites show a count > 0 on the card
- Items with no favorites show "♥ 0"
- Adding a favorite increments the count (after React Query invalidation + refetch)
- Removing a favorite decrements the count
- Count is correct after page refresh (computed by DB, not cached in app memory)
- Search results show correct counts for filtered items
