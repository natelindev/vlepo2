import algoliasearch, { SearchIndex } from 'algoliasearch';
import grant from 'grant';

import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-koa';

import { envDetect, findMissingFieldNames, hasFields } from 'helpers';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import http, { Server } from 'http';

import session from 'koa-session';
import log from 'loglevel';
import { promisify } from 'util';
import { migrateDB } from 'scripts/migrate-db.js';
// import appInsights from 'applicationinsights';

// const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });
import {
  BlobServiceClient,
  ContainerClient,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';
import cors from '@koa/cors';

import db from './db.js';
import { schema } from './graphql/schema/index.js';
import { grantConfig } from './oauth2/grantConfig.js';
import * as oauth from './oauth2/model.js';
import authRouter from './oauth2/router.js';

import persistedQueries from './persistedQueries.json' assert { type: 'json' };

import type { PrismaClient, User } from '@prisma/client';
import { GraphQLError } from 'graphql';
// import { getSecret } from './util/getSecret.js';
import { onHealthCheck } from './util/health.js';
// import { prepareDB } from './util/prepareDB.js';

export type ExtendedContext = {
  prisma: PrismaClient;
  oauth: typeof oauth;
  searchIndex: SearchIndex;
  // email: mailgun.Mailgun;
  blob: BlobServiceClient;
  imageService: ContainerClient;
  currentUser?: User;
} & Koa.Context &
  Koa.BaseContext;

log.setDefaultLevel(process.env.LOG_LEVEL || envDetect.isDev ? 'debug' : 'info');

export const runServer = async (): Promise<() => Promise<void>> => {
  // setup environment variables on production
  // if (!envDetect.isDev) {
  //   const secrets = await getSecret({ vaultName: 'vlepo-env', secretName: 'env-staging' });
  //   process.env = secrets as NodeJS.ProcessEnv;
  // }

  // migrate database on startup
  if (envDetect.isProd) {
    await migrateDB();
  }

  // setup app service logging
  // if (envDetect.isProd) {
  //   appInsights.setup().start();
  // }

  // setup search
  const client = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY);

  const index = client.initIndex(process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME);

  // setup azure storage
  const sharedKeyCredential = new StorageSharedKeyCredential(
    process.env.AZURE_STORAGE_ACCOUNT,
    process.env.AZURE_STORAGE_ACCOUNT_KEY,
  );

  const blobServiceClient = new BlobServiceClient(
    `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net`,
    sharedKeyCredential,
  );

  const imageContainerClient = blobServiceClient.getContainerClient('user-images');

  const app = new Koa();

  const requiredEnv = ['USER_SESSION_KEY'];
  if (!hasFields(process.env, requiredEnv)) {
    throw new Error(
      `You need ${findMissingFieldNames(process.env, requiredEnv)} env variable in order to run`,
    );
  }

  app.keys = [process.env.USER_SESSION_KEY!];
  app.context.prisma = db.prisma;
  app.context.oauth = oauth;
  app.context.searchIndex = index;
  app.context.blob = blobServiceClient;
  app.context.imageService = imageContainerClient;
  // app.context.email = mg;

  app.use(bodyParser());

  // CORS middleware
  app.use(
    envDetect.isProd
      ? (_ctx, next) => next()
      : cors({
          origin: '*',
          allowMethods: ['GET', 'HEAD', 'POST', 'OPTIONS'],
          credentials: true,
          allowHeaders: [
            'Access-Control-Allow-Headers',
            'X-CSRF-Token',
            'X-Requested-With',
            'Origin',
            'Authorization',
            'Access-Control-Request-Method',
            'Access-Control-Request-Headers',
            'Accept',
            'Accept-Version',
            'Content-Length',
            'Content-MD5',
            'Content-Type',
            'Date',
            'X-Api-Version',
          ],
        }),
  );

  // persist query middleware
  app.use((ctx, next) => {
    if (ctx.request.method === 'POST' && ctx.request.path.includes('/graphql')) {
      const { id } = ctx.request.body;

      if (id && id in persistedQueries) {
        ctx.request.body.query = persistedQueries[id as keyof typeof persistedQueries];
        return next();
      }

      // for local development
      if (envDetect.isDev) {
        return next();
      }

      ctx.status = 400;
      return undefined;
    }
    return next();
  });

  app.use(session(app));
  app.use(grant.koa()(grantConfig));
  app.use(authRouter.routes());

  const httpServer = http.createServer();
  const graphqlServer = new ApolloServer({
    csrfPrevention: true,
    cache: 'bounded',
    schema,
    context: ({ ctx }) => {
      return ctx;
    },
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground,
      ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
    formatError: (error: GraphQLError) => {
      log.error(error.extensions.exception?.stacktrace?.join('\n'));
      return {
        message: error.message,
        stack: envDetect.isDev ? error.extensions.exception?.stacktrace : undefined,
      };
    },
    stopOnTerminationSignals: true,
  });

  await graphqlServer.start();

  graphqlServer.applyMiddleware({ app, onHealthCheck });
  httpServer.on('request', app.callback());

  const koaServer = await new Promise<Server>((resolve) => {
    const server: Server = httpServer
      .listen({ port: process.env.PORT ?? 3001 }, () => resolve(server))
      .on('error', (err) => {
        log.error(err);
      })
      .on('close', () => {
        db.prisma.$disconnect();
      });
  });
  log.info(
    `API running at http://localhost:${process.env.PORT ?? 3001}${graphqlServer.graphqlPath}`,
  );

  process.on('SIGTERM', () => {
    log.info('SIGTERM signal received.');
    koaServer.close(() => {
      log.info('API service closed.');
    });
  });

  return promisify(koaServer.close.bind(koaServer));
};
