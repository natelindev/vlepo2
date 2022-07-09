import NextImage from 'next/image';
import { match } from 'ts-pattern';

import styled, { x } from '@xstyled/styled-components';

export const ImageContainer = styled(x.div)`
  display: flex;
  > span {
    &:first-of-type {
      position: unset !important;
    }

    width: 100% !important;
  }
`;

type BaseImageProps = { variant?: 'top' | 'left' | 'right' | 'bottom' };
export const BaseImage = styled(NextImage).withConfig({
  shouldForwardProp: (propName: string | number) => propName !== 'borderRadius',
})<BaseImageProps>`
  width: 100% !important;
  position: relative !important;
  height: unset !important;
  border-radius: ${(props) =>
    match(props.variant)
      .with('top', () => `${props.theme.radii.default} ${props.theme.radii.default} 0 0`)
      .with('bottom', () => `0 0 ${props.theme.radii.default} ${props.theme.radii.default}`)
      .with('left', () => `${props.theme.radii.default} 0 0 ${props.theme.radii.default}`)
      .with('right', () => `0 ${props.theme.radii.default} ${props.theme.radii.default} 0`)
      .otherwise(() => `0 0 0 0`)};
`;

export const Transparent = styled(x.div)`
  width: 100%;
  position: relative;
`;

export const ImageOverlay = styled(x.div)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 1.25rem;
  color: ${(props) => props.color};
  text-decoration: none;
`;
