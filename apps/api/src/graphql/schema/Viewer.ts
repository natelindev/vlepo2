import { builder } from '../builder.js';
import { User } from './User.js';

export const Viewer = builder.simpleObject('Viewer', {
  description: 'Current logged in user',
  fields: (t) => ({
    user: t.field({ type: User, nullable: true }),
  }),
});

export const node = builder.queryField('viewer', (t) =>
  t.field({
    type: Viewer,
    nullable: true,
    resolve: async (_root, _args, ctx) => {
      const user = (await ctx.oauth.extractAccessToken(ctx, true))?.user;

      // remove password hash
      if (user) {
        user.password = null;
      }
      return {
        user,
      };
    },
  }),
);
