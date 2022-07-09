/* eslint-disable import/no-extraneous-dependencies */
import dynamic from 'next/dynamic';
import { useFragment } from 'relay-hooks';
import { fetchQuery, graphql } from 'relay-runtime';
import { Card, ClientOnly, ErrorText, H2, H3, Loading, PlaceHolder, Row } from 'ui';

import { East } from '@styled-icons/material-outlined';
import styled, { x } from '@xstyled/styled-components';

import { pages_Index_BlogQuery } from '../__generated__/pages_Index_BlogQuery.graphql';
import { pages_Index_Papers$key } from '../__generated__/pages_Index_Papers.graphql';
import { pages_Index_Posts$key } from '../__generated__/pages_Index_Posts.graphql';
import { pages_Index_Projects$key } from '../__generated__/pages_Index_Projects.graphql';
import { useQueryFixed } from '../hooks/useQueryFixed';
import { initEnvironment } from '../relay';

import type { GetServerSidePropsContext } from 'next';

const IndexPostCard = dynamic(() => import('../components/IndexPostCard'), { loading: Loading });
const IndexProjectCard = dynamic(() => import('../components/IndexProjectCard'), {
  loading: Loading,
});
const IndexPaperCard = dynamic(() => import('../components/IndexPaperCard'), { loading: Loading });
const SubscribeSection = dynamic(() => import('../components/SubscribeSection'), {
  loading: Loading,
});
const HomeScene = dynamic(() => import('../scenes/home'), { ssr: false });

const blogQuery = graphql`
  query pages_Index_BlogQuery($id: ID!) {
    blog(id: $id) {
      ...pages_Index_Posts
      ...pages_Index_Projects
      ...pages_Index_Papers
    }
  }
`;

const indexPostsFragment = graphql`
  fragment pages_Index_Posts on Blog {
    postsConnection(first: 5, orderBy: { key: "createdAt", order: desc })
      @connection(key: "Index_postsConnection") {
      edges {
        node {
          id
          ...IndexPostCard_post
        }
      }
    }
  }
`;

const indexProjectsFragment = graphql`
  fragment pages_Index_Projects on Blog {
    projectsConnection(first: 5, orderBy: { key: "createdAt", order: desc })
      @connection(key: "Index_projectsConnection") {
      edges {
        node {
          id
          ...IndexProjectCard_project
        }
      }
    }
  }
`;

const indexPapersFragment = graphql`
  fragment pages_Index_Papers on Blog {
    papersConnection(first: 5, orderBy: { key: "createdAt", order: desc })
      @connection(key: "Index_papersConnection") {
      edges {
        node {
          id
          ...IndexPaperCard_paper
        }
      }
    }
  }
`;

const IndexSlogan = styled(x.h1)`
  margin-bottom: -2rem;
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  font-size: ${(props) => props.theme.fontSizes['7xl']};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  z-index: ${(props) => props.theme.zIndices.badge};
`;

export const BasePage = styled(x.div)`
  display: flex;
  flex-direction: column;
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

const IndexCardRow = styled(x.div)`
  display: flex;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
  overflow-x: scroll;
  overflow-y: hidden;
  align-items: center;
  margin-left: auto;
  margin-right: auto;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const IndexViewAllArrow = styled(East)`
  position: absolute;
  opacity: 0;
  top: 46%;
  right: 15%;
  transition: all 0.3s ease-in-out;
`;

const IndexViewAllCard = styled(Card)`
  @media only screen and (max-width: sm) {
    ${IndexViewAllArrow} {
      opacity: 1;
      right: 15%;
      top: 43%;
    }
  }

  @media only screen and (min-width: sm) {
    &:hover {
      ${IndexViewAllArrow} {
        opacity: 1;
        right: 10%;
      }
    }
  }
`;

type PostSectionProps = {
  blog: pages_Index_Posts$key;
} & React.ComponentProps<typeof IndexCardRow>;

const PostsSection = (props: PostSectionProps) => {
  const { blog, ...rest } = props;

  const data = useFragment<pages_Index_Posts$key>(indexPostsFragment, blog!);

  if (!data || !data.postsConnection)
    return (
      <IndexCardRow w={{ _: '90%', sm: '100%' }} h={{ _: 'auto', sm: '22rem' }}>
        <PlaceHolder />
      </IndexCardRow>
    );

  return (
    <IndexCardRow w={{ _: '90%', sm: '100%' }} h={{ _: 'auto', sm: '22rem' }} {...rest}>
      {data.postsConnection.edges?.map(
        (e) =>
          e &&
          e.node && (
            <IndexPostCard
              mr={{ _: 'auto', sm: '1rem' }}
              ml={{ _: 'auto', sm: '1rem' }}
              h={{ _: '15rem', sm: '20rem' }}
              w={{ _: '100%', sm: '20rem' }}
              my={{ _: '0.5rem', sm: '0' }}
              key={e.node.id}
              post={e.node}
            />
          ),
      ) ?? null}
      <IndexViewAllCard
        mr={{ _: 'auto', sm: '1rem' }}
        ml={{ _: 'auto', sm: '1rem' }}
        h={{ _: '10rem', sm: '20rem' }}
        w={{ _: '100%', sm: '20rem' }}
        minW={{ _: '100%', sm: '20rem' }}
        my={{ _: '0.5rem', sm: '0' }}
        ariaLabel="View all posts"
        href="/posts"
      >
        <H3 ml={{ _: '6rem', sm: '4.5rem' }} my="auto">
          View all Posts
        </H3>
        <IndexViewAllArrow size={24} />
      </IndexViewAllCard>
    </IndexCardRow>
  );
};

type ProjectSectionProps = {
  blog: pages_Index_Projects$key;
} & React.ComponentProps<typeof IndexCardRow>;

const ProjectsSection = (props: ProjectSectionProps) => {
  const { blog, ...rest } = props;

  const data = useFragment<pages_Index_Projects$key>(indexProjectsFragment, blog!);

  if (!data || !data.projectsConnection) return <PlaceHolder />;

  return (
    <IndexCardRow w={{ _: '90%', sm: '100%' }} h={{ _: 'auto', sm: '22rem' }} {...rest}>
      {data.projectsConnection.edges?.map(
        (e) =>
          e &&
          e.node && (
            <IndexProjectCard
              mr={{ _: 'auto', sm: '1rem' }}
              ml={{ _: 'auto', sm: '1rem' }}
              h={{ _: '15rem', sm: '20rem' }}
              w={{ _: '100%', sm: '20rem' }}
              my={{ _: '0.5rem', sm: '0' }}
              key={e.node.id}
              project={e.node}
            />
          ),
      ) ?? null}
      <IndexViewAllCard
        mr={{ _: 'auto', sm: '1rem' }}
        ml={{ _: 'auto', sm: '1rem' }}
        h={{ _: '10rem', sm: '20rem' }}
        w={{ _: '100%', sm: '20rem' }}
        minWidth={{ _: '100%', sm: '20rem' }}
        my={{ _: '0.5rem', sm: '0' }}
        ariaLabel="View all Projects"
        href="/projects"
      >
        <H3 ml={{ _: '5rem', sm: '3rem' }} my="auto">
          View all Projects
        </H3>
        <IndexViewAllArrow size={24} />
      </IndexViewAllCard>
    </IndexCardRow>
  );
};

type PaperSectionProps = {
  blog: pages_Index_Papers$key;
} & React.ComponentProps<typeof IndexCardRow>;
const PapersSection = (props: PaperSectionProps) => {
  const { blog, ...rest } = props;

  const data = useFragment<pages_Index_Papers$key>(indexPapersFragment, blog!);

  if (!data || !data.papersConnection) return <PlaceHolder />;

  return (
    <IndexCardRow w={{ _: '90%', sm: '100%' }} h={{ _: 'auto', sm: '22rem' }} {...rest}>
      {data.papersConnection.edges?.map(
        (e) =>
          e &&
          e.node && (
            <IndexPaperCard
              mr={{ _: 'auto', sm: '1rem' }}
              ml={{ _: 'auto', sm: '1rem' }}
              h={{ _: '15rem', sm: '20rem' }}
              w={{ _: '100%', sm: '20rem' }}
              my={{ _: '0.5rem', sm: '0' }}
              key={e.node.id}
              paper={e.node}
            />
          ),
      ) ?? null}
      <IndexViewAllCard
        mr={{ _: 'auto', sm: '1rem' }}
        ml={{ _: 'auto', sm: '1rem' }}
        h={{ _: '10rem', sm: '20rem' }}
        w={{ _: '100%', sm: '20rem' }}
        minWidth={{ _: '100%', sm: '20rem' }}
        my={{ _: '0.5rem', sm: '0' }}
        ariaLabel="View all Papers"
        href="/papers"
      >
        <H3 ml={{ _: '5.5rem', sm: '4rem' }} my="auto">
          View all Papers
        </H3>
        <IndexViewAllArrow size={24} />
      </IndexViewAllCard>
    </IndexCardRow>
  );
};

const CanvasContainer = styled(x.div)`
  width: 100%;
`;

export default function Home() {
  const { error, data } = useQueryFixed<pages_Index_BlogQuery>(blogQuery, {
    id: process.env.NEXT_PUBLIC_DEFAULT_BLOG_ID,
  });

  if (error) {
    return <ErrorText>{error.message}</ErrorText>;
  }

  if (!data || !data.blog) {
    return <PlaceHolder />;
  }

  return (
    <BasePage mx={{ _: '0', sm: '3rem', md: '5rem' }}>
      <IndexSlogan
        mt="5rem"
        mx={{ _: '1rem', sm: 'auto' }}
        fontSize={{ _: '6xl', sm: '7xl', md: '8xl', lg: '9xl' }}
      >
        {process.env.NEXT_PUBLIC_DEFAULT_BLOG_SLOGAN}
      </IndexSlogan>
      <CanvasContainer h={{ _: '300px', sm: '400px', md: '500px' }}>
        <ClientOnly>
          <HomeScene />
        </ClientOnly>
      </CanvasContainer>
      <Row ml={{ _: '2rem', sm: '0' }}>
        <H2>Posts</H2>
      </Row>
      <PostsSection blog={data.blog} flexDirection={{ _: 'column', sm: 'row' }} />
      <Row ml={{ _: '2rem', sm: '0' }}>
        <H2>Papers</H2>
      </Row>
      <PapersSection blog={data.blog} flexDirection={{ _: 'column', sm: 'row' }} />
      <Row ml={{ _: '2rem', sm: '0' }}>
        <H2>Projects</H2>
      </Row>
      <ProjectsSection blog={data.blog} flexDirection={{ _: 'column', sm: 'row' }} />
      <SubscribeSection />
    </BasePage>
  );
}
