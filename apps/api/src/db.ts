// import { match, Pattern } from 'ts-pattern';

// import { envDetect } from 'helpers';

import { PrismaClient } from '@prisma/client';

// import { getSecret } from './util/getSecret.js';

// if (!envDetect.isDev) {
//   const secrets = await getSecret({ vaultName: 'vlepo-secrets', secretName: 'db-credentials' });
//   process.env.DATABASE_URL = secrets.DB_CONNECTION_STRING;
// }

const prisma = new PrismaClient();

// add __typename for graphql nexus use
// prisma.$use(async (params, next) => {
//   const result = await next(params);

//   return match(params.action)
//     .with('findFirst', 'findUnique', () =>
//       match(result)
//         .with([Pattern], () =>
//           result.map((r: Record<string, unknown>) => ({
//             ...r,
//             __typename: params.model,
//           })),
//         )
//         .with(null, () => null)
//         .otherwise(() => ({
//           ...result,
//           __typename: params.model,
//         })),
//     )
//     .with('findMany', () =>
//       result.map((r: Record<string, unknown>) => ({
//         ...r,
//         __typename: params.model,
//       })),
//     )
//     .otherwise(() => result);
// });

export default { prisma };
