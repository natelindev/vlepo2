import { match } from 'ts-pattern';

/* eslint-disable @typescript-eslint/ban-types */
import {
  Connection,
  ConnectionArguments,
  Edge,
  findManyCursorConnection,
} from '@devoxa/prisma-relay-cursor-connection';
import { ArgBuilder } from '@pothos/core';

import { ExtendedContext } from '../../server.js';
import { CommentsConnection } from '../schema/Comment.js';
import { OrderBy } from '../schema/Node.js';
import { RatingsConnection } from '../schema/Rating.js';
import { ReactionsConnection } from '../schema/Reaction.js';
import { SharesConnection } from '../schema/Share.js';
import { TagsConnection } from '../schema/Tag.js';

export type orderByType =
  | {
      key: string;
      order?: 'asc' | 'desc' | null | undefined;
    }[]
  | null
  | undefined;

export const connectionArgsValidator =
  <T>(keys: (keyof T)[]) =>
  (args: Record<string, unknown>): boolean => {
    const { first, last, before, after, orderBy } = args;
    // default rules
    if ((!first && !last) || (first && last) || (first && before) || (last && after)) {
      return false;
    }
    // additional rules
    if (orderBy) {
      if (
        !(orderBy as NonNullable<orderByType>)
          .map((o) => o.key)
          .every((k) => keys.includes(k as keyof T))
      ) {
        return false;
      }
    }
    return true;
  };

export const orderByArgs = (orderBy: orderByType) =>
  orderBy?.reduce(
    (prev, curr) => ({
      ...prev,
      [curr.key]: curr.order,
    }),
    {},
  );

export const connectionBuilder = <
  DBType extends { createdAt: unknown; updatedAt: unknown } = {
    createdAt: unknown;
    updatedAt: unknown;
  },
  T extends { arg: Function } = { arg: Function },
>(
  t: T,
  additionalOrderby: (keyof DBType)[] = [],
  additionalArgs: Record<string, unknown> = {},
) => ({
  validate: connectionArgsValidator<DBType>(['createdAt', 'updatedAt', ...additionalOrderby]),
  cursor: 'id' as const,
  args: {
    orderBy: t.arg({ type: [OrderBy] }),
  },
  query: (args: { orderBy: unknown }) => ({
    ...additionalArgs,
    orderBy: orderByArgs(args.orderBy as orderByType),
  }),
  totalCount: true,
});

export const rawConnectionBuilder = <
  DBType extends { createdAt: unknown; updatedAt: unknown } = {
    createdAt: unknown;
    updatedAt: unknown;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends { arg: ArgBuilder<any> } = { arg: ArgBuilder<any> },
>(
  t: T,
  variant: 'comment' | 'reaction' | 'share' | 'tag' | 'rating',
  additionalArgs: Record<string, unknown> = {},
) => ({
  type: match(variant)
    .with('comment', () => CommentsConnection)
    .with('reaction', () => ReactionsConnection)
    .with('share', () => SharesConnection)
    .with('tag', () => TagsConnection)
    .with('rating', () => RatingsConnection)
    .run(),
  nullable: false,
  args: {
    ...t.arg.connectionArgs(),
    orderBy: t.arg({ type: [OrderBy] }),
  },
  validate: () => true,
  // validate: connectionArgsValidator<DBType>(['createdAt', 'updatedAt']),
  resolve: async (
    parent: { id: string },
    args: ConnectionArguments & { orderBy?: orderByType },
    ctx: ExtendedContext,
  ) => {
    const customArgs = {
      orderBy: orderByArgs(args.orderBy),
      where: {
        ...Object.entries(additionalArgs).reduce(
          (prev, [key, value]) => ({
            ...prev,
            [key]: key.toLowerCase().includes('id') ? parent.id : value,
          }),
          {},
        ),
      },
    };
    const result = await findManyCursorConnection(
      // @ts-expect-error dynamic workaround
      (args) => ctx.prisma[variant].findMany({ ...args, ...customArgs }),
      // @ts-expect-error dynamic workaround
      () => ctx.prisma[variant].count(customArgs),
      args,
    );
    return result as unknown as Connection<Node, Edge<DBType & Node>>;
  },
});
