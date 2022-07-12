/* eslint-disable relay/unused-fields */
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useMutation, useQuery } from 'relay-hooks';
import { graphql } from 'relay-runtime';
import { PlaceHolder } from 'ui';

import { postViewMutation } from '../__generated__/postViewMutation.graphql';
import { postViewQuery } from '../__generated__/postViewQuery.graphql';
import Article from '../components/Article';

export const postQuery = graphql`
  query postViewQuery($slug: String!) {
    post(slug: $slug) {
      content
      ...Article_post
    }
  }
`;

export const postMutation = graphql`
  mutation postViewMutation($slug: String!) {
    viewPost(input: { slug: $slug })
  }
`;

export const postViewComponent = (slug?: string) => {
  const PostViewComponent = () => {
    const router = useRouter();
    const postSlug = slug ?? (router.query.postSlug as string);
    const result = useQuery<postViewQuery>(postQuery, {
      slug: postSlug,
    });

    const { error, data, isLoading } = result;

    const [mutate] = useMutation<postViewMutation>(postMutation);

    useEffect(() => {
      mutate({ variables: { slug: postSlug } });
    }, [postSlug, mutate]);

    if (!data || isLoading || !data.post || router.isFallback) return <PlaceHolder />;
    if (error) return <div>{error.message}</div>;

    return <Article post={data.post} />;
  };

  return PostViewComponent;
};
