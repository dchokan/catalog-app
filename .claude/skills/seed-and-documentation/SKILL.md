---
name: seed-and-documentation
description: Write a database seed script and project README. Use when creating sample data for development, setting up the db:seed npm script, or documenting the project setup process for new developers.
---

# Seed and Documentation

The seed script inserts realistic sample items (books) into the database for development and demos. It uses Drizzle's insert API with `onConflictDoNothing` to be idempotent.

## File Layout

```
src/pkg/db/
└── seed.ts          # Seed script — run with: npm run db:seed

README.md            # Project setup documentation
```

## `src/pkg/db/seed.ts`

### Structure

1. **Load env** — import `dotenv/config` at the top (before any other imports) to load `.env`
2. **Import db** — import the drizzle client from `@/pkg/db`
3. **Import schema** — import the target table (e.g., `items`)
4. **Check idempotency** — query for existing rows; if any exist, log and exit early (see Idempotency section)
5. **Define seed data** — an array of objects matching the table columns
6. **Insert** — `db.insert(items).values(seedData)`
7. **Log and exit** — `console.log("Seeded X items")` then `process.exit(0)`

### Running env loading in tsx

`dotenv/config` side-effect import reads `.env` into `process.env`. This is needed because `tsx` doesn't use Next.js's env loading.

### Sample Data

Include 10-15 representative items. Each object must include every `NOT NULL` column in the target table (e.g., `title`, `description`, `imageUrl` for an items table).

For `imageUrl`, use stable public CDN URLs (e.g., Open Library: `https://covers.openlibrary.org/b/id/<id>-L.jpg`, or any public image host). Verify the URLs resolve before committing.

Write a 1-2 sentence description per item — realistic enough to demo the app but not precious; seed data gets replaced.

### npm Script

```json
"db:seed": "npx tsx src/pkg/db/seed.ts"
```

`tsx` handles TypeScript execution without compilation. The `npx` prefix ensures it uses the local install.

### Idempotency

Because items use random UUIDs, `onConflictDoNothing` does not prevent duplicate rows. Use an existence check instead:

```typescript
const existing = await db.select().from(items).limit(1)
if (existing.length > 0) {
  console.log("Already seeded, skipping")
  process.exit(0)
}
```

Place this check before the insert (step 4 in the structure above). This makes the script safe to run multiple times.

## README.md

The README should document:

### Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase recommended)
- Google Cloud Console project (for OAuth)

### Setup Steps
1. Clone repository
2. `npm install`
3. Copy `.env.example` to `.env` and fill in values
4. `npm run db:push` (sync schema to DB)
5. `npm run db:seed` (insert sample books)
6. `npm run dev`

### Environment Variables

Document each variable:
- `DATABASE_URL` — PostgreSQL connection string (Supabase port 6543)
- `BETTER_AUTH_SECRET` — Random 32+ char string (`openssl rand -hex 32`)
- `BETTER_AUTH_URL` — App URL (http://localhost:3000 for dev)
- `NEXT_PUBLIC_APP_URL` — Same as above (exposed to browser)
- `GOOGLE_CLIENT_ID` — From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` — From Google Cloud Console

### Google OAuth Setup
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Authorized JavaScript origins: `http://localhost:3000`
4. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
5. Copy Client ID and Secret to `.env`

### Database Scripts
Document all `db:*` scripts with one-line descriptions.

## Hard Rules

- Seed script MUST import `dotenv/config` as the first import — env is not loaded otherwise
- `process.exit(0)` is required at the end — otherwise the DB connection pool keeps the process alive
- Seed data uses stable public image URLs so images render in dev without needing uploads
- The idempotency existence check (not `onConflictDoNothing`) prevents duplicate rows because items use random UUIDs

## Verification

- `npm run db:seed` completes with "Seeded" log message
- Running it a second time logs "Already seeded, skipping" and exits without inserting rows
- Drizzle Studio shows the expected number of rows with populated image URLs
- Item images render in the browser (requires the image host in `next.config.ts` `remotePatterns`)
