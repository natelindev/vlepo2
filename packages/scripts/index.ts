#!/usr/bin/env npx ts-node --esm --compilerOptions={"module":"ESNext","target":"ESNext","moduleResolution":"node"}
import 'zx/globals';

import { spinner } from 'zx/experimental';

import { cleanBlobStorage } from './azure/clean-blob-storage.js';
import { clearSecret } from './azure/clear-secret.js';
import { readSecret } from './azure/read-secret.js';
import { uploadToBlobStorage } from './azure/upload-to-blob-storage.js';
import { writeSecret } from './azure/write-secret.js';

// eslint-disable-next-line @typescript-eslint/ban-types
const functionMap: Record<string, { message: string; func: Function }> = {
  'azure/upload-to-blob-storage': {
    message: `uploading to azure blob storage container`,
    func: uploadToBlobStorage,
  },
  'azure/clean-blob-storage': {
    message: `cleaning azure blob storage container`,
    func: cleanBlobStorage,
  },
  'azure/read-secret': {
    message: `reading secrets`,
    func: readSecret,
  },
  'azure/write-secret': {
    message: `writing secrets`,
    func: writeSecret,
  },
  'azure/clear-secret': {
    message: `clearing secrets`,
    func: clearSecret,
  },
};

const { message, func } = functionMap[argv.f];

if (message && func) {
  await spinner(message, async () => {
    await func(...argv.p.split(','));
  });
} else {
  console.log(`unknown action: ${argv.f}`);
}
