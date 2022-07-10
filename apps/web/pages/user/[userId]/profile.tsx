import { useRouter } from 'next/router';
import { graphql } from 'relay-runtime';
import { Avatar, Card, Column, ErrorText, H2, H4, PlaceHolder, Row } from 'ui';

import styled from '@xstyled/styled-components';

import { profile_userQuery } from '../../../__generated__/profile_userQuery.graphql';
import CommentSection from '../../../components/Comment/CommentSection';
import { useQueryFixed } from '../../../hooks/useQueryFixed';

const UserCard = styled(Card)`
  flex-direction: column;
`;

const profileUserQuery = graphql`
  query profile_userQuery($id: ID!) {
    user(id: $id) {
      name
      bio
      profileImageUrl
      ...CommentSection_commendable
    }
  }
`;

const Profile = () => {
  const router = useRouter();
  const userId = router.query.userId as string;
  const { data, isLoading, error } = useQueryFixed<profile_userQuery>(profileUserQuery, {
    id: userId,
  });

  if (error) {
    return <ErrorText>{error.message}</ErrorText>;
  }
  return (
    <Column mx="auto" w={{ xs: '90%', sm: '80%', md: '70%', lg: '60%' }}>
      {!isLoading && data?.user ? (
        <>
          <UserCard p="2rem" mt="10rem">
            <Row mt="-5rem">
              <Avatar
                variant="round"
                size={96}
                mx="auto"
                src={data.user.profileImageUrl ?? '/images/avatar/bot.svg'}
              />
            </Row>
            <Row mt="2rem">{data.user.name && <H2 mx="auto">{data.user.name}</H2>}</Row>
            <Row>{data.user.bio && <H4 mx="auto">{data.user.bio}</H4>}</Row>
          </UserCard>
          <Card my="2rem" width="100%">
            <CommentSection variant="profile" parent={data.user} />
          </Card>
        </>
      ) : (
        <PlaceHolder />
      )}
    </Column>
  );
};

export default Profile;
