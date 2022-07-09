import { isDev } from 'helpers/dist/envDetect.js';

import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

const cachedSecrets: Record<string, Record<string, string>> = {};
export const getSecret = async <T extends string = string>(param: {
  vaultName?: string;
  secretName: string;
  noCache?: boolean;
}): Promise<Record<T, string>> => {
  if (isDev) {
    return process.env as Record<T, string>;
  }

  const { vaultName = 'vlepo-env', secretName, noCache } = param;

  if (!noCache && cachedSecrets[`${vaultName}\\${secretName}`]) {
    return cachedSecrets[`${vaultName}\\${secretName}`];
  }

  const credential = new DefaultAzureCredential();
  const url = `https://${vaultName}.vault.azure.net`;

  const client = new SecretClient(url, credential);

  const secret = await client.getSecret(secretName);
  if (secret.value) {
    const parsedSecret = JSON.parse(secret.value);
    cachedSecrets[`${vaultName}\\${secretName}`] = parsedSecret;
  }

  return cachedSecrets[`${vaultName}\\${secretName}`];
};
