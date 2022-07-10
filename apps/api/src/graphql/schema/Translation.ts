import { builder } from '../builder.js';
import { renderMdx } from '../util/renderMdx.js';

export const Translation = builder.prismaNode('Translation', {
  id: { field: 'id' },
  fields: (t) => ({
    type: t.exposeString('type'),
    language: t.exposeString('language'),
    content: t.exposeString('content'),
    renderedContent: t.string({
      nullable: false,
      resolve: async ({ content }) => renderMdx(content),
    }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
});
