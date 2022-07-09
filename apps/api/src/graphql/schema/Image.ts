import { add } from 'date-fns';

import { ContainerSASPermissions, SASProtocol } from '@azure/storage-blob';

import { builder } from '../builder.js';
import { getImageCDNUrl } from '../util/getImageCDNUrl.js';

export const Image = builder.prismaNode('Image', {
  id: { field: 'id' },
  fields: (t) => ({
    owner: t.relation('owner'),
    extension: t.exposeString('extension'),
    url: t.string({
      nullable: true,
      resolve: ({ id }, _args, ctx) => getImageCDNUrl(id, ctx),
    }),
    mainColor: t.exposeString('mainColor', { nullable: true }),
    secondaryColor: t.exposeString('secondaryColor', { nullable: true }),
    alt: t.exposeString('alt', { nullable: true }),
    height: t.exposeInt('height', { nullable: true }),
    width: t.exposeInt('width', { nullable: true }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
});

export const ImageUploadURL = builder.queryField('imageUploadURL', (t) =>
  t.string({
    resolve: async (_root, _args, ctx) =>
      ctx.imageService.generateSasUrl({
        expiresOn: add(new Date(), { minutes: 10 }),
        protocol: SASProtocol.HttpsAndHttp,
        permissions: ContainerSASPermissions.from({ create: true }),
      }),
  }),
);

export const ImageEdge = builder.edgeObject({
  name: 'ImageEdge',
  type: Image,
  fields: (t) => ({
    cursor: t.string({ nullable: false, resolve: (root) => root.cursor }),
    node: t.field({
      type: Image,
      resolve: (root) => root.node,
    }),
  }),
});

export const createImageInput = builder.inputType('createImageInput', {
  fields: (t) => ({
    id: t.string({
      required: true,
    }),
    extension: t.string({
      required: true,
    }),
    postId: t.string({
      required: false,
    }),
    alt: t.string({
      required: false,
    }),
    height: t.int({
      required: false,
    }),
    width: t.int({
      required: false,
    }),
  }),
});

export const createImagePayload = builder.simpleObject('CreateImagePayload', {
  fields: (t) => ({
    createImageEdge: t.field({
      type: ImageEdge,
      nullable: false,
    }),
  }),
});

export const createImage = builder.mutationField('createImage', (t) =>
  t.field({
    type: createImagePayload,
    args: {
      input: t.arg({ type: createImageInput, required: true }),
    },
    resolve: async (_root, { input: { id, postId, alt, height, width, extension } }, ctx) => {
      const currentUser = ctx.state.user!;

      const image = await ctx.prisma.image.create({
        data: {
          id,
          owner: {
            connect: {
              id: currentUser.id,
            },
          },
          post: postId
            ? {
                connect: {
                  id: postId,
                },
              }
            : undefined,
          extension,
          alt,
          height,
          width,
        },
      });

      return {
        createImageEdge: {
          cursor: image.id,
          node: image,
        },
      };
    },
  }),
);
