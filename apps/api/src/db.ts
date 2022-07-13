// import { match, Pattern } from 'ts-pattern';

// import { envDetect } from 'helpers';

import { PrismaClient } from '@prisma/client';

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
