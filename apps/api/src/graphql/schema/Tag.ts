import { DBDesign, DBPaper, DBProject, DBThought } from '../../types/db.js';
import { builder } from '../builder.js';
import { connectionBuilder } from '../util/connectionBuilder.js';
import { getImageCDNUrl } from '../util/getImageCDNUrl.js';

export const Tag = builder.prismaNode('Tag', {
  id: { field: 'id' },
  fields: (t) => ({
    name: t.exposeString('name'),
    headerImageUrl: t.string({
      nullable: true,
      resolve: ({ headerImageId, headerImageUrl }, _args, ctx) =>
        headerImageId ? getImageCDNUrl(headerImageId, ctx) : headerImageUrl,
    }),
    mainColor: t.exposeString('mainColor', { nullable: true }),
    secondaryColor: t.exposeString('secondaryColor', { nullable: true }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    designsConnection: t.relatedConnection('designs', connectionBuilder<DBDesign>(t)),
    thoughtsConnection: t.relatedConnection('thoughts', connectionBuilder<DBThought>(t)),
    papersConnection: t.relatedConnection('papers', connectionBuilder<DBPaper>(t)),
    projectsConnection: t.relatedConnection('projects', connectionBuilder<DBProject>(t)),
  }),
});

export const createTagInput = builder.inputType('createTagInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    headerImageId: t.string(),
    mainColor: t.string(),
    secondaryColor: t.string(),
  }),
});

const TagEdge = builder.edgeObject({
  name: 'TagEdge',
  type: Tag,
  fields: (t) => ({
    cursor: t.string({ nullable: false, resolve: (root) => root.cursor }),
    node: t.field({
      type: Tag,
      nullable: false,
      resolve: (root) => root.node,
    }),
  }),
});

export const TagsConnection = builder.connectionObject({
  type: Tag,
  nodeNullable: false,
  edgesNullable: {
    list: false,
    items: false,
  },
  name: 'TagsConnection',
  fields: (t) => ({
    edges: t.field({
      type: [TagEdge],
      resolve: (root) => root.edges,
    }),
    pageInfo: t.field({
      type: builder.pageInfoRef(),
      resolve: (root) => root.pageInfo,
    }),
    totalCount: t.int({ resolve: (root) => root.totalCount }),
  }),
});

export const Taggable = builder.interfaceRef('Taggable').implement({
  fields: (t) => ({
    tagsConnection: t.field({
      type: TagsConnection,
    }),
  }),
});
