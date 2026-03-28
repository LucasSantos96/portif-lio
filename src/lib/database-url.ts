export function getDatabaseUrl() {
  return (
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    null
  );
}

export function getDirectDatabaseUrl() {
  return process.env.DIRECT_URL || process.env.POSTGRES_URL_NON_POOLING || null;
}
