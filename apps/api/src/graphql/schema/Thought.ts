import { serialize } from 'next-mdx-remote/serialize';

import { DBComment, DBImage, DBReaction, DBShare, DBTag } from '../../types/db.js';
import { builder } from '../builder.js';
import { connectionBuilder, rawConnectionBuilder } from '../util/connectionBuilder.js';
import { Commendable } from './Comment.js';
import { Reactable } from './Reaction.js';
import { Sharable } from './Share.js';
import { Taggable } from './Tag.js';

export const Thought = builder.prismaNode('Thought', {
  id: { field: 'id' },
  interfaces: [Commendable, Sharable, Reactable, Taggable],
  fields: (t) => ({
    content: t.exposeString('content'),
    renderedContent: t.string({
      nullable: false,
      resolve: async ({ content }) => {
        return JSON.stringify(await serialize(content));
      },
    }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    imagesConnection: t.relatedConnection('images', connectionBuilder<DBImage>(t)),
    commentsConnection: t.field(rawConnectionBuilder<DBComment>(t, 'comment')),
    reactionsConnection: t.field(rawConnectionBuilder<DBReaction>(t, 'reaction')),
    sharesConnection: t.field(rawConnectionBuilder<DBShare>(t, 'share')),
    tagsConnection: t.field(rawConnectionBuilder<DBTag>(t, 'tag')),
  }),
});
