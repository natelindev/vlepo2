import readingTime from 'reading-time';
import { remark } from 'remark';
import mdx from 'remark-mdx';
import strip from 'remark-mdx-to-plain-text';
import { match, Pattern } from 'ts-pattern';

import { DBComment, DBRating, DBReaction, DBShare, DBTag } from '../../types/db.js';
import { genPostSlug } from '../../util/genPostSlug.js';
import { builder } from '../builder.js';
import { connectionBuilder, rawConnectionBuilder } from '../util/connectionBuilder.js';
import { getImageCDNUrl } from '../util/getImageCDNUrl.js';
import { renderMdx } from '../util/renderMdx.js';
import { Commendable } from './Comment.js';
import { createImageInput } from './Image.js';
import { Visibility } from './Node.js';
import { Ratable } from './Rating.js';
import { Reactable } from './Reaction.js';
import { Sharable } from './Share.js';
import { createTagInput, Taggable } from './Tag.js';

export const Post = builder.prismaNode('Post', {
  id: { field: 'id' },
  interfaces: [Commendable, Reactable, Sharable, Ratable, Taggable],
  fields: (t) => ({
    title: t.exposeString('title'),
    slug: t.exposeString('slug'),
    abstract: t.string({
      nullable: true,
      resolve: async ({ content }) => {
        const strippedContent = await remark()
          .use(mdx)
          .use(strip)
          .process(content ?? '');
        const result = strippedContent.toString();
        return result.length > 0 ? result.slice(0, 150) : null;
      },
    }),
    content: t.exposeString('content'),
    renderedContent: t.string({
      nullable: false,
      resolve: async ({ content }) => renderMdx(content),
    }),
    owner: t.relation('owner'),
    headerImageUrl: t.string({
      nullable: true,
      resolve: ({ headerImageId, headerImageUrl }, _args, ctx) => {
        return headerImageId ? getImageCDNUrl(headerImageId, ctx) : headerImageUrl;
      },
    }),
    minuteRead: t.exposeInt('minuteRead', { nullable: true }),
    visibility: t.expose('visibility', { type: Visibility }),
    reactionCount: t.relationCount('reactions'),
    commentCount: t.relationCount('comments'),
    editedAt: t.expose('editedAt', { type: 'DateTime', nullable: true }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    shares: t.relation('shares'),
    viewCount: t.exposeInt('viewCount'),
    commentsConnection: t.field(rawConnectionBuilder<DBComment>(t, 'comment', { postId: '' })),
    reactionsConnection: t.field(rawConnectionBuilder<DBReaction>(t, 'reaction')),
    tagsConnection: t.field(rawConnectionBuilder<DBTag>(t, 'tag')),
    sharesConnection: t.field(rawConnectionBuilder<DBShare>(t, 'share')),
    ratingsConnection: t.field(rawConnectionBuilder<DBRating>(t, 'rating')),
    imagesConnection: t.relatedConnection('images', connectionBuilder(t), {
      edgesNullable: false,
    }),
  }),
});

export const viewPost = builder.mutationField('viewPost', (t) =>
  t.fieldWithInput({
    type: 'Void',
    input: {
      id: t.input.string(),
      slug: t.input.string(),
    },
    nullable: true,
    resolve: async (_root, { input: { id, slug } }, ctx) => {
      if (!slug && !id) {
        return;
      }
      const dbPost = await ctx.prisma.post.findFirst({
        select: {
          viewCount: true,
        },
        where: match({ id, slug })
          .with({ id: Pattern.string }, (v) => ({ id: v.id }))
          .with({ slug: Pattern.string }, (v) => ({ slug: v.slug }))
          .run(),
      });
      if (dbPost) {
        await ctx.prisma.post.update({
          where: match({ id, slug })
            .with({ id: Pattern.string }, (v) => ({ id: v.id }))
            .with({ slug: Pattern.string }, (v) => ({ slug: v.slug }))
            .run(),
          data: {
            viewCount: dbPost.viewCount + 1,
          },
        });
      }
    },
  }),
);

export const createPostInput = builder.inputType('CreatePostInput', {
  fields: (t) => ({
    title: t.string({ required: true }),
    headerImageId: t.string({ required: false }),
    content: t.string({ required: true }),
    visibility: t.field({ type: Visibility, required: true }),
    tags: t.field({ type: [createTagInput] }),
    images: t.field({ type: [createImageInput] }),
  }),
});

const PostEdge = builder.edgeObject({
  name: 'PostEdge',
  type: Post,
  fields: (t) => ({
    cursor: t.string({ nullable: false, resolve: (root) => root.cursor }),
    node: t.field({
      type: Post,
      resolve: (root) => root.node,
    }),
  }),
});

export const createPostPayload = builder.simpleObject('CreatePostPayload', {
  fields: (t) => ({
    createPostEdge: t.field({ type: PostEdge }),
  }),
});

export const createPost = builder.mutationField('createPost', (t) =>
  t.field({
    type: createPostPayload,
    args: {
      input: t.arg({ type: createPostInput, required: true }),
    },
    authScopes: {
      oauth: 'post:create',
    },
    resolve: async (
      _root,
      { input: { tags, images, visibility, title, content, headerImageId } },
      ctx,
    ) => {
      const currentUser = ctx.state.user!;
      const post = await ctx.prisma.post.create({
        data: {
          blog: {
            connect: {
              id: process.env.NEXT_PUBLIC_DEFAULT_BLOG_ID,
            },
          },
          owner: {
            connect: {
              id: currentUser.id,
            },
          },
          tags: {
            connectOrCreate: tags?.map((t) => ({
              where: {
                name: t.name,
              },
              create: {
                blog: {
                  connect: {
                    id: process.env.NEXT_PUBLIC_DEFAULT_BLOG_ID,
                  },
                },
                name: t.name,
              },
            })),
          },
          images: {
            create: images?.map((i) => ({
              ...i,
              owner: {
                connect: {
                  id: currentUser.id,
                },
              },
            })),
          },
          visibility,
          title,
          slug: genPostSlug(title),
          content,
          headerImageId,
          minuteRead: Math.ceil(readingTime(content).minutes),
        },
      });

      // only index published posts
      if (post.visibility === 'PUBLISHED') {
        ctx.searchIndex.saveObject({
          objectID: post.id,
          ...post,
          content: undefined,
        });
      }

      return {
        createPostEdge: {
          cursor: post.id,
          node: post,
        },
      };
    },
  }),
);
