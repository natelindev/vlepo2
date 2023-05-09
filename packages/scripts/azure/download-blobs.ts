/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import 'zx/globals';

import { findMissingFieldNames, hasFields } from 'helpers';
import { fs } from 'zx';

import {
  BlobServiceClient,
  ContainerClient,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';

export const downloadAllBlobs = async (
  account: string,
  accountKey: string,
  containerName: string,
  targetFileLocation: string,
) => {
  const requiredFields = ['account', 'accountKey', 'containerName'];
  if (!account || !accountKey || !containerName) {
    throw new Error(
      `Missing required fields: ${findMissingFieldNames(
        {
          account,
          accountKey,
          containerName,
        },
        requiredFields as ['account', 'accountKey', 'containerName'],
      )}`,
    );
  }

  const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);

  const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    sharedKeyCredential,
  );

  const containerClient = blobServiceClient.getContainerClient(containerName);

  // recursively download all files and subdirectories to azure blob storage

  const recursiveDownload = async (container: ContainerClient) => {
    const files = containerClient.listBlobsFlat();
    for await (const file of files) {
      const blob = container.getBlobClient(file.name);
      const dirPaths = `${targetFileLocation}/${file.name}`.split('/');
      if (dirPaths?.length > 1) {
        dirPaths.pop();
        const dir = dirPaths.join('/');
        if (!(await fs.pathExists(dir))) {
          await fs.mkdir(dir, { recursive: true });
        }
      }

      blob.downloadToFile(`${targetFileLocation}/${file.name}`);
    }
  };

  recursiveDownload(containerClient);
};
