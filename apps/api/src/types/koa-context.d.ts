/* eslint-disable @typescript-eslint/no-empty-interface */
import type { User } from '@prisma/client';

import type { ExtendedContext } from '../server';

declare module 'koa' {
  export interface Context extends ExtendedContext {}
  export interface BaseContext extends ExtendedContext {}
  export interface DefaultState extends DefaultStateExtends {
    user?: User;
  }
}
