import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useRelayEnvironment } from 'relay-hooks';
import { ConnectionHandler, fetchQuery, graphql } from 'relay-runtime';
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
  Row,
  Select,
  TextArea,
  useToasts,
} from 'ui';

import { ContainerClient } from '@azure/storage-blob';
import { Check } from '@styled-icons/material-outlined';

import { CreatePostModal_ImageUpload_Query } from '../../../__generated__/CreatePostModal_ImageUpload_Query.graphql';
import {
  CreatePostInput,
  CreatePostModal_Mutation,
} from '../../../__generated__/CreatePostModal_Mutation.graphql';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import ImageGrid from '../../ImageGrid';
import ImageUpload from '../../ImageUpload';
import { HeaderImage } from './style';

export type ImageToBeUploaded = { id: string; file: File };

type CreatePostModalProps = BaseModalProps;
const CreatePostModal = (props: CreatePostModalProps) => {
  const { open, onClose } = props;
  const { addToast } = useToasts();
  type CreatePostInputType = Omit<CreatePostInput, 'tags' | 'images'> & {
    tags?: string;
    images?: string;
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreatePostInputType>();

  const [headerImage, setHeaderImage] = useState<ImageToBeUploaded | null>(null);

  const [images, setImages] = useState<ImageToBeUploaded[]>([]);

  const env = useRelayEnvironment();
  const currentUser = useCurrentUser();

  const dashboard_postConnectionId = ConnectionHandler.getConnectionID(
    currentUser?.id as string,
    'Entity_postsConnection',
  );

  const index_postConnectionId = ConnectionHandler.getConnectionID(
    process.env.NEXT_PUBLIC_DEFAULT_BLOG_ID,
    'Index_postsConnection',
  );

  const onSubmit = async (data: CreatePostInputType) => {
    const { tags, ...rest } = data;
    // get SAS URL

    const result = await fetchQuery<CreatePostModal_ImageUpload_Query>(
      env,
      graphql`
        query CreatePostModal_ImageUpload_Query {
          imageUploadURL
        }
      `,
      {},
      {},
    ).toPromise();

    if (!result || !result.imageUploadURL) {
      addToast({
        message: 'failed to get image upload url',
        type: 'error',
      });
      reset();
    } else {
      // upload images
      const containerClient = new ContainerClient(result.imageUploadURL);

      try {
        const results = await Promise.all(
          [...images, headerImage]
            .filter((i): i is ImageToBeUploaded => i !== null)
            .map(async (i) => {
              const blockBlobClient = containerClient.getBlockBlobClient(
                `${i.id}.${i.file.name.split('.').pop()}`,
              );
              return blockBlobClient.uploadData(i.file);
            }),
        );

        const haveError = results.reduce((prev, curr) => {
          if (curr._response.status !== 201) {
            return true || prev;
          }
          return prev;
        }, false);

        // then create post with uploaded images
        if (!haveError) {
          mutate({
            variables: {
              connections: [dashboard_postConnectionId, index_postConnectionId],
              input: {
                ...rest,
                images:
                  [...images, headerImage]
                    .filter((i): i is ImageToBeUploaded => Boolean(i))
                    .map((i) => ({
                      id: i.id,
                      extension: i.file.name.split('.').pop()!,
                    })) ?? [],
                tags:
                  tags && tags.length > 0 ? tags.split(',').map((t) => ({ name: t.trim() })) : [],
              },
            },
          });
        }
      } catch (error) {
        addToast({
          message: `failed to upload ${(error as Error).message}`,
          type: 'error',
        });
        reset();
      }
    }
  };

  const onModalClose = () => {
    onClose?.();
    reset();
    setHeaderImage(null);
    setImages([]);
  };

  const [mutate, { loading }] = useMutation<CreatePostModal_Mutation>(
    graphql`
      mutation CreatePostModal_Mutation($connections: [ID!]!, $input: CreatePostInput!) {
        createPost(input: $input) {
          createPostEdge @prependEdge(connections: $connections) {
            cursor
            node {
              id
              ...PostCard_post
              ...ArticleCard_post
            }
          }
        }
      }
    `,
    {
      onCompleted: () => {
        addToast({
          message: 'create post succeed',
          type: 'success',
        });
        onModalClose();
      },
      onError: (error) => {
        addToast({
          message: `create post failed, ${error}`,
          type: 'error',
        });
        onModalClose();
      },
    },
  );

  const onImagesSelect = (selectedImages: ImageToBeUploaded[]) => {
    if (selectedImages && selectedImages.length > 0) {
      setImages([...images, ...selectedImages]);
    }
  };

  const onHeaderImageSelect = (selectedImages: ImageToBeUploaded[]) => {
    if (selectedImages && selectedImages.length > 0) {
      setHeaderImage(selectedImages[0]);
    }
  };

  useEffect(() => setValue('headerImageId', headerImage?.id), [setValue, headerImage]);

  const { ref, ...visibilityRest } = register('visibility');

  return (
    <BaseModal
      w={{ _: '90%', sm: '50%' }}
      open={open}
      onClose={onModalClose}
      closeOnOutsideClick={false}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        {headerImage && (
          <HeaderImage
            src={URL.createObjectURL(headerImage.file)}
            layout="responsive"
            width={2}
            height={1}
          />
        )}
        <InputGroup>
          <Label>Title</Label>
          <Input autoComplete="title" {...register('title')} />
          {errors.title && <ErrorText>{errors.title.message}</ErrorText>}
        </InputGroup>
        <Row justifyContent="space-between">
          <InputGroup>
            <Label>visibility</Label>
            <Select
              {...visibilityRest}
              innerRef={ref}
              options={['PUBLISHED', 'PRIVATE', 'DRAFT'].map((v) => ({ key: v, value: v }))}
            />
            {errors.visibility && <ErrorText>{errors.visibility.message}</ErrorText>}
          </InputGroup>
          <InputGroup mx="1rem">
            <Label>Header Image</Label>
            <ImageUpload onImageSelect={onHeaderImageSelect} />
            <Input type="hidden" autoComplete="headerImageId" {...register('headerImageId')} />
            {errors.headerImageId && <ErrorText>{errors.headerImageId.message}</ErrorText>}
          </InputGroup>
          <InputGroup>
            <Label>Tags</Label>
            <Input autoComplete="tags" {...register('tags')} />
            {errors.tags && <ErrorText>{errors.tags.message}</ErrorText>}
          </InputGroup>
        </Row>
        <Row>
          <InputGroup>
            <Label>Images</Label>
            <ImageUpload multiple onImageSelect={onImagesSelect} />
            {errors.tags && <ErrorText>{errors.tags.message}</ErrorText>}
          </InputGroup>
        </Row>
        {images && <ImageGrid images={images} />}
        <InputGroup>
          <Label>Content</Label>
          <TextArea h="20rem" autoComplete="content" {...register('content')} />
          {errors.content && <ErrorText>{errors.content.message}</ErrorText>}
        </InputGroup>
        <GradientButton my="0.5rem" type="submit">
          {loading ? <Loading size={24} /> : <Check size={24} />}
        </GradientButton>
      </Form>
    </BaseModal>
  );
};

export default CreatePostModal;
