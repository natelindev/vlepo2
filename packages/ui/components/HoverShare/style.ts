import { a } from 'react-spring';

import styled, { x } from '@xstyled/styled-components';

import { BaseScrollToTop } from '../ScrollToTop';

export const ShareToggler = styled(BaseScrollToTop)`
  bottom: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ShareContainer = styled(a(x.div))`
  margin-top: 2rem;
  position: fixed;
  right: 0;
  bottom: 5.75rem;
  display: flex;

  max-width: 2.2rem;

  flex-direction: column;
  margin-left: 1.75rem;
  margin-right: auto;

  > button {
    margin-bottom: 0.4rem;
  }

  *:focus {
    border: none;
    outline: none;
  }

  svg {
    border-radius: ${(props) => `${props.theme.radii.default}`};
  }

  z-index: ${(props) => props.theme.zIndices.hoverShare};
`;
