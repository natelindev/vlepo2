import { GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { usePagination, useQuery } from 'relay-hooks';
import { fetchQuery, graphql } from 'relay-runtime';
import { Column, ErrorText, Loading, PlaceHolder, Row, Slogan, SloganContainer } from 'ui';

import { ExpandMore } from '@styled-icons/material-outlined';

import { ProjectRefetchQuery } from '../__generated__/ProjectRefetchQuery.graphql';
import { projects_BlogQuery } from '../__generated__/projects_BlogQuery.graphql';
import { projects_Projects$key } from '../__generated__/projects_Projects.graphql';
import { initEnvironment } from '../relay';

const ProjectCard = dynamic(() => import('../components/ProjectCard'), { loading: Loading });
const GradientButton = dynamic(() => import('ui/components/GradientButton'), { loading: Loading });

const projectFragmentSpec = graphql`
  fragment projects_Projects on Blog
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" })
  @refetchable(queryName: "ProjectRefetchQuery") {
    projectsConnection(first: $count, after: $cursor, orderBy: { key: "createdAt", order: desc })
      @connection(key: "projects_projectsConnection") {
      edges {
        node {
          id
          ...ProjectCard_project
        }
      }
    }
  }
`;

const blogQuery = graphql`
  query projects_BlogQuery($id: ID!) {
    blog(id: $id) {
      ...projects_Projects
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

const Projects = () => {
  const { error, data, isLoading } = useQuery<projects_BlogQuery>(blogQuery, {
    id: process.env.NEXT_PUBLIC_DEFAULT_BLOG_ID,
  });

  if (error) {
    return <ErrorText>{error.message}</ErrorText>;
  }
  if (!data || isLoading) return <PlaceHolder />;

  return (
    <>
      <Head>
        <title key="title">Projects</title>
      </Head>
      <SloganContainer
        mt={{ xs: '5rem', sm: '4rem', md: '3rem' }}
        mb={{ xs: '4rem', sm: '5rem', md: '6rem' }}
        fontSize={{ xs: '5xl', sm: '6xl', md: '7xl', lg: '8xl' }}
      >
        <Slogan>Projects</Slogan>
      </SloganContainer>
      <ProjectList blog={data!.blog!} />
    </>
  );
};

type ProjectListProps = {
  blog: projects_Projects$key;
};
const ProjectList = (props: ProjectListProps) => {
  const { blog: fullBlog } = props;
  const {
    data: project,
    isLoadingNext,
    hasNext,
    loadNext,
  } = usePagination<ProjectRefetchQuery, projects_Projects$key>(projectFragmentSpec, fullBlog);

  return (
    <Column
      mx={{ xs: '0.3rem', sm: '6rem', md: '12rem', lg: 'auto' }}
      w={{ xs: 'auto', lg: '40rem' }}
      my="3rem"
    >
      {project &&
        project.projectsConnection &&
        project.projectsConnection.edges &&
        project.projectsConnection.edges.map(
          (e) =>
            e && e.node && e.node.id && <ProjectCard key={e.node.id} mb="1rem" project={e.node} />,
        )}
      {isLoadingNext && <>{Array(5).fill(<ProjectCard project={null} />)}</>}
      {hasNext && !isLoadingNext && (
        <Row>
          <GradientButton width="100%" mt="0.5rem" onClick={() => loadNext(5)}>
            <ExpandMore size={24} />
          </GradientButton>
        </Row>
      )}
    </Column>
  );
};

export default Projects;
