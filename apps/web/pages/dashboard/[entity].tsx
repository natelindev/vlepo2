import { envDetect } from 'helpers';
import { GetServerSidePropsContext } from 'next';
/* eslint-disable react/destructuring-assignment */
import { useRouter } from 'next/router';
import { useState } from 'react';
import { usePagination, useQuery } from 'relay-hooks';
import { fetchQuery, graphql } from 'relay-runtime';
import { match } from 'ts-pattern';
import { ClientOnly, Column, ErrorText, GradientButton, PlaceHolder, Row, Sidebar } from 'ui';

import { AddCircle, ExpandMore } from '@styled-icons/material-outlined';

import { Entity_blogSectionQuery } from '../../__generated__/Entity_blogSectionQuery.graphql';
import { Entity_user$key } from '../../__generated__/Entity_user.graphql';
import { Entity_viewerQuery } from '../../__generated__/Entity_viewerQuery.graphql';
import { PostRefetchQuery } from '../../__generated__/PostRefetchQuery.graphql';
import PostCard from '../../components/Dashboard/PostCard';
import CreatePostModal from '../../components/Modals/CreatePostModal';
import { initEnvironment } from '../../relay';
import { Container, DashboardCard, DashboardMain, Numbers, NumbersLabel } from './style';

const fragmentSpec = graphql`
  fragment Entity_user on User
  @argumentDefinitions(count: { type: "Int", defaultValue: 5 }, cursor: { type: "String" })
  @refetchable(queryName: "PostRefetchQuery") {
    postsConnection(first: $count, after: $cursor) @connection(key: "Entity_postsConnection") {
      edges {
        node {
          id
          ...PostCard_post
        }
      }
    }
  }
`;

const blogSectionQuery = graphql`
  query Entity_blogSectionQuery($id: ID!) {
    blog(id: $id) {
      postViewCount
      postReactionCount
      postCommentCount
      userCount
    }
  }
`;

const viewerQuery = graphql`
  query Entity_viewerQuery {
    viewer {
      user {
        id
        scopes
        ...Entity_user
      }
    }
  }
`;

export const getServerSideProps = async ({ req, res }: GetServerSidePropsContext) => {
  if (!req.cookies.accessToken) {
    return {
      redirect: {
        destination: '/401',
        permanent: false,
      },
    };
  }

  if (res?.statusCode >= 400) {
    const statusCode = res?.statusCode;
    return { statusCode };
  }

  const { environment, relaySSR } = initEnvironment(req.cookies.accessToken);
  await new Promise((resolve, reject) => {
    fetchQuery(environment, viewerQuery, {}).subscribe({
      complete: () => resolve(undefined),
      error: (err: Error) => reject(err),
    });
  });
  const [relayData] = await relaySSR.getCache();
  const [queryString, queryPayload] = relayData ?? [];

  return {
    props: {
      relayData: relayData && 'json' in queryPayload ? [[queryString, queryPayload.json]] : null,
    },
  };
};

const Dashboard = () => {
  const router = useRouter();
  const entity = router.query.entity as string;

  const { data, isLoading } = useQuery<Entity_viewerQuery>(viewerQuery);

  if (!data || isLoading || !data.viewer) {
    return <PlaceHolder />;
  }

  if (envDetect.isBrowser && !data.viewer.user?.scopes.includes('blog')) {
    router.replace('/403');
  }

  return (
    <Container>
      <Sidebar />
      <ClientOnly>
        <DashboardMain>
          {match(entity)
            .with('blog', () => <BlogSection />)
            .with('post', () => data.viewer?.user && <PostSection user={data.viewer.user} />)
            .otherwise(() => null)}
        </DashboardMain>
      </ClientOnly>
    </Container>
  );
};

const BlogSection = () => {
  const { error, data, isLoading } = useQuery<Entity_blogSectionQuery>(blogSectionQuery, {
    id: process.env.NEXT_PUBLIC_DEFAULT_BLOG_ID,
  });

  if (!data || !data.blog || isLoading) return <PlaceHolder />;
  if (error) return <ErrorText>{error.message}</ErrorText>;

  const { postViewCount, postReactionCount, postCommentCount, userCount } = data.blog
    ? data.blog
    : { postViewCount: 0, postReactionCount: 0, postCommentCount: 0, userCount: 0 };

  return (
    <Row w="100%">
      <DashboardCard w={{ xs: '100%', sm: '50%', md: '25%' }} m={{ xs: '0rem', sm: '3rem' }}>
        <Numbers>{postViewCount}</Numbers>
        <NumbersLabel>Total post views</NumbersLabel>
      </DashboardCard>

      <DashboardCard w={{ xs: '100%', sm: '50%', md: '25%' }} m={{ xs: '0rem', sm: '3rem' }}>
        <Numbers>{postReactionCount}</Numbers>
        <NumbersLabel>Total post reactions</NumbersLabel>
      </DashboardCard>

      <DashboardCard w={{ xs: '100%', sm: '50%', md: '25%' }} m={{ xs: '0rem', sm: '3rem' }}>
        <Numbers>{postCommentCount}</Numbers>
        <NumbersLabel>Total post comments</NumbersLabel>
      </DashboardCard>

      <DashboardCard w={{ xs: '100%', sm: '50%', md: '25%' }} m={{ xs: '0rem', sm: '3rem' }}>
        <Numbers>{userCount}</Numbers>
        <NumbersLabel>Total users</NumbersLabel>
      </DashboardCard>
    </Row>
  );
};

type PostSectionProps = {
  user: Entity_user$key;
};

const PostSection = (props: PostSectionProps) => {
  const {
    data: user,
    isLoadingNext,
    hasNext,
    loadNext,
  } = usePagination<PostRefetchQuery, Entity_user$key>(fragmentSpec, props.user);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  if (!user) {
    return <PlaceHolder />;
  }
  return (
    <>
      <CreatePostModal open={showCreatePostModal} onClose={() => setShowCreatePostModal(false)} />
      <Row>
        <GradientButton
          width="5rem"
          ml="auto"
          mr="1rem"
          onClick={() => setShowCreatePostModal(true)}
        >
          <AddCircle size={24} />
        </GradientButton>
      </Row>
      <Column mt="1rem">
        {user &&
          user.postsConnection &&
          user.postsConnection.edges &&
          user.postsConnection.edges?.length > 0 &&
          user.postsConnection.edges.map(
            (e) => e && e.node && <PostCard key={e.node.id} post={e.node} />,
          )}
      </Column>
      {isLoadingNext && (
        <Column mt="1rem">
          {Array(5).fill(
            <PlaceHolder
              variant="inline"
              ml="1rem"
              mr="2.5rem"
              h="105px"
              my="0.5rem"
              borderRadius="default"
            />,
          )}
        </Column>
      )}
      {hasNext && !isLoadingNext && (
        <Row>
          <GradientButton width="100%" mt="0.5rem" mx="1rem" onClick={() => loadNext(5)}>
            <ExpandMore size={24} />
          </GradientButton>
        </Row>
      )}
    </>
  );
};

export default Dashboard;
