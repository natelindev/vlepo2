import { builder } from '../builder.js';
import { ShareType as DBShareType } from '@prisma/client';

export const ShareType = builder.enumType('ShareType', {
  values: Object.values(DBShareType),
});

export const Share = builder.prismaNode('Share', {
  id: { field: 'id' },
  fields: (t) => ({
    owner: t.relation('owner'),
    shareType: t.expose('shareType', { type: ShareType }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
});

const ShareEdge = builder.edgeObject({
  name: 'ShareEdge',
  type: Share,
  fields: (t) => ({
    cursor: t.string({ nullable: false, resolve: (root) => root.cursor }),
    node: t.field({
      type: Share,
      nullable: false,
      resolve: (root) => root.node,
    }),
  }),
});

export const SharesConnection = builder.connectionObject({
  type: Share,
  nodeNullable: false,
  name: 'SharesConnection',
  fields: (t) => ({
    edges: t.field({
      type: [ShareEdge],
      resolve: (root) => root.edges,
    }),
    pageInfo: t.field({
      type: builder.pageInfoRef(),
      resolve: (root) => root.pageInfo,
    }),
    totalCount: t.int({ resolve: (root) => root.totalCount }),
  }),
});

export const Sharable = builder.interfaceRef('Sharable').implement({
  fields: (t) => ({
    sharesConnection: t.field({
      type: SharesConnection,
    }),
  }),
});
