import db from '../db.js';

export const onHealthCheck = async (): Promise<boolean> => {
  const result = await db.prisma.$queryRaw<string[]>`
  select
    tablename as table
  from
    pg_tables
  where schemaname = 'public'`;
  if (result && result.length > 0) {
    return true;
  }
  return false;
};
