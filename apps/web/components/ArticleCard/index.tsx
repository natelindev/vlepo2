import { addDays, compareAsc, format, parseISO } from 'date-fns';
import { graphql, useFragment } from 'relay-hooks';
import { match } from 'ts-pattern';
import {
  Abstract,
  ArticleCardFooter,
  ArticleCardTitle,
  ArticleDate,
  AuthorName,
  AuthorProfileImage,
  AuthorProfileImageContainer,
  AuthorSection,
  Badge,
  BaseArticleCard,
  CardBody,
  CardImage,
  Column,
  Row,
  Tag,
} from 'ui';

import { Article, Lock } from '@styled-icons/material-outlined';

import type { ArticleCard_post$key } from '../../__generated__/ArticleCard_post.graphql';

export type ArticleCardProps = {
  post: ArticleCard_post$key;
  width?: string;
  showProfile?: boolean;
};

const articlePostFragment = graphql`
  fragment ArticleCard_post on Post {
    id
    title
    slug
    abstract
    visibility
    headerImageUrl
    createdAt
    minuteRead
    tagsConnection {
      edges {
        node {
          id
          name
          mainColor
          secondaryColor
        }
      }
    }
    owner {
      name
      profileImageUrl
    }
  }
`;

const ArticleCard = (props: ArticleCardProps) => {
  const { post: fullPost, width, showProfile = true, ...rest } = props;
  const post = useFragment(articlePostFragment, fullPost);
  const {
    title,
    headerImageUrl,
    abstract,
    createdAt,
    slug,
    tagsConnection,
    visibility,
    owner,
    minuteRead,
  } = post;
  const createDate = parseISO(createdAt);

  return (
    <BaseArticleCard {...rest} href={`/posts/${slug}`} width={width}>
      {compareAsc(new Date(), addDays(createDate, 1)) === -1 && (
        <Row h="0">
          <Badge h="1.2rem" variant="accent" mt="-0.5rem" ml="auto" mr="-0.5rem">
            new
          </Badge>
        </Row>
      )}
      {headerImageUrl && (
        <CardImage
          layout="responsive"
          height={100}
          width={200}
          objectFit="cover"
          src={headerImageUrl}
          alt={title}
          variant="top"
        />
      )}

      <CardBody>
        {title && (
          <Row>
            <ArticleCardTitle mr="0.5rem">{title}</ArticleCardTitle>
          </Row>
        )}
        {owner && showProfile && (
          <AuthorSection>
            <AuthorProfileImageContainer>
              <AuthorProfileImage
                src={owner.profileImageUrl ?? '/images/avatar/bot.svg'}
                layout="fixed"
                height="36"
                width="36"
              />
            </AuthorProfileImageContainer>
            <Column>
              <AuthorName>{owner.name}</AuthorName>
              <AuthorName>
                {createdAt && (
                  <ArticleDate>
                    {format(createDate, 'MMM d, yyyy')}
                    {' • '}
                    {`${minuteRead ?? 1} min read`}
                  </ArticleDate>
                )}
              </AuthorName>
            </Column>
          </AuthorSection>
        )}
        {abstract && (
          <Abstract>
            {abstract}
            {abstract.length > 150 ? '...' : null}
          </Abstract>
        )}
      </CardBody>
      <ArticleCardFooter>
        {tagsConnection.edges.map((t) => (
          <Tag
            mainColor={t.node.mainColor}
            secondaryColor={t.node.secondaryColor}
            name={t.node.name}
            key={t.node.id}
            href={`/tags/${t.node.name}`}
          />
        ))}
        <Column ml="auto">
          {match(visibility)
            .with('DRAFT', () => <Article size={18} />)
            .with('PRIVATE', () => <Lock size={18} />)
            .with('PUBLISHED', () => null)
            .run()}
        </Column>
      </ArticleCardFooter>
    </BaseArticleCard>
  );
};

export default ArticleCard;
