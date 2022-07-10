import { format, parseISO } from 'date-fns';
import { MDXRemote } from 'next-mdx-remote';
import { NextSeo } from 'next-seo';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useFragment } from 'relay-hooks';
import { graphql } from 'relay-runtime';
import { Column, H5, Image, Loading, MDXComponents, Row } from 'ui';
import { ArticleBody, Back, Content, Header, Title } from 'ui/components/Article';

import { KeyboardBackspace } from '@styled-icons/material-outlined';
import { useTheme } from '@xstyled/styled-components';

import { Article_post$key } from '../../__generated__/Article_post.graphql';

const CommentSection = dynamic(() => import('../Comment/CommentSection'), {
  loading: Loading,
});
const HoverShare = dynamic(() => import('ui/components/HoverShare'), {
  loading: Loading,
});
const Avatar = dynamic(() => import('ui/components/Avatar'), {
  loading: Loading,
});

const articleFragment = graphql`
  fragment Article_post on Post {
    title
    abstract
    slug
    renderedContent
    owner {
      id
      name
      profileImageUrl
    }
    tagsConnection(first: 5) {
      edges {
        node {
          name
        }
      }
    }
    imagesConnection(first: 5) {
      edges {
        node {
          url
          width
          height
          alt
        }
      }
    }
    minuteRead
    headerImageUrl
    editedAt
    createdAt
    ...CommentSection_commendable
  }
`;

type ArticleProps = {
  post: Article_post$key;
};

const Article = (props: ArticleProps) => {
  const { post: fullPost } = props;
  const router = useRouter();
  const data = useFragment(articleFragment, fullPost);

  const theme = useTheme();

  const {
    headerImageUrl,
    title,
    abstract,
    slug,
    renderedContent,
    owner,
    tagsConnection,
    editedAt,
    createdAt,
    minuteRead,
    imagesConnection,
  } = data;

  const fullUrl = new URL(`posts/${slug}`, process.env.NEXT_PUBLIC_SITE_URL).href;

  return (
    <>
      <NextSeo
        title={title}
        description={abstract ?? undefined}
        canonical={fullUrl}
        openGraph={{
          url: fullUrl,
          title,
          description: abstract ?? undefined,
          type: 'article',
          article: {
            publishedTime: createdAt,
            modifiedTime: editedAt ?? undefined,
            authors: [new URL(`/user/${owner.id}/profile`, process.env.NEXT_PUBLIC_SITE_URL).href],
            tags: tagsConnection.edges.map((te) => te.node.name),
          },
          images: [
            { url: headerImageUrl ?? owner.profileImageUrl ?? '', alt: title ?? undefined },
            ...imagesConnection.edges
              .map((ie) => ({
                url: ie.node.url ?? undefined,
                width: ie.node.width ?? undefined,
                height: ie.node.height ?? undefined,
                alt: ie.node.alt ?? undefined,
              }))
              .filter(
                (
                  i,
                ): i is {
                  alt: string | undefined;
                  height: number | undefined;
                  url: string;
                  width: number | undefined;
                } => i.url !== undefined,
              ),
          ],
          site_name: process.env.NEXT_PUBLIC_DEFAULT_BLOG_NAME,
        }}
        twitter={{
          handle: process.env.NEXT_PUBLIC_TWITTER_HANDLE,
          site: process.env.NEXT_PUBLIC_TWITTER_HANDLE,
          cardType: 'summary_large_image',
        }}
      />
      <Header h={{ xs: '18rem', sm: '20rem', md: '22rem' }}>
        <Image
          objectFit="cover"
          width="100%"
          filter={theme.colors.headerImageFilter}
          h={{ xs: '18rem', sm: '20rem', md: '22rem' }}
          src={headerImageUrl}
          textShadow={
            headerImageUrl && theme.name === 'light' ? 'rgba(0,0,0, 0.3) 0 0 8px' : 'none'
          }
        >
          <Column mt={theme.sizes.navbar} w="100%" mb="auto">
            <Back onClick={() => router.push('/')}>
              <KeyboardBackspace size={24} />
              <H5 ml="0.5rem">Back</H5>
            </Back>
            <Title fontSize={{ xs: '2xl', sm: '3xl', md: '4xl', lg: '5xl' }} mx="auto" mt="2rem">
              {title}
            </Title>
            <H5 fontWeight="normal" mx="auto" mt="2rem">
              {format(parseISO(createdAt), 'eee, MMM dd yyyy')}
              {' • '}
              {`${minuteRead ?? 1} min read`}
            </H5>
            <Row mx="auto" mt="0.5rem">
              {owner.profileImageUrl && (
                <Avatar variant="round" size={28} mr="0.5rem" src={owner.profileImageUrl} />
              )}
              {owner.name && (
                <H5 fontWeight="normal" my="auto">
                  {owner.name}
                </H5>
              )}
            </Row>
          </Column>
        </Image>
      </Header>
      <HoverShare
        title={title}
        url={fullUrl}
        tags={tagsConnection.edges.map((te) => te.node.name)}
      />
      <Column mb="2rem" mx="auto" w={{ xs: '90%', md: '85%', lg: '80%' }}>
        <Row>
          <ArticleBody mt="1rem">
            <Content>
              <MDXRemote {...JSON.parse(renderedContent)} components={MDXComponents} />
            </Content>
          </ArticleBody>
        </Row>
        <CommentSection variant="post" parent={data} />
      </Column>
    </>
  );
};

export default Article;
