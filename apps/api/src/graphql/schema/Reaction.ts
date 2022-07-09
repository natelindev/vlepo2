import { builder } from '../builder.js';
import { ReactionType as DBReactionType } from '@prisma/client';

export const ReactionType = builder.enumType('ReactionType', {
  values: Object.values(DBReactionType),
});

export const Reaction = builder.prismaNode('Reaction', {
  id: { field: 'id' },
  fields: (t) => ({
    owner: t.relation('owner'),
    type: t.expose('type', { type: ReactionType }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
});

const ReactionEdge = builder.edgeObject({
  name: 'ReactionEdge',
  type: Reaction,
  fields: (t) => ({
    cursor: t.string({ nullable: false, resolve: (root) => root.cursor }),
    node: t.field({
      type: Reaction,
      nullable: false,
      resolve: (root) => root.node,
    }),
  }),
});

export const ReactionsConnection = builder.connectionObject({
  type: Reaction,
  nodeNullable: false,
  name: 'ReactionsConnection',
  fields: (t) => ({
    edges: t.field({
      type: [ReactionEdge],
      resolve: (root) => root.edges,
    }),
    pageInfo: t.field({
      type: builder.pageInfoRef(),
      resolve: (root) => root.pageInfo,
    }),
    totalCount: t.int({ resolve: (root) => root.totalCount }),
  }),
});

export const Reactable = builder.interfaceRef('Reactable').implement({
  fields: (t) => ({
    reactionsConnection: t.field({
      type: ReactionsConnection,
    }),
  }),
});
