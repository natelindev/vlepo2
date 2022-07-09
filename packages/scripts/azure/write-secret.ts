import 'zx/globals';

import { fs } from 'zx';

import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

export const writeSecret = async (
  vaultName: string,
  secretName: string,
  secretFilePath: string,
) => {
  const credential = new DefaultAzureCredential();

  const url = `https://${vaultName}.vault.azure.net`;

  const client = new SecretClient(url, credential);

  const secretValue = await fs.readFile(secretFilePath, 'utf8');
  await client.setSecret(secretName, secretValue);
};
