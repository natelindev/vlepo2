import 'zx/globals';

import { $ } from 'zx';

export const migrateDB = async () => {
  $`npx prisma migrate deploy`;
};
