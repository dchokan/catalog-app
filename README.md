# BookShelf — Books Catalog App

A full-stack Next.js 16 application for discovering and saving favorite books.

## Getting Started

### 1. Clone and install

\`\`\`bash
git clone https://github.com/dchokan/catalog-app
cd catalog-app
npm install
\`\`\`

### 2. Set up environment variables

Edit `.env.local` and fill in:

| Variable              | Description                                                         |
| --------------------- | ------------------------------------------------------------------- |
| `DATABASE_URL`        | Supabase Postgres connection string (Transaction Pooler, port 6543) |
| `BETTER_AUTH_SECRET`  | Random 32+ character string (generate with command below)           |
| `BETTER_AUTH_URL`     | App URL (e.g., `http://localhost:3000`)                             |
| `NEXT_PUBLIC_APP_URL` | Same as above                                                       |

Generate a secret:
\`\`\`bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`

### 3. Run database migrations

\`\`\`bash
npm run db:push
\`\`\`

This creates all tables in your Supabase database.

### 4. Seed the database

\`\`\`bash
npm run db:seed
\`\`\`

This inserts 12 sample books into the `items` table.

### 5. Start the development server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000].

## Available Scripts

| Script                | Description                            |
| --------------------- | -------------------------------------- |
| `npm run dev`         | Start development server               |
| `npm run build`       | Build for production                   |
| `npm run start`       | Start production server                |
| `npm run db:push`     | Push schema changes to database        |
| `npm run db:generate` | Generate SQL migration files           |
| `npm run db:migrate`  | Run pending migrations                 |
| `npm run db:studio`   | Open Drizzle Studio (visual DB editor) |
| `npm run db:seed`     | Seed database with sample data         |
