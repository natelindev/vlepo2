import 'zx/globals';

import { chalk } from 'zx';

import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

export const clearSecret = async (vaultName: string, secretName: string, printArg: string) => {
  const credential = new DefaultAzureCredential();
  const url = `https://${vaultName}.vault.azure.net`;
  try {
    const client = new SecretClient(url, credential);
    const secret = await client.getSecret(secretName);
    const secretVal = JSON.parse(secret.value ?? '{}');
    console.log(
      Object.keys(secretVal)
        .map((key) => `unset ${key};`)
        .join(' '),
    );
  } catch (error) {
    console.error(chalk.red(`${error}`));
  }
};
