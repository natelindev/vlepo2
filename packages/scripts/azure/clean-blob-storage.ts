/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import 'zx/globals';

import { findMissingFieldNames, hasFields } from 'helpers';

import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';

export const cleanBlobStorage = async (containerName: string) => {
  const requiredFields = ['AZURE_STORAGE_ACCOUNT', 'AZURE_STORAGE_ACCOUNT_KEY'];
  if (!hasFields(process.env, requiredFields)) {
    throw new Error(
      `Missing required fields: ${findMissingFieldNames(process.env, requiredFields)}`,
    );
  }

  const sharedKeyCredential = new StorageSharedKeyCredential(
    process.env.AZURE_STORAGE_ACCOUNT,
    process.env.AZURE_STORAGE_ACCOUNT_KEY,
  );

  const blobServiceClient = new BlobServiceClient(
    `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net`,
    sharedKeyCredential,
  );

  const containerClient = blobServiceClient.getContainerClient(containerName);

  const blobs = containerClient.listBlobsFlat();
  for await (const blob of blobs) {
    await containerClient.deleteBlob(blob.name);
  }
};
