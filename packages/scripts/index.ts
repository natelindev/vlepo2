#!/usr/bin/env npx ts-node --esm --compilerOptions={"module":"ESNext","target":"ESNext","moduleResolution":"node"}
import 'zx/globals';

import { spinner } from 'zx/experimental';

import { cleanBlobStorage } from './azure/clean-blob-storage.js';
import { clearSecret } from './azure/clear-secret.js';
import { readSecret } from './azure/read-secret.js';
import { test } from './azure/test.js';
import { uploadToBlobStorage } from './azure/upload-to-blob-storage.js';
import { writeSecret } from './azure/write-secret.js';

// eslint-disable-next-line @typescript-eslint/ban-types
const functionMap: Record<string, { message: string; func: Function }> = {
  'azure/upload-to-blob-storage': {
    message: `uploading to ${process.argv[3]} Azure Blob Storage container ${process.argv[4]}`,
    func: uploadToBlobStorage,
  },
  'azure/clean-blob-storage': {
    message: `cleaning Azure Blob Storage container ${process.argv[3]}`,
    func: cleanBlobStorage,
  },
  'azure/read-secret': {
    message: `reading secrets from ${process.argv[3]}/${process.argv[4]}`,
    func: readSecret,
  },
  'azure/write-secret': {
    message: `writing secrets to ${process.argv[3]}/${process.argv[4]}`,
    func: writeSecret,
  },
  'azure/clear-secret': {
    message: `clearing secrets from ${process.argv[3]}/${process.argv[4]}`,
    func: clearSecret,
  },
  test: {
    message: 'test',
    func: test,
  },
};

const { message, func } = functionMap[process.argv[2]];
if (message && func) {
  await spinner(message, async () => {
    await func(...process.argv.slice(3));
  });
} else {
  console.log(`unknown action: ${process.argv[2]}`);
}
