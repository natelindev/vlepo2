import type { ExtendedContext } from '../server.js';

export const oAuthCheckScope = async (scope: string | string[], ctx: ExtendedContext) => {
  const token = ctx.oauth.extractAccessToken(ctx);
  if (token) {
    return ctx.oauth.verifyScope(token, scope);
  }
  return false;
};

export const authenticated = async (ctx: ExtendedContext) => {
  const accessToken = await ctx.oauth.extractAccessToken(ctx, true);
  ctx.state.user = accessToken?.user;
  ctx.currentUser = accessToken?.user;
  return ctx.oauth.verifyAccessToken(accessToken?.accessToken);
};
