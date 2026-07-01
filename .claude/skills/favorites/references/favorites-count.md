# favoritesCount — derived, never stored

`favoritesCount` is **not a column**. The `items` table has no count field; the number is computed on read by aggregating the `favorites` junction. This keeps the count authoritative (it can never drift from the actual rows) at the cost of a join + group-by on every items read.

## Where it is computed

The aggregation lives in the **items** API routes, not in the favorites layer:

- `(api)/api/items/route.ts` (list)
- `(api)/api/items/[id]/route.ts` (detail)

Both use the same shape:

```
db.select({
  id: items.id,
  title: items.title,
  description: items.description,
  imageUrl: items.imageUrl,
  createdAt: items.createdAt,
  favoritesCount: count(favorites.id),   // 0 when no rows, thanks to the left join
})
  .from(items)
  .leftJoin(favorites, eq(favorites.itemId, items.id))
  .groupBy(items.id)
```

`leftJoin` (not inner) so items with zero favorites still return a row with `count = 0`. `count(favorites.id)` counts non-null joined rows, so an unfavorited item yields `0`. `groupBy(items.id)` collapses the joined rows back to one per item. The list route runs this alongside a `count()` total for pagination in a single `Promise.all`.

## The typing split

- `IItem` (in `entities/models/item.model.ts`) carries `favoritesCount: number` — every item the API returns has it.
- `IFavorite.item` is typed `Omit<IItem, 'favoritesCount'> | null` — the favorites GET join selects the item's plain columns but **not** its count, so the favorites payload must not claim to carry one. The `Omit` makes that explicit and prevents code from reading a count that isn't there.

## Keeping it fresh

Because the count is derived from `favorites`, any add/remove changes it. The favorites mutations therefore invalidate `EItemKey.QUERY` (in addition to `EFavoriteKey.QUERY`) on settle, forcing the items queries to refetch and recompute. Without that second invalidation the count on item cards and the detail page stays stale until an unrelated refetch.

## Where it is shown

- `modules/items-list` renders it per card via a `favoritesLabel(count)` helper ("1 user added this to favorites" / "N users added this to favorites").
- `modules/item-detail` renders the same singular/plural label on the detail page.

The label's singular/plural branch lives with the presentation (the module), not in the data layer.
