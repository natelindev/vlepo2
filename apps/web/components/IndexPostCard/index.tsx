import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { graphql, useFragment } from 'relay-hooks';
import { CardBody, CardImage, Row } from 'ui';

import { HeightProps, WidthProps } from '@xstyled/system';

import { IndexPostCard_post$key } from '../../__generated__/IndexPostCard_post.graphql';
import { Abstract, BasePostCard, IndexImageOverlay, PostCardTitle } from './style';

export type ArticleCardProps = {
  post: IndexPostCard_post$key;
} & WidthProps &
  HeightProps &
  React.ComponentProps<typeof BasePostCard>;

const indexPostCardFragment = graphql`
  fragment IndexPostCard_post on Post {
    title
    slug
    abstract
    headerImageUrl
  }
`;

const IndexPostCard = (props: ArticleCardProps) => {
  const { post: fullPost, h, w, ...rest } = props;
  const post = useFragment(indexPostCardFragment, fullPost);
  const { title, headerImageUrl, abstract, slug } = post;
  const router = useRouter();

  useEffect(() => {
    router.prefetch(`/posts/${slug}`);
  }, [router, slug]);

  return (
    <BasePostCard
      minHeight={h}
      minWidth={w}
      maxHeight={h}
      maxWidth={w}
      w={w}
      h={h}
      {...rest}
      color={headerImageUrl ? 'whiteText' : 'text'}
      ariaLabel={title}
      href={`/posts/${slug}`}
    >
      {headerImageUrl && (
        <CardImage
          layout="responsive"
          height={200}
          width={200}
          objectFit="cover"
          src={headerImageUrl}
          alt={title}
        />
      )}

      <IndexImageOverlay textShadow={headerImageUrl ? 'rgba(0,0,0, 0.3) 0 0 8px' : 'none'}>
        <CardBody>
          {title && (
            <Row>
              <PostCardTitle mr="0.5rem">{title}</PostCardTitle>
            </Row>
          )}
          {abstract && <Abstract>{abstract}</Abstract>}
        </CardBody>
      </IndexImageOverlay>
    </BasePostCard>
  );
};

export default IndexPostCard;
