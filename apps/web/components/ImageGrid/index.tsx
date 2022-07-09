import styled, { x } from '@xstyled/styled-components';

import { ImageToBeUploaded } from '../Modals/CreatePostModal/index.jsx';
import ImageCell from './ImageCell';

type ImageGridProps = {
  images: ImageToBeUploaded[];
};

const BaseImageGrid = styled(x.div)`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-gap: 1rem;
  align-items: center;
`;

const ImageGrid = (props: ImageGridProps) => {
  const { images } = props;

  return (
    <BaseImageGrid>
      {images.map((image, idx) => (
        <ImageCell key={image.id} image={image} idx={idx} />
      ))}
    </BaseImageGrid>
  );
};

export default ImageGrid;
