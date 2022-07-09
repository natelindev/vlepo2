import Image from 'next/image';
import { useCallback } from 'react';
import { H5, ImageOverlay, useToasts } from 'ui';

import styled from '@xstyled/styled-components';

import { ImageToBeUploaded } from '../Modals/CreatePostModal';

type BaseImageCellProps = { idx: number };
const BaseImageCell = styled.div<BaseImageCellProps>`
  position: relative;
  word-break: break-word;
`;

const BaseImage = styled(Image)`
  border-radius: ${(props) => props.theme.radii.default};
  filter: ${(props) => props.theme.colors.cardImageFilter};
`;

type ImageCellProps = { image: ImageToBeUploaded; idx: number };

const ImageCell = (props: ImageCellProps) => {
  const { image, idx, ...rest } = props;
  const { addToast } = useToasts();

  const copyImageMarkdown = useCallback(() => {
    if (navigator.clipboard && image) {
      navigator.clipboard.writeText(
        `![${image.file.name}](/user-images/${image.id}.${image.file.name.split('.').pop()})`,
      );
    }
    addToast({
      message: `${image.file.name} markdown copied`,
    });
  }, [image, addToast]);

  return (
    <BaseImageCell onClick={copyImageMarkdown} idx={idx} {...rest}>
      <BaseImage
        layout="fixed"
        objectFit="cover"
        width="150px"
        height="150px"
        src={URL.createObjectURL(image.file) ?? ''}
      />
      <ImageOverlay>
        <H5>{image.file.name}</H5>
      </ImageOverlay>
    </BaseImageCell>
  );
};

export default ImageCell;
