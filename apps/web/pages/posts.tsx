import { Masonry, useInfiniteLoader } from 'masonic';
import dynamic from 'next/dynamic';
import React from 'react';
import { usePagination, useQuery } from 'relay-hooks';
import { fetchQuery, graphql } from 'relay-runtime';
import { ClientOnly, ErrorText, Loading, PlaceHolder, Slogan, SloganContainer } from 'ui';

import styled, { x } from '@xstyled/styled-components';

import { ArticleCard_post$key } from '../__generated__/ArticleCard_post.graphql';
import { posts_BlogQuery } from '../__generated__/posts_BlogQuery.graphql';
import { posts_Posts$key } from '../__generated__/posts_Posts.graphql';
import { postsPostRefetchQuery } from '../__generated__/postsPostRefetchQuery.graphql';
import { initEnvironment } from '../relay';

import type { GetServerSidePropsContext } from 'next';

const ArticleCard = dynamic(() => import('../components/ArticleCard'), { loading: Loading });

const PostMasonry = styled(Masonry)`
  width: 100%;
  align-self: center;
  margin-left: auto;
  margin-right: auto;
  &:focus {
    border: none;
    outline: none;
  }
` as unknown as typeof Masonry;

const PostRow = styled(x.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 3rem;
`;

const postFragmentSpec = graphql`
  fragment posts_Posts on Blog
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" })
  @refetchable(queryName: "postsPostRefetchQuery") {
    postsConnection(first: $count, after: $cursor, orderBy: { key: "createdAt", order: desc })
      @connection(key: "posts_postsConnection") {
      edges {
        node {
          ...ArticleCard_post
        }
      }
    }
  }
`;

const blogQuery = graphql`
  query posts_BlogQuery($id: ID!) {
    blog(id: $id) {
      ...posts_Posts
    }
  }
`;

export const getServerSideProps = async ({ req, res }: GetServerSidePropsContext) => {
  const { environment, relaySSR } = initEnvironment(req.cookies.accessToken);
  await new Promise((resolve, reject) => {
    fetchQuery(environment, blogQuery, {
      id: process.env.NEXT_PUBLIC_DEFAULT_BLOG_ID,
    }).subscribe({
      complete: () => resolve(undefined),
      error: (err: Error) => reject(err),
    });
  });
  const [relayData] = await relaySSR.getCache();
  const [queryString, queryPayload] = relayData ?? [];

  if (req.cookies.accessToken) {
    res.setHeader('Cache-Control', 'no-cache');
  } else {
    res.setHeader('Cache-Control', 'max-age=0,s-maxage=604800, stale-while-revalidate');
  }

  return {
    props: {
      relayData: relayData && 'json' in queryPayload ? [[queryString, queryPayload.json]] : null,
    },
  };
};

type MasonryCardProps = { data: ArticleCard_post$key; width: number };

const MasonryCard: React.FC<MasonryCardProps> = (props: MasonryCardProps) => {
  const { data, width } = props;
  return <ArticleCard w={`${width}px`} post={data} />;
};

type PostSectionProps = {
  blog: posts_Posts$key;
};
const PostsSection = (props: PostSectionProps) => {
  const { blog } = props;
  const { data, hasNext, loadNext } = usePagination<postsPostRefetchQuery, posts_Posts$key>(
    postFragmentSpec,
    blog!,
  );

  const maybeLoadMore = useInfiniteLoader(() => hasNext && loadNext(10), {
    isItemLoaded: (index) => (data?.postsConnection?.edges?.length ?? 0) - 1 > index,
  });

  if (!data) return <PlaceHolder />;

  return (
    <PostRow mx={{ xs: '0.3rem', sm: '2rem', md: '6rem' }}>
      <PostMasonry<ArticleCard_post$key>
        columnWidth={350}
        items={
          data && data.postsConnection && data.postsConnection.edges
            ? data.postsConnection.edges
                .filter((e) => e !== null && e.node !== null)
                .map((e) => e!.node!)
            : []
        }
        columnGutter={20}
        overscanBy={2}
        render={MasonryCard}
        onRender={maybeLoadMore}
      />
    </PostRow>
  );
};

export default function Home() {
  const { error, data } = useQuery<posts_BlogQuery>(blogQuery, {
    id: process.env.NEXT_PUBLIC_DEFAULT_BLOG_ID,
  });

  if (error) {
    return <ErrorText>{error.message}</ErrorText>;
  }

  return (
    <>
      <SloganContainer
        mt={{ xs: '5rem', sm: '4rem', md: '4rem' }}
        mb={{ xs: '4rem', sm: '5rem', md: '6rem' }}
        fontSize={{ xs: '5xl', sm: '6xl', md: '7xl', lg: '8xl' }}
      >
        <Slogan>Posts</Slogan>
      </SloganContainer>
      {data && (
        <ClientOnly>
          <PostsSection blog={data.blog!} />
        </ClientOnly>
      )}
    </>
  );
}
