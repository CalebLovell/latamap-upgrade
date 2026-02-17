Help with a Prisma database change.

$ARGUMENTS

Steps:
1. Read `prisma/schema.prisma` to understand the current schema
2. Make the requested changes to the schema
3. Run `npm run db:migrate` to create and apply a migration
4. Run `npm run db:generate` to regenerate the Prisma client
5. Update any TypeScript code in `src/` that references changed models (imports, queries, types)
6. Run `npm run typecheck` to verify no type errors were introduced
7. If there's seed data in `prisma/seed.ts` that needs updating for the schema change, update it too
8. Run `npm run db:reset` to reset the database and re-seed it with fresh data
9. Summarize what was changed
