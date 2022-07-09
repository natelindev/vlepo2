import { serialize } from 'next-mdx-remote/serialize';

import { DBComment, DBImage, DBRating, DBReaction, DBShare, DBTag } from '../../types/db.js';
import { builder } from '../builder.js';
import { connectionBuilder, rawConnectionBuilder } from '../util/connectionBuilder.js';
import { getImageCDNUrl } from '../util/getImageCDNUrl.js';
import { Commendable } from './Comment.js';
import { Visibility } from './Node.js';
import { Ratable } from './Rating.js';
import { Reactable } from './Reaction.js';
import { Sharable } from './Share.js';
import { Taggable } from './Tag.js';

export const Design = builder.prismaNode('Design', {
  id: { field: 'id' },
  interfaces: [Commendable, Taggable, Reactable, Ratable, Sharable],
  fields: (t) => ({
    content: t.exposeString('content'),
    renderedContent: t.string({
      nullable: false,
      resolve: async ({ content }) => {
        return JSON.stringify(await serialize(content));
      },
    }),
    owner: t.relation('owner'),
    headerImageUrl: t.string({
      nullable: true,
      resolve: ({ headerImageId, headerImageUrl }, _args, ctx) =>
        headerImageId ? getImageCDNUrl(headerImageId, ctx) : headerImageUrl,
    }),
    visibility: t.expose('visibility', { type: Visibility }),
    editedAt: t.expose('editedAt', { type: 'DateTime', nullable: true }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    commentsConnection: t.field(rawConnectionBuilder<DBComment>(t, 'comment')),
    reactionsConnection: t.field(rawConnectionBuilder<DBReaction>(t, 'reaction')),
    tagsConnection: t.field(rawConnectionBuilder<DBTag>(t, 'tag')),
    sharesConnection: t.field(rawConnectionBuilder<DBShare>(t, 'share')),
    ratingsConnection: t.field(rawConnectionBuilder<DBRating>(t, 'rating')),
    imagesConnection: t.relatedConnection('images', connectionBuilder<DBImage>(t)),
  }),
});
