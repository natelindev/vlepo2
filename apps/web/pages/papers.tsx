import { GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { usePagination, useQuery } from 'relay-hooks';
import { fetchQuery, graphql } from 'relay-runtime';
import { Column, ErrorText, Loading, PlaceHolder, Row, Slogan, SloganContainer } from 'ui';

import { ExpandMore } from '@styled-icons/material-outlined';

import { PaperRefetchQuery } from '../__generated__/PaperRefetchQuery.graphql';
import { papers_BlogQuery } from '../__generated__/papers_BlogQuery.graphql';
import { papers_Papers$key } from '../__generated__/papers_Papers.graphql';
import { initEnvironment } from '../relay';

const PaperCard = dynamic(() => import('../components/PaperCard'), { loading: Loading });
const GradientButton = dynamic(() => import('ui/components/GradientButton'), { loading: Loading });

const paperFragmentSpec = graphql`
  fragment papers_Papers on Blog
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" })
  @refetchable(queryName: "PaperRefetchQuery") {
    papersConnection(first: $count, after: $cursor, orderBy: { key: "createdAt", order: desc })
      @connection(key: "papers_papersConnection") {
      edges {
        node {
          id
          ...PaperCard_paper
        }
      }
    }
  }
`;

const blogQuery = graphql`
  query papers_BlogQuery($id: ID!) {
    blog(id: $id) {
      ...papers_Papers
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

const Papers = () => {
  const { error, data, isLoading } = useQuery<papers_BlogQuery>(blogQuery, {
    id: process.env.NEXT_PUBLIC_DEFAULT_BLOG_ID,
  });

  if (error) {
    return <ErrorText>{error.message}</ErrorText>;
  }
  if (!data || isLoading) return <PlaceHolder />;

  return (
    <>
      <Head>
        <title key="title">Papers</title>
      </Head>

      <SloganContainer
        mt={{ xs: '5rem', sm: '4rem', md: '3rem' }}
        mb={{ xs: '4rem', sm: '5rem', md: '6rem' }}
        fontSize={{ xs: '5xl', sm: '6xl', md: '7xl', lg: '8xl' }}
      >
        <Slogan>Papers</Slogan>
      </SloganContainer>
      <PaperList blog={data!.blog!} />
    </>
  );
};

type PaperListProps = {
  blog: papers_Papers$key;
};
const PaperList = (props: PaperListProps) => {
  const { blog: fullBlog } = props;
  const {
    data: paper,
    isLoadingNext,
    hasNext,
    loadNext,
  } = usePagination<PaperRefetchQuery, papers_Papers$key>(paperFragmentSpec, fullBlog);

  return (
    <Column
      mx={{ xs: '0.3rem', sm: '6rem', md: '12rem', lg: 'auto' }}
      my="3rem"
      w={{ xs: 'auto', lg: '40rem' }}
    >
      {paper &&
        paper.papersConnection &&
        paper.papersConnection.edges &&
        paper.papersConnection.edges.map(
          (e) => e && e.node && e.node.id && <PaperCard key={e.node.id} mb="1rem" paper={e.node} />,
        )}
      {isLoadingNext && <>{Array(5).fill(<PaperCard paper={null} />)}</>}
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

export default Papers;
