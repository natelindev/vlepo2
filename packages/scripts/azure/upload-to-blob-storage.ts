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

export const uploadToBlobStorage = async (
  account: string,
  accountKey: string,
  containerName: string,
  targetFileLocation: string,
  prefix?: string,
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

  // recursively upload all files and subdirectories to azure blob storage
  const recursiveUpload = async (dir: string, container: ContainerClient) => {
    const files = await fs.readdir(dir);
    for (const file of files) {
      const filePath = `${dir}/${file}`;
      const trimmedFilePath = `${prefix ?? ''}${prefix ? '/' : ''}${filePath.replace(
        `${targetFileLocation}/`,
        '',
      )}`;
      const fileStat = await fs.stat(filePath);
      if (fileStat.isDirectory()) {
        await recursiveUpload(filePath, container);
      } else if (!file.includes('DS_Store')) {
        const blockBlobClient = container.getBlockBlobClient(trimmedFilePath);
        const stream = fs.createReadStream(filePath);
        await blockBlobClient.uploadStream(stream);
      }
    }
  };

  recursiveUpload(targetFileLocation, containerClient);
};
