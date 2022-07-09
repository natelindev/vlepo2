import { builder } from '../builder.js';

export const Subscriber = builder.prismaNode('Subscriber', {
  id: { field: 'id' },
  fields: (t) => ({
    email: t.exposeString('email'),
    blog: t.relation('blog'),
    unsubscribedAt: t.expose('unsubscribedAt', {
      type: 'DateTime',
      nullable: true,
    }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
});

export const subscribe = builder.mutationField('subscribe', (t) =>
  t.fieldWithInput({
    type: 'Boolean',
    input: {
      email: t.input.string({ required: true }),
      firstName: t.input.string({ required: true }),
      blogId: t.input.string({ required: true }),
    },
    resolve: async (_root, { input: { email, firstName, blogId } }, ctx) => {
      const existing = await ctx.prisma.subscriber.findFirst({
        where: {
          email,
        },
      });
      if (existing) {
        return false;
      }
      await ctx.prisma.subscriber.create({
        data: {
          email,
          firstName,
          blog: {
            connect: {
              id: blogId,
            },
          },
        },
      });
      return true;
    },
  }),
);

export const unsubscribe = builder.mutationField('unsubscribe', (t) =>
  t.fieldWithInput({
    type: 'Boolean',
    input: {
      email: t.input.string({ required: true }),
    },
    resolve: async (_root, { input: { email } }, ctx) => {
      await ctx.prisma.subscriber.update({
        where: {
          email,
        },
        data: {
          unsubscribedAt: new Date(),
        },
      });
      return true;
    },
  }),
);
