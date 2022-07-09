import Image from 'next/image';
import { match } from 'ts-pattern';

import styled, { x } from '@xstyled/styled-components';

export type CardImgProps = {
  variant?: 'top' | 'left' | 'right' | 'bottom';
};

export const CardImage = styled(Image)<CardImgProps>`
  border-radius: ${(props) =>
    match(props.variant)
      .with('top', () => `${props.theme.radii.default} ${props.theme.radii.default} 0 0`)
      .with('bottom', () => `0 0 ${props.theme.radii.default} ${props.theme.radii.default}`)
      .with('left', () => `${props.theme.radii.default} 0 0 ${props.theme.radii.default}`)
      .with('right', () => `0 ${props.theme.radii.default} ${props.theme.radii.default} 0`)
      .otherwise(
        () =>
          `${props.theme.radii.default} ${props.theme.radii.default} ${props.theme.radii.default} ${props.theme.radii.default}`,
      )};
`;

type BaseCardProps = { direction?: string };

export const BaseCard = styled(x.div).withConfig({
  shouldForwardProp: (propName: string | number | symbol) =>
    propName !== 'minWidth' &&
    propName !== 'maxWidth' &&
    propName !== 'minHeight' &&
    propName !== 'maxHeight',
})<BaseCardProps>`
  background-color: ${(props) => props.theme.colors.bgSecondary};
  border-radius: ${(props) => `${props.theme.radii.default}`};
  box-shadow: ${(props) => props.theme.shadows.card};
  display: flex;
  will-change: transform;

  ${CardImage} {
    filter: ${(props) => props.theme.colors.cardImageFilter};
  }
`;

export const CardBody = styled(x.div)`
  flex: 1 1 auto;
  min-height: 1px;
  padding: 1.25rem;
`;
