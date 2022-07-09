import { spawn } from 'child_process';
import log from 'loglevel';
import path from 'path';

// import { getSecret } from './getSecret.js';

// load environment variables from azure key vault
// const secrets = await getSecret({
//   vaultName: 'vlepo-secrets',
//   secretName: 'db-credentials',
// });
// db migrate, use db:migrate-dev for local development

export const prepareDB = async () => {
  try {
    const exitCode = await new Promise((resolve, reject) => {
      const proc = spawn(
        path.resolve('./node_modules/prisma/build/index.js'),
        ['migrate', 'deploy'],
        {
          env: {
            DATABASE_URL: process.env.DATABASE_URL,
          } as NodeJS.ProcessEnv,
        },
      );

      proc.on('error', (error) => {
        if (error !== null) {
          log.error(`prisma migrate deploy exited with error ${error.message}`);
          reject(error);
        }
      });

      proc.on('close', (code: string) => {
        log.info(`exited with code ${code}`);
        resolve(code);
      });
    });

    if (exitCode !== 0) throw Error(`prisma migrate deploy failed with exit code ${exitCode}`);
  } catch (e) {
    log.error(e);
    throw e;
  }
};
