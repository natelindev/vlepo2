import { css } from '@xstyled/styled-components';

import { BaseImage, ImageContainer, ImageOverlay, Transparent } from './style';

type ImageProps = {
  src?: string | null;
  filter?: string | null;
  textShadow?: string | null;
  width?: string | number;
  height?: string | number;
} & React.ComponentProps<typeof ImageContainer> &
  Omit<React.ComponentProps<typeof BaseImage>, 'width' | 'height' | 'src'>;

const Image = (props: ImageProps) => {
  const {
    src,
    variant,
    unoptimized,
    priority,
    loading,
    quality,
    objectFit,
    objectPosition,
    loader,
    children,
    filter,
    borderRadius,
    className,
    width,
    height,
    textShadow,
    ...rest
  } = props;
  return (
    <ImageContainer
      w={width}
      h={height}
      borderRadius={borderRadius}
      color={src ? 'whiteText' : 'text'}
      textShadow={textShadow}
      {...rest}
    >
      {src ? (
        <BaseImage
          src={src}
          className={className}
          unoptimized={unoptimized}
          priority={priority}
          loading={loading}
          quality={quality}
          objectFit={objectFit}
          objectPosition={objectPosition}
          loader={loader}
          css={css`
            border-radius: ${borderRadius};
            filter: ${filter};
          `}
          variant={variant}
          layout="fill"
        />
      ) : (
        <Transparent />
      )}
      {children && <ImageOverlay>{children}</ImageOverlay>}
    </ImageContainer>
  );
};

export default Image;
