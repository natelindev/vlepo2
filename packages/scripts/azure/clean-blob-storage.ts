/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import 'zx/globals';

import { findMissingFieldNames, hasFields } from 'helpers';

import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';

export const cleanBlobStorage = async (
  account: string,
  accountKey: string,
  containerName: string,
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

  const blobs = containerClient.listBlobsFlat();
  for await (const blob of blobs) {
    await containerClient.deleteBlob(blob.name);
  }
};
