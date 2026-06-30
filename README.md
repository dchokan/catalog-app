# BookShelf — Books Catalog App

A full-stack Next.js 16 application for discovering and saving favorite books.

## Features

- Browse a catalog of books with cover images and descriptions
- Search books by title
- Paginated book list (9 books per page)
- Favorites counter showing how many users saved each book
- Save and remove books from your personal favorites list
- Authentication via email/password or Google OAuth

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Database:** Postgres (Supabase) with Drizzle ORM
- **Auth:** Better Auth (email/password + Google OAuth)
- **Data fetching:** TanStack Query
- **Forms & validation:** React Hook Form + Zod
- **Styling:** Tailwind CSS v4

## Getting Started

### 1. Clone and install

This project uses **Yarn 1.22.22** as its package manager.

```bash
git clone https://github.com/dchokan/catalog-app
cd catalog-app
yarn install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in:

| Variable               | Description                                                         |
| ---------------------- | ------------------------------------------------------------------- |
| `DATABASE_URL`         | Supabase Postgres connection string (Transaction Pooler, port 6543) |
| `BETTER_AUTH_SECRET`   | Random 32+ character string (generate with command below)           |
| `BETTER_AUTH_URL`      | App URL (e.g., `http://localhost:3000`)                             |
| `NEXT_PUBLIC_APP_URL`  | Same as above                                                       |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID (see Google OAuth setup below)               |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret                                          |

Generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Google OAuth setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/apis/credentials) and create a **new project** (if you don’t already have one).
2. Navigate to **APIs & Services → Credentials** and create an **OAuth 2.0 Client ID** (Application type: Web application).
3. Add the following **Authorized redirect URI**:
   - `http://localhost:3000/api/auth/callback/google`
4. Copy the generated **Client ID** and **Client Secret**.
5. Add them to your `.env.local` file:

### 3. Run database migrations

```bash
yarn db:push
```

This creates all tables in your Supabase database.

### 4. Seed the database

```bash
yarn db:seed
```

This inserts 12 sample books into the `items` table.

### 5. Start the development server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Script             | Description                            |
| ------------------ | -------------------------------------- |
| `yarn dev`         | Start development server               |
| `yarn build`       | Build for production                   |
| `yarn start`       | Start production server                |
| `yarn lint`        | Run ESLint                             |
| `yarn db:push`     | Push schema changes to database        |
| `yarn db:generate` | Generate SQL migration files           |
| `yarn db:migrate`  | Run pending migrations                 |
| `yarn db:studio`   | Open Drizzle Studio (visual DB editor) |
| `yarn db:seed`     | Seed database with sample data         |
