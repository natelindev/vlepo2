import { useForm } from 'react-hook-form';
import { useMutation } from 'relay-hooks';
import { graphql } from 'relay-runtime';
import {
  ErrorText,
  Form,
  GradientButton,
  H3,
  H4,
  Input,
  InputGroup,
  Label,
  Loading,
  Row,
  useToasts,
} from 'ui';

import {
  SubscribeSectionMutation,
  SubscribeSectionMutation$variables,
} from '../../__generated__/SubscribeSectionMutation.graphql';
import { BaseSubscribeSection } from './style';

export const subscribeMutation = graphql`
  mutation SubscribeSectionMutation($firstName: String!, $email: String!, $blogId: String!) {
    subscribe(input: { firstName: $firstName, email: $email, blogId: $blogId })
  }
`;

const SubscribeSection = () => {
  const { addToast } = useToasts();
  const [mutate, { loading }] = useMutation<SubscribeSectionMutation>(subscribeMutation, {
    onCompleted: (response) => {
      if (response.subscribe) {
        addToast({
          message: 'you are now successfully subscribed',
          type: 'success',
        });
      } else {
        addToast({
          message: 'you have already subscribed',
        });
      }
    },
    onError: (err) => {
      addToast({
        message: `subscribe failed, error: ${err.message}`,
        type: 'error',
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Omit<SubscribeSectionMutation$variables, 'blogId'>>();

  const onSubmit = (data: Omit<SubscribeSectionMutation$variables, 'blogId'>) => {
    const { firstName, email } = data;
    mutate({
      variables: {
        firstName,
        email,
        blogId: process.env.NEXT_PUBLIC_DEFAULT_BLOG_ID,
      },
    });
    reset();
  };

  return (
    <BaseSubscribeSection
      mx="auto"
      mb="5rem"
      p="4rem"
      w={{ xs: '90%', sm: '80%', md: '70%', lg: '60%' }}
      maxWidth="40rem"
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <H3 mb="1rem">Get latest posts</H3>
        <H4 my="1rem">Get my latest post every week. No spam, unsubscribe at any time.</H4>
        <Row
          flexDirection={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'center', md: 'flex-end' }}
        >
          <InputGroup mr="1rem" w="100%">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              autoComplete="first name"
              {...register('firstName', { required: true })}
            />
            {errors.firstName && <ErrorText>{errors.firstName.message}</ErrorText>}
          </InputGroup>

          <InputGroup mr="1rem" w="100%">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              autoComplete="email"
              {...register('email', { pattern: /^.+@.+$/, required: true })}
            />
            {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
          </InputGroup>
          <GradientButton
            w={{ xs: '100%', md: 'auto' }}
            px="1rem"
            py="0.5rem"
            mt={{ xs: '2rem', md: 'auto' }}
            mb={{ xs: '0', md: '0.5rem' }}
            mr={{ xs: '1rem', md: '0' }}
            type="submit"
          >
            {loading ? <Loading size={24} /> : 'Subscribe'}
          </GradientButton>
        </Row>
      </Form>
    </BaseSubscribeSection>
  );
};

export default SubscribeSection;
