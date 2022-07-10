import Image from 'next/image';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation } from 'relay-hooks';
import { graphql } from 'relay-runtime';
import {
  BaseModal,
  BaseModalProps,
  ErrorText,
  Form,
  GradientButton,
  Input,
  InputGroup,
  Label,
  Loading,
  OauthButton,
  OauthButtonSection,
  usePopupWindow,
  useToasts,
} from 'ui';

import { Check } from '@styled-icons/material-outlined';

import {
  LoginInput as LoginInputType,
  LoginModal_Mutation,
  LoginModal_Mutation$data,
} from '../../../__generated__/LoginModal_Mutation.graphql';

type LoginModalProps = BaseModalProps;
const LoginModal = (props: LoginModalProps) => {
  const { open, onClose } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginInputType>();
  const router = useRouter();

  const onSubmit = (data: LoginInputType) => {
    mutate({
      variables: {
        input: data,
      },
    });
  };

  const onModalClose = () => {
    onClose?.();
    reset();
  };

  const { addToast } = useToasts();

  const [mutate, { loading }] = useMutation<LoginModal_Mutation>(
    graphql`
      mutation LoginModal_Mutation($input: LoginInput!) {
        login(input: $input) {
          ok
          error
        }
      }
    `,
    {
      onCompleted: ({ login }: LoginModal_Mutation$data) => {
        if (login?.ok) {
          addToast({
            message: 'Login succeed',
            type: 'success',
          });
          setTimeout(() => router.reload(), 1000);
          onModalClose();
        } else if (login?.error) {
          addToast({
            message: `Login failed, ${login?.error}`,
            type: 'error',
          });
        }
      },
      onError: (error) => {
        addToast({
          message: `Login failed, ${error}`,
          type: 'error',
        });
        onClose?.();
        reset();
      },
    },
  );

  const { createWindow: openOauthWindow } = usePopupWindow();
  return (
    <BaseModal w={{ xs: '90%', sm: '50%', md: '25%' }} open={open} onClose={onModalClose}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup>
          <Label>Email</Label>
          <Input autoComplete="email" {...register('email')} />
          {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
        </InputGroup>
        <InputGroup>
          <Label>Password</Label>
          <Input autoComplete="current-password" type="password" {...register('password')} />
        </InputGroup>
        {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
        <OauthButtonSection>
          {process.env.NEXT_PUBLIC_SUPPORTED_OAUTH_PROVIDERS &&
            process.env.NEXT_PUBLIC_SUPPORTED_OAUTH_PROVIDERS.split(',').map((provider) => (
              <OauthButton
                key={provider}
                type="button"
                onClick={() =>
                  openOauthWindow(
                    `/api/connect/${provider}`,
                    `User Oauth`,
                    provider === 'reddit' ? 1000 : 400,
                    600,
                  )
                }
              >
                <Image src={`/images/logo/${provider}.svg`} height={24} width={24} layout="fixed" />
              </OauthButton>
            ))}
        </OauthButtonSection>
        <GradientButton my="0.5rem" type="submit">
          {loading ? <Loading size={24} /> : <Check size={24} />}
        </GradientButton>
      </Form>
    </BaseModal>
  );
};

export default LoginModal;
