# Latin American Political History Map

An interactive visual timeline of the political history of Latin America, featuring a D3-powered map with playback controls for exploring events across time.

## Tech Stack

- **Framework:** TanStack Start (React SSR) with Vite
- **Database:** PostgreSQL with Prisma ORM
- **Styling:** Tailwind CSS v4
- **Maps:** D3 + TopoJSON
- **Testing:** Vitest (unit) + Playwright (e2e)
- **Linting/Formatting:** Biome

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```

2. Copy `.env.example` to `.env` and set your `DATABASE_URL`:
   ```sh
   cp .env.example .env
   ```

3. Push the schema and seed the database:
   ```sh
   npm run db:push
   npm run db:seed
   ```

4. Start the dev server:
   ```sh
   npm run dev
   ```
   App runs at [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run Playwright e2e tests |
| `npm run test:all` | Run all tests |
| `npm run clean` | Lint, format, and typecheck |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | Reset and re-seed database |

## Database

- PostgreSQL is required. Set `DATABASE_URL` in `.env`.
  - Ex: Railway > Project > Variable > DATABASE_URL
- Schema is defined in `prisma/schema.prisma`
- Seed data is in `prisma/seed.ts`