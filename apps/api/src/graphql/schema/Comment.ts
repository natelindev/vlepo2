import { serialize } from 'next-mdx-remote/serialize';

import type { Language as LanguageType } from '@prisma/client';
import { DBComment } from '../../types/db.js';
import { builder } from '../builder.js';
import { connectionBuilder } from '../util/connectionBuilder.js';
import { mdxToMd } from '../util/mdxToMd.js';
import { Language, OrderBy } from './Node.js';

export const Comment = builder.prismaNode('Comment', {
  id: { field: 'id' },
  fields: (t) => ({
    owner: t.relation('owner'),
    content: t.exposeString('content'),
    renderedContent: t.string({
      nullable: false,
      resolve: async ({ content }) => {
        return JSON.stringify(
          await serialize(content, { mdxOptions: { remarkPlugins: [mdxToMd] } }),
        );
      },
    }),
    post: t.relation('post'),
    thought: t.relation('thought'),
    parent: t.relation('parent'),
    language: t.expose('language', { type: Language }),
    editedAt: t.expose('editedAt', { type: 'DateTime', nullable: true }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),

    imagesConnection: t.relatedConnection('images', connectionBuilder(t)),
    childCommentsConnection: t.relatedConnection(
      'childComments',
      connectionBuilder<DBComment>(t, ['editedAt']),
    ),
  }),
});

const CommentEdge = builder.edgeObject({
  name: 'CommentEdge',
  type: Comment,
  fields: (t) => ({
    cursor: t.string({ nullable: false, resolve: (root) => root.cursor }),
    node: t.field({
      type: Comment,
      resolve: (root) => root.node,
    }),
  }),
});

export const CommentsConnection = builder.connectionObject({
  type: Comment,
  nodeNullable: false,
  name: 'CommentsConnection',
  fields: (t) => ({
    edges: t.field({
      type: [CommentEdge],
      resolve: (root) => root.edges,
    }),
    pageInfo: t.field({
      type: builder.pageInfoRef(),
      resolve: (root) => root.pageInfo,
    }),
    totalCount: t.int({ resolve: (root) => root.totalCount }),
  }),
});

export const Commendable = builder.interfaceRef('Commendable').implement({
  fields: (t) => ({
    commentsConnection: t.field({
      args: {
        ...t.arg.connectionArgs(),
        orderBy: t.arg({ type: [OrderBy] }),
      },
      type: CommentsConnection,
    }),
  }),
});

export const createComment = builder.relayMutationField(
  'createComment',
  {
    inputFields: (t) => ({
      parentId: t.globalID({
        required: true,
      }),
      content: t.string({ required: true }),
    }),
  },
  {
    authScopes: {
      oauth: 'comment:create',
    },
    resolve: async (_root, { input: { parentId, content } }, ctx) => {
      const currentUser = ctx.state.user!;

      // extract language code
      const language =
        (ctx.request.header['accept-language']
          ?.split(';')[0]
          .split(',')
          .find((c) => c.length === 2) as LanguageType) ?? 'en';

      const comment = await ctx.prisma.comment.create({
        data: {
          owner: {
            connect: {
              id: currentUser.id,
            },
          },
          [parentId.typename.toLowerCase()]: {
            connect: {
              id: parentId.id,
            },
          },
          content,
          language,
        },
      });

      return {
        cursor: comment.id,
        node: comment,
      };
    },
  },
  {
    outputFields: (t) => ({
      createCommentEdge: t.field({
        type: CommentEdge,
        nullable: false,
        resolve: (root) => root,
      }),
    }),
  },
);
