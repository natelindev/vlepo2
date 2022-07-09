import { serialize } from 'next-mdx-remote/serialize';
import { remark } from 'remark';
import mdx from 'remark-mdx';
import strip from 'remark-mdx-to-plain-text';

import { Visibility } from './Node.js';

import { DBRating, DBReaction, DBTag } from '../../types/db.js';
import { builder } from '../builder.js';
import { connectionBuilder, rawConnectionBuilder } from '../util/connectionBuilder.js';
import { getImageCDNUrl } from '../util/getImageCDNUrl.js';
import { Taggable } from './Tag.js';
import { Reactable } from './Reaction.js';
import { Ratable } from './Rating.js';

export const Project = builder.prismaNode('Project', {
  id: { field: 'id' },
  interfaces: [Taggable, Reactable, Ratable],
  fields: (t) => ({
    name: t.exposeString('name'),
    content: t.exposeString('content'),
    renderedContent: t.string({
      nullable: false,
      resolve: async ({ content }) => {
        return JSON.stringify(await serialize(content));
      },
    }),
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
    headerImageUrl: t.string({
      nullable: true,
      resolve: ({ headerImageId, headerImageUrl }, _args, ctx) =>
        headerImageId ? getImageCDNUrl(headerImageId, ctx) : headerImageUrl,
    }),
    visibility: t.expose('visibility', { type: Visibility }),
    url: t.exposeString('url', { nullable: true }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    imagesConnection: t.relatedConnection('images', connectionBuilder(t)),
    reactionsConnection: t.field(rawConnectionBuilder<DBReaction>(t, 'reaction')),
    tagsConnection: t.field(rawConnectionBuilder<DBTag>(t, 'tag')),
    ratingsConnection: t.field(rawConnectionBuilder<DBRating>(t, 'rating')),
  }),
});
