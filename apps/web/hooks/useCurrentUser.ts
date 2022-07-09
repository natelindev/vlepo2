/* eslint-disable relay/unused-fields */
import { graphql } from 'relay-runtime';
import { getCookie } from 'ui';

import { useCurrentUser_viewerQuery } from '../__generated__/useCurrentUser_viewerQuery.graphql';
import { useQueryFixed } from './useQueryFixed';

const viewerQuery = graphql`
  query useCurrentUser_viewerQuery {
    viewer {
      user {
        id
        name
        profileImageUrl
        rolesConnection(first: 5) {
          edges {
            node {
              value
            }
          }
        }
      }
    }
  }
`;

export const useCurrentUser = () => {
  const { data } = useQueryFixed<useCurrentUser_viewerQuery>(
    viewerQuery,
    {},
    { skip: !getCookie<string>('accessToken')?.length },
  );

  return data?.viewer?.user ?? null;
};
