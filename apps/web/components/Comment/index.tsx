import { format, parseISO } from 'date-fns';
import { MDXRemote } from 'next-mdx-remote';
import React from 'react';
import { useFragment } from 'relay-hooks';
import { graphql } from 'relay-runtime';
import { match } from 'ts-pattern';
import { Avatar, Badge, H4, H5, H6, MDXComponents, Row } from 'ui';

import { Comment_comment$key } from '../../__generated__/Comment_comment.graphql.js';
import { CommentQuery } from '../../__generated__/CommentQuery.graphql.js';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useQueryFixed } from '../../hooks/useQueryFixed';
import { BaseComment, CommentContent } from './style';

export const commentFragment = graphql`
  fragment Comment_comment on Comment {
    content
    renderedContent
    post {
      title
    }
    owner {
      id
      name
      profileImageUrl
    }
    createdAt
  }
`;

const commentQuery = graphql`
  query CommentQuery($id: ID!) {
    comment(id: $id) {
      ...Comment_comment
    }
  }
`;

type CommentProps = {
  commentId: string;
  variant: 'profile' | 'post';
} & React.ComponentProps<typeof BaseComment>;

const Comment = (props: CommentProps) => {
  const { variant, commentId, ...rest } = props;
  const currentUser = useCurrentUser();

  const { data } = useQueryFixed<CommentQuery>(commentQuery, { id: commentId });

  const comment = useFragment<Comment_comment$key>(commentFragment, data?.comment ?? null);

  return (
    comment && (
      <BaseComment variant={variant} {...rest}>
        {match(variant)
          .with('post', () => (
            <>
              <Row alignItems="center">
                <Avatar variant="round" src={comment.owner.profileImageUrl} size={32} />
                <H5 mx="0.5rem">{comment.owner.name}</H5>

                {currentUser && currentUser.id === comment.owner.id && (
                  <Badge ml="0.3rem" variant="secondary">
                    me
                  </Badge>
                )}
                <H6 ml="auto">{format(parseISO(comment.createdAt), 'MMM d')}</H6>
              </Row>
              <CommentContent>
                <MDXRemote {...JSON.parse(comment.renderedContent)} components={MDXComponents} />
              </CommentContent>
            </>
          ))
          .with('profile', () => (
            <>
              {comment.post && <H6 color="muted">{comment.post.title}</H6>}
              <Row>
                <H4>{comment.content}</H4>
                <H4 ml="auto" mr="1rem">
                  {format(parseISO(comment.createdAt), 'MMM d')}
                </H4>
              </Row>
            </>
          ))
          .run()}
      </BaseComment>
    )
  );
};

export default Comment;
