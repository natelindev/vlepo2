import { match, Pattern } from 'ts-pattern';

import { DBBlog, DBImage, DBTranslation, DBUser } from '../../types/db.js';
import { builder } from '../builder.js';
import { connectionArgsValidator, orderByArgs } from '../util/connectionBuilder.js';
import { Blog } from './Blog.js';
import { Comment } from './Comment.js';
import { OrderBy } from './Node.js';
import { Post } from './Post.js';
import { Translation } from './Translation.js';
import { User } from './User.js';

export const Query = builder.queryType({
  fields: (t) => ({
    blog: t.field({
      type: Blog,
      nullable: true,
      args: {
        id: t.arg.globalID({
          required: true,
        }),
      },
      resolve: async (_root, { id }, ctx) => {
        const blog = await ctx.prisma.blog.findFirst({
          where: {
            id: id.id,
          },
        });
        return blog;
      },
    }),
    post: t.field({
      type: Post,
      nullable: true,
      args: {
        id: t.arg.globalID(),
        slug: t.arg.string(),
      },
      resolve: async (_root, { id, slug }, ctx) => {
        const post = await ctx.prisma.post.findFirst({
          where: match({ id, slug })
            .with({ id: { id: Pattern.string } }, (v) => ({ id: v.id.id }))
            .with({ slug: Pattern.string }, (v) => ({ slug: v.slug }))
            .run(),
        });
        return post;
      },
    }),
    comment: t.field({
      type: Comment,
      nullable: true,
      args: {
        id: t.arg.globalID({ required: true }),
      },
      resolve: async (_root, { id }, ctx) => {
        const comment = await ctx.prisma.comment.findFirst({
          where: {
            id: id.id,
          },
        });
        return comment;
      },
    }),
    user: t.field({
      authScopes: {
        oauth: 'user',
      },
      type: User,
      nullable: true,
      args: {
        id: t.arg.globalID({
          required: true,
        }),
      },
      resolve: async (_root, { id }, ctx) => {
        const user = await ctx.prisma.user.findFirst({
          where: {
            id: id.id,
          },
        });
        return user;
      },
    }),
    translation: t.field({
      type: Translation,
      nullable: true,
      args: {
        targetId: t.arg.globalID({
          required: true,
        }),
      },
      resolve: async (_root, { targetId }, ctx) => {
        const translation = await ctx.prisma.translation.findFirst({
          where: {
            [targetId.typename.toLowerCase()]: {
              id: targetId.id,
            },
          },
        });
        return translation;
      },
    }),
    usersConnection: t.prismaConnection({
      type: 'User',
      cursor: 'id',
      authScopes: {
        oauth: 'user',
      },
      args: {
        orderBy: t.arg({
          type: [OrderBy],
        }),
      },
      validate: connectionArgsValidator<DBUser>(['createdAt', 'updatedAt', 'name']),
      resolve: (query, _parent, { orderBy }, ctx) =>
        ctx.prisma.user.findMany({ ...query, orderBy: orderByArgs(orderBy) }),
    }),
    translationConnection: t.prismaConnection({
      type: 'Translation',
      cursor: 'id',
      authScopes: {
        oauth: 'translation',
      },
      args: {
        orderBy: t.arg({
          type: [OrderBy],
        }),
      },
      validate: connectionArgsValidator<DBTranslation>(['createdAt', 'updatedAt']),
      resolve: (query, _parent, { orderBy }, ctx) =>
        ctx.prisma.translation.findMany({ ...query, orderBy: orderByArgs(orderBy) }),
    }),
    blogsConnection: t.prismaConnection({
      type: 'Blog',
      cursor: 'id',
      authScopes: {
        oauth: 'blog',
      },
      args: {
        orderBy: t.arg({
          type: [OrderBy],
        }),
      },
      validate: connectionArgsValidator<DBBlog>(['createdAt', 'updatedAt', 'name']),
      resolve: (query, _parent, { orderBy }, ctx) =>
        ctx.prisma.blog.findMany({ ...query, orderBy: orderByArgs(orderBy) }),
    }),
    tagsConnection: t.prismaConnection({
      type: 'Tag',
      cursor: 'id',
      authScopes: {
        oauth: 'tag',
      },
      args: {
        orderBy: t.arg({
          type: [OrderBy],
        }),
      },
      validate: connectionArgsValidator<DBTranslation>(['createdAt', 'updatedAt']),
      resolve: (query, _parent, { orderBy }, ctx) =>
        ctx.prisma.tag.findMany({ ...query, orderBy: orderByArgs(orderBy) }),
    }),
    imagesConnection: t.prismaConnection(
      {
        type: 'Image',
        cursor: 'id',
        authScopes: {
          oauth: 'image',
        },
        args: {
          orderBy: t.arg({
            type: [OrderBy],
          }),
        },
        validate: connectionArgsValidator<DBImage>(['createdAt', 'updatedAt']),
        resolve: (query, _parent, { orderBy }, ctx) =>
          ctx.prisma.image.findMany({ ...query, orderBy: orderByArgs(orderBy) }),
      },
      {
        edgesNullable: false,
      },
    ),
  }),
});
