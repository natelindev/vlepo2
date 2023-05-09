/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const relay = require('./relay.config.js');

// @ts-check
const isProd = process.env.NODE_ENV === 'production' || process.env.ENV === 'PROD';
const isDev = process.env.NODE_ENV === 'development' || process.env.ENV === 'DEV';
// const isTest = process.env.NODE_ENV === 'test' || process.env.ENV === 'TEST';
const isDocker = process.env.ENV === 'docker' || process.env.ENV === 'DOCKER';
const bundleAnalyzerEnabled = process.env.ANALYZE === 'true';
/**
 *
 * @param {any} x
 * @returns
 */
const noOp = (x) => x;
let withTM = noOp;
let withBundleAnalyzer = noOp;

if (isDev || isDocker) {
  withTM = require('next-transpile-modules')(['ui']);
}

if (bundleAnalyzerEnabled) {
  withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: bundleAnalyzerEnabled,
  });
}

/**
 * @type {import('next').NextConfig}
 * */
const config = {
  output: 'standalone',
  // reactStrictMode: true,
  images: {
    domains: [
      process.env.NEXT_PUBLIC_CDN_URL,
      'disqus.com',
      'api.nate-lin.com',
      'dev-to-uploads.s3.amazonaws.com',
      'placeholder.pics',
      'images.unsplash.com',
      'images.pexels.com',
      'avatars.githubusercontent.com',
      'www.redditstatic.com',
      'styles.redditmedia.com',
      'lh1.googleusercontent.com',
      'lh2.googleusercontent.com',
      'lh3.googleusercontent.com',
      'lh4.googleusercontent.com',
      'lh5.googleusercontent.com',
      'lh6.googleusercontent.com',
      'lh7.googleusercontent.com',
      'lh8.googleusercontent.com',
      'lh9.googleusercontent.com',
      'localhost',
    ],
  },
  experimental: {
    // this includes files from the monorepo base two directories up
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
  assetPrefix: isProd || isDocker ? `${process.env.NEXT_PUBLIC_CDN_URL}/next` : '',
  pageExtensions: ['tsx'],
  typescript: {
    ignoreBuildErrors: !isDev,
  },
  eslint: {
    ignoreDuringBuilds: !isDev,
  },
  poweredByHeader: false,
  compiler: {
    removeConsole: true,
    styledComponents: {
      topLevelImportPaths: [
        '@xstyled/styled-components',
        '@xstyled/styled-components/no-tags',
        '@xstyled/styled-components/native',
        '@xstyled/styled-components/primitives',
      ],
    },
    relay: {
      // This should match relay.config.js
      src: relay.src,
      artifactDirectory: relay.artifactDirectory,
      language: 'typescript',
    },
  },
  // Proxy to Backend
  async rewrites() {
    return isDev
      ? [
          {
            source: '/api/:path*',
            destination: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/:path*`,
          },
          {
            source: '/graphql/:path*',
            destination: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/graphql/:path*`,
          },
          {
            source: '/images/:path*',
            destination: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/images/:path*`,
          },
          {
            source: '/models/:path*',
            destination: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/models/:path*`,
          },
          {
            source: '/user-images/:path*',
            destination: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/user-images/:path*`,
          },
        ]
      : [
          // health check route
          {
            source: '/health',
            destination: '/api/health',
          },
        ];
  },
};

module.exports = isDev || isDocker ? withBundleAnalyzer(withTM(config)) : config;
