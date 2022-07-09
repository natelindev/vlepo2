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
  containerName: string,
  targetFileLocation: string,
  prefix?: string,
) => {
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

  // recursively upload all files and subdirectories to azure blob storage
  const recursiveUpload = async (dir: string, container: ContainerClient) => {
    const files = await fs.readdir(dir);
    for (const file of files) {
      const filePath = `${dir}/${file}`;
      const trimmedFilePath = `${prefix}${prefix ? '/' : ''}${filePath.replace(
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
