import { GetServerSideProps } from 'next';
import { getServerSideSitemapLegacy } from 'next-sitemap';
import { fetchQuery, graphql } from 'relay-runtime';

import {
  serverSitemapXml_BlogQuery,
  serverSitemapXml_BlogQuery$data,
} from '../../__generated__/serverSitemapXml_BlogQuery.graphql';
import { initEnvironment } from '../../relay';

const blogQuery = graphql`
  query serverSitemapXml_BlogQuery($id: ID!) {
    blog(id: $id) {
      postsConnection(first: 9999) {
        edges {
          node {
            slug
            visibility
            updatedAt
          }
        }
      }
    }
  }
`;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { environment, relaySSR } = initEnvironment(ctx.req.cookies.accessToken);
  await new Promise((resolve, reject) => {
    fetchQuery<serverSitemapXml_BlogQuery>(environment, blogQuery, {
      id: process.env.NEXT_PUBLIC_DEFAULT_BLOG_ID,
    }).subscribe({
      next: (data) => resolve(data),
      complete: () => resolve(undefined),
      error: (err: Error) => reject(err),
    });
  });
  const [relayData] = await relaySSR.getCache();
  const [, queryPayload] = relayData ?? [];

  const posts: NonNullable<serverSitemapXml_BlogQuery$data['blog']>['postsConnection']['edges'] =
    queryPayload.data?.blog.postsConnection.edges ?? [];

  const fields = posts
    .filter((p) => p.node.visibility === 'PUBLISHED')
    .map((p) => ({
      loc: new URL(`posts/${p.node.slug}`, process.env.NEXT_PUBLIC_SITE_URL).href,
      lastmod: p.node.updatedAt,
      changefreq: 'monthly' as const,
      priority: 0.5,
    }));

  return getServerSideSitemapLegacy(ctx, fields);
};

// Default export to prevent next.js errors
const siteMap = () => {};
export default siteMap;
