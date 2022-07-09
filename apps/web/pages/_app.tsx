import { DefaultSeo } from 'next-seo';
import React from 'react';
import { SSRCache } from 'react-relay-network-modern-ssr/node8/server';
import { RelayEnvironmentProvider } from 'relay-hooks';
import { GlobalStyles, theme, ToastContainer, ToastProvider } from 'ui';

import { ColorModeProvider, Preflight, ThemeProvider } from '@xstyled/styled-components';

import Layout from '../components/Layout';
import { createEnvironment } from '../relay';

import type { AppProps } from 'next/app';
// this is required since no other type fits
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface PageProps extends AppProps<any> {
  pageProps: {
    relayData: SSRCache;
  };
}

function App({ Component, pageProps }: PageProps) {
  return (
    <RelayEnvironmentProvider environment={createEnvironment(pageProps.relayData)}>
      <ThemeProvider theme={theme}>
        <ColorModeProvider>
          <Preflight />
          <GlobalStyles />
          <ToastProvider autoDismiss autoDismissTimeout={6000} placement="top-right">
            <ToastContainer />
            <Layout>
              <DefaultSeo
                openGraph={{
                  type: 'website',
                  locale: 'en_US',
                  url: process.env.NEXT_PUBLIC_SITE_URL,
                  site_name: process.env.NEXT_PUBLIC_DEFAULT_BLOG_NAME,
                }}
                twitter={{
                  handle: process.env.NEXT_PUBLIC_TWITTER_HANDLE,
                  site: process.env.NEXT_PUBLIC_TWITTER_HANDLE,
                  cardType: 'summary_large_image',
                }}
              />
              <Component {...pageProps} />
            </Layout>
          </ToastProvider>
        </ColorModeProvider>
      </ThemeProvider>
    </RelayEnvironmentProvider>
  );
}

export default App;
