import RelaySSR from 'react-relay-network-modern-ssr/node8/client';
import {
  authMiddleware,
  cacheMiddleware,
  errorMiddleware,
  RelayNetworkLayer,
  urlMiddleware,
} from 'react-relay-network-modern/node8';
import { Environment, RecordSource, Store } from 'relay-runtime';
import { getCookie } from 'ui/hooks/useCookie';

import type { SSRCache } from 'react-relay-network-modern-ssr/node8/server';

const source = new RecordSource();
const store = new Store(source);

let storeEnvironment: Environment | null = null;

export function createEnvironment(relayData: SSRCache): Environment {
  if (storeEnvironment) return storeEnvironment;

  storeEnvironment = new Environment({
    store,
    network: new RelayNetworkLayer([
      cacheMiddleware({
        size: 100,
        ttl: 60 * 1000,
      }),
      new RelaySSR(relayData).getMiddleware({
        lookup: true,
      }),
      urlMiddleware({
        url: () => {
          return '/graphql';
        },
        credentials: 'include',
      }),
      authMiddleware({
        token: getCookie<string>('accessToken'),
        allowEmptyToken: true,
      }),
      errorMiddleware(),
    ]),
  });

  return storeEnvironment;
}
