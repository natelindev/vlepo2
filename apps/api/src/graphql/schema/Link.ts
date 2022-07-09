import { builder } from '../builder.js';
import { getImageCDNUrl } from '../util/getImageCDNUrl.js';

export const Link = builder.prismaNode('Link', {
  id: { field: 'id' },
  fields: (t) => ({
    url: t.exposeString('url'),
    iconUrl: t.string({
      nullable: true,
      resolve: ({ iconId, iconUrl }, _args, ctx) =>
        iconId ? getImageCDNUrl(iconId, ctx) : iconUrl,
    }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
});
