import 'zx/globals';

import { chalk } from 'zx';

import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

export const readSecret = async (vaultName: string, secretName: string, printArg: string) => {
  const credential = new DefaultAzureCredential();
  const url = `https://${vaultName}.vault.azure.net`;
  try {
    const client = new SecretClient(url, credential);
    const secret = await client.getSecret(secretName);
    if (printArg === '--env') {
      const secretVal = JSON.parse(secret.value ?? '{}');
      console.log(
        Object.entries(secretVal)
          .map(([key, value]) => `export ${key}="${value}";`)
          .join(' '),
      );
    }
    return secret.value ?? '{}';
  } catch (error) {
    console.error(chalk.red(`${error}`));
  }
  return '{}';
};
