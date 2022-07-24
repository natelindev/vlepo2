import argon2 from 'argon2';
import { add } from 'date-fns';
import { envDetect } from 'helpers';
import { match, Pattern } from 'ts-pattern';

import { OAuthClient } from '@prisma/client';

import { generateAccessToken, saveToken } from '../../oauth2/model.js';
import { builder } from '../builder.js';

export const login = builder.relayMutationField(
  'login',
  {
    validate: () => true,
    inputFields: (t) => ({
      email: t.string({ required: true }),
      password: t.string({ required: true }),
    }),
  },
  {
    validate: () => true,
    resolve: async (_root, { input: { email, password } }, ctx) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          email,
        },
        include: {
          roles: true,
        },
      });

      return match(user)
        .with(null, async () => ({
          ok: false,
          error: 'user not found',
        }))
        .with({ password: Pattern.string }, async (u) => {
          const validPassword = await argon2.verify(u.password, password, {
            type: argon2.argon2id,
          });

          if (validPassword) {
            const accessToken = await generateAccessToken();
            const expiresAt = add(new Date(), { days: 1 });
            const userRole = await ctx.prisma.userRole.findFirst({
              where: {
                users: {
                  some: {
                    id: u.id,
                  },
                },
              },
              select: {
                scopes: true,
              },
            });
            if (!userRole) {
              throw new Error('user role does not exist');
            }
            await saveToken(
              {
                accessToken,
                accessTokenExpiresAt: expiresAt,
                scope: userRole.scopes.map((s) => s.value),
              },
              (await ctx.prisma.oAuthClient.findFirst({
                where: {
                  id: process.env.NEXT_PUBLIC_DEFAULT_CLIENT_ID,
                },
              })) as OAuthClient,
              u,
            );
            ctx.cookies.set('accessToken', accessToken, {
              secure: envDetect.isProd,
              httpOnly: false,
              expires: expiresAt,
            });
          }

          return validPassword
            ? { ok: true, error: '' }
            : {
                ok: false,
                error: 'username or password incorrect',
              };
        })
        .with({ password: Pattern.not(Pattern.string) }, async () => ({
          ok: false,
          error: 'you cannot login using password, please use third party login',
        }))
        .run();
    },
  },
  {
    outputFields: (t) => ({
      ok: t.boolean({ nullable: false, resolve: (root) => root.ok }),
      error: t.string({ resolve: (root) => root.error, nullable: true }),
    }),
  },
);
