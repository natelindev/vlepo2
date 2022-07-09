import { match, Pattern } from 'ts-pattern';

import { ExtendedContext } from '../../server';

export const getVisibilityArgs = async (ctx: ExtendedContext) => {
  const accessToken = await ctx.oauth.extractAccessToken(ctx, true);
  const currentUser = accessToken?.user;

  return match<typeof currentUser>(currentUser)
    .with({ id: Pattern.string }, (u) => {
      return {
        OR: [
          {
            ownerId: u.id,
          },
          {
            visibility: 'PUBLISHED' as const,
          },
        ],
      };
    })
    .with(undefined, () => ({
      visibility: 'PUBLISHED' as const,
    }))
    .run();
};
