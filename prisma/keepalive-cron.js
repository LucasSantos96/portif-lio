// Runs after every build (see package.json "postbuild") so each Vercel
// deploy re-applies the Supabase keepalive cron job. Idempotent: safe to
// run on every deploy. Mirrors
// supabase/migrations/20260823120000_schedule_db_keepalive_cron.sql
const { PrismaClient } = require("@prisma/client");

const databaseUrl =
  process.env.DIRECT_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn("[keepalive-cron] No database URL in env, skipping.");
  process.exit(0);
}

const prisma = new PrismaClient({
  datasources: { db: { url: databaseUrl } },
});

async function main() {
  await prisma.$executeRawUnsafe(`create extension if not exists pg_cron;`);
  await prisma.$executeRawUnsafe(`
    select cron.schedule(
      'portfolio-db-keepalive',
      '0 3 */4 * *',
      $$ select count(*) from public.portfolio_projects; $$
    );
  `);
  console.log("[keepalive-cron] Supabase keepalive cron job scheduled.");
}

main()
  .catch((error) => {
    console.warn("[keepalive-cron] Skipped:", error.message);
  })
  .finally(() => prisma.$disconnect());
