import type { ExtendedContext } from '../server';
import type PrismaTypes from '../types/pothos-types.js';

import { GraphQLDate, GraphQLDateTime, GraphQLVoid } from 'graphql-scalars';

import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import RelayPlugin from '@pothos/plugin-relay';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects';
import ValidationPlugin from '@pothos/plugin-validation';
import WithInputPlugin from '@pothos/plugin-with-input';

import db from '../db.js';
import { authenticated, oAuthCheckScope } from '../oauth2/graphql.js';

type authScopes = {
  loggedIn: boolean;
  oauth: string | string[];
};

export const builder = new SchemaBuilder<{
  AuthScopes: authScopes;
  DefaultEdgesNullability: {
    list: false;
    items: false;
  };
  DefaultNodeNullability: false;
  Connection: {
    totalCount: number;
  };
  Context: ExtendedContext;
  PrismaTypes: PrismaTypes;
  Scalars: {
    Date: {
      Input: string;
      Output: Date;
    };
    DateTime: {
      Input: string;
      Output: Date;
    };
    Void: {
      Input: void;
      Output: void;
    };
  };
}>({
  plugins: [
    ScopeAuthPlugin,
    RelayPlugin,
    ValidationPlugin,
    WithInputPlugin,
    PrismaPlugin,
    SimpleObjectsPlugin,
  ],
  prisma: {
    client: db.prisma,
  },
  relayOptions: {
    clientMutationId: 'omit',
    cursorType: 'String',
    edgesFieldOptions: {
      nullable: {
        list: false,
        items: false,
      },
    },
    nodeFieldOptions: {
      nullable: false,
    },
  },
  authScopes: async (ctx) => ({
    loggedIn: await authenticated(ctx),
    oauth: (perm) => oAuthCheckScope(perm, ctx),
  }),
});

builder.addScalarType('Date', GraphQLDate, {});
builder.addScalarType('DateTime', GraphQLDateTime, {});
builder.addScalarType('Void', GraphQLVoid, {});
