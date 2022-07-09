import { DBComment, DBPost } from '../../types/db.js';
import { builder } from '../builder.js';
import { connectionBuilder, rawConnectionBuilder } from '../util/connectionBuilder.js';
import { getImageCDNUrl } from '../util/getImageCDNUrl.js';
import { Commendable } from './Comment.js';

export const User = builder.prismaNode('User', {
  id: { field: 'id' },
  interfaces: [Commendable],
  fields: (t) => ({
    name: t.exposeString('name', { nullable: true }),
    profileImageUrl: t.string({
      nullable: true,
      resolve: async ({ profileImageId, profileImageUrl }, _args, ctx) =>
        profileImageId ? getImageCDNUrl(profileImageId, ctx) : profileImageUrl,
    }),
    email: t.exposeString('email', { nullable: true }),
    website: t.exposeString('website', { nullable: true }),
    bio: t.exposeString('bio', { nullable: true }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    scopes: t.stringList({
      nullable: false,
      resolve: async ({ id }, _args, ctx) => {
        const user = await ctx.prisma.user.findFirst({
          where: {
            id,
          },
          select: {
            roles: {
              include: {
                scopes: true,
              },
            },
          },
        });
        return (
          user?.roles.reduce<string[]>(
            (prev, curr) => [...prev, ...(curr.scopes?.map((s) => s.value) ?? [])],
            [],
          ) ?? []
        );
      },
    }),
    commentsConnection: t.field(rawConnectionBuilder<DBComment>(t, 'comment')),
    postsConnection: t.relatedConnection(
      'posts',
      connectionBuilder<DBPost>(t, ['createdAt'], {
        where: {
          visibility: 'PUBLISHED',
        },
      }),
    ),
    rolesConnection: t.relatedConnection('roles', connectionBuilder(t)),
    thoughtsConnection: t.relatedConnection('thoughts', connectionBuilder(t)),
    projectsConnection: t.relatedConnection('projects', connectionBuilder(t)),
    designsConnection: t.relatedConnection('designs', connectionBuilder(t)),
    papersConnection: t.relatedConnection('papers', connectionBuilder(t)),
    imagesConnection: t.relatedConnection('images', connectionBuilder(t)),
  }),
});
