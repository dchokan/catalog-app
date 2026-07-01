# Database checks per action

Run the block matching what you changed, plus `invariants.spec.md`.

## +table — adding/changing a table

- **MUST** define it in `schema.ts` with the right naming (singular DB name for auth, plural for domain) and PK type (`uuid().defaultRandom()` for domain).
- **MUST** add FKs with `.references(() => other.id, { onDelete: ... })` and uniqueness via `uniqueIndex(...)` where needed.
- **MUST** decide adapter exposure: add it to the `schema` auth-map ONLY if it's a better-auth table; domain tables stay out of that map (but are still re-exported by the barrel).
- **MUST** generate a migration (`db:generate`) after the change.

## +migration — running/authoring migrations

- **MUST** use the scripts: `db:generate` to capture, `db:push` for dev sync, `db:migrate` to apply, `db:studio` to inspect.
- **MUST** ensure `.env.local` has `DATABASE_URL` (drizzle.config reads it via dotenv).
- **MUST NOT** edit generated SQL/meta in `drizzle/` by hand.

## +seed — seed data / script

- **MUST** keep the script standalone: load `.env.local`, dynamic-import `@/config/env`, open its own client, `client.end()` in `finally`.
- **MUST** stay idempotent (`delete(items)` before insert) and items-only.
- **MUST** allow-list any new image host in `next.config.ts` `images.remotePatterns`.
- **MUST** run via `db:seed` (`tsx .../seed.ts`).
