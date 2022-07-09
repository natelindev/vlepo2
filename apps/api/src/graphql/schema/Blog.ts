import { DBDesign, DBPaper, DBPost, DBProject, DBTag, DBThought } from '../../types/db.js';
import { builder } from '../builder.js';
import { connectionBuilder } from '../util/connectionBuilder.js';

export const Blog = builder.prismaNode('Blog', {
  id: { field: 'id' },
  fields: (t) => ({
    // pass through fields
    name: t.expose('name', { type: 'String', nullable: true }),
    owner: t.relation('owner'),
    visitorCount: t.exposeInt('visitorCount'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),

    // custom fields
    postViewCount: t.int({
      async resolve({ id }, _args, ctx) {
        const allViewCounts = await ctx.prisma.post.findMany({
          select: {
            viewCount: true,
          },
          where: {
            blogId: id,
          },
        });
        return allViewCounts.map((avc) => avc.viewCount).reduce((prev, curr) => prev + curr, 0);
      },
    }),
    postReactionCount: t.int({
      async resolve({ id }, _args, ctx) {
        const result = await ctx.prisma.reaction.count({
          select: {
            postId: true,
          },
          where: {
            post: {
              blogId: id,
            },
          },
        });
        return result.postId;
      },
    }),
    postCommentCount: t.int({
      async resolve({ id }, _args, ctx) {
        const result = await ctx.prisma.comment.count({
          select: {
            postId: true,
          },
          where: {
            post: {
              blogId: id,
            },
          },
        });
        return result.postId;
      },
    }),
    userCount: t.int({
      async resolve(_root, _args, ctx) {
        return ctx.prisma.user.count();
      },
    }),

    // connections
    postsConnection: t.relatedConnection(
      'posts',
      connectionBuilder<DBPost>(t, ['editedAt', 'title'], {
        where: {
          visibility: 'PUBLISHED',
        },
      }),
      {
        edgesNullable: false,
      },
    ),
    thoughtsConnection: t.relatedConnection(
      'thoughts',
      connectionBuilder<DBThought>(t, ['editedAt']),
    ),
    designsConnection: t.relatedConnection('designs', connectionBuilder<DBDesign>(t)),
    tagsConnection: t.relatedConnection('tags', connectionBuilder<DBTag>(t, ['name'])),
    papersConnection: t.relatedConnection('papers', connectionBuilder<DBPaper>(t, ['name'])),
    projectsConnection: t.relatedConnection('projects', connectionBuilder<DBProject>(t, ['name'])),
  }),
});
