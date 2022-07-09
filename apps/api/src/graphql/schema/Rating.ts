import { builder } from '../builder.js';

export const Rating = builder.prismaNode('Rating', {
  id: { field: 'id' },
  fields: (t) => ({
    owner: t.relation('owner'),
    score: t.exposeInt('score'),
    comment: t.exposeString('comment', { nullable: true }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
});

const RatingEdge = builder.edgeObject({
  name: 'RatingEdge',
  type: Rating,
  fields: (t) => ({
    cursor: t.string({ nullable: false, resolve: (root) => root.cursor }),
    node: t.field({
      type: Rating,
      nullable: false,
      resolve: (root) => root.node,
    }),
  }),
});

export const RatingsConnection = builder.connectionObject({
  type: Rating,
  nodeNullable: false,
  name: 'RatingsConnection',
  fields: (t) => ({
    edges: t.field({
      type: [RatingEdge],
      resolve: (root) => root.edges,
    }),
    pageInfo: t.field({
      type: builder.pageInfoRef(),
      resolve: (root) => root.pageInfo,
    }),
    totalCount: t.int({ resolve: (root) => root.totalCount }),
  }),
});

export const Ratable = builder.interfaceRef('Ratable').implement({
  fields: (t) => ({
    ratingsConnection: t.field({
      type: RatingsConnection,
    }),
  }),
});
