import React from 'react';

import styled, { x } from '@xstyled/styled-components';

export const AnimatedLink = styled(x.a)`
  position: relative;
  color: link;
  text-decoration: none !important;

  &:hover {
    color: link;
    &:before {
      visibility: visible;
      text-decoration: none;
      transform: scaleX(1);
    }
  }

  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    bottom: -2px;
    left: 0;
    background-color: link;
    visibility: hidden;
    transform: scaleX(0);
    transition: all 0.3s ease-in-out 0s;
  }
`;

export const AnimatedExternalLink = (props: React.ComponentProps<typeof AnimatedLink>) => {
  return <AnimatedLink target="_blank" rel="noopener noreferrer" {...props} />;
};

export const OverlayLink = styled(x.a)`
  font-size: 0;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: cardLink;
`;

export const OverlayExternalLink = React.forwardRef(
  (props: React.ComponentProps<typeof OverlayLink>, ref: React.Ref<HTMLDivElement>) => {
    const { ...rest } = props;
    return <OverlayLink ref={ref} target="_blank" rel="noopener noreferrer" {...rest} />;
  },
);

OverlayExternalLink.displayName = 'OverlayExternalLink';
