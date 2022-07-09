/* eslint-disable no-restricted-globals */
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

const isWebWorker =
  typeof self === 'object' &&
  self.constructor &&
  self.constructor.name === 'DedicatedWorkerGlobalScope';

const isNode =
  typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

const isProd = process.env.NODE_ENV === 'production' || process.env.ENV === 'PROD';
const isDev = process.env.NODE_ENV === 'development' || process.env.ENV === 'DEV';
const isTest = process.env.NODE_ENV === 'test' || process.env.ENV === 'TEST';
const isCI = process.env.ENV === 'ci' || process.env.ENV === 'CI';

export { isBrowser, isWebWorker, isNode, isProd, isDev, isTest, isCI };
