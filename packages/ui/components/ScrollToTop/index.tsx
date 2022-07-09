/* eslint-disable no-nested-ternary */

import { KeyboardArrowUp } from '@styled-icons/material-outlined';
import styled, { css, x } from '@xstyled/styled-components';

import { useScrollPosition } from '../../hooks/useScrollPosition';

const animation = css`
  @keyframes fadeOutRight {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }

  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

export type ScrollTopProps = {
  show: boolean;
  up: boolean;
};

export const BaseScrollToTop = styled(x.div).withConfig({
  shouldForwardProp: (propName: string | number) => propName !== 'up' && propName !== 'show',
})<ScrollTopProps>`
  ${animation}

  position: fixed;
  right: 0;
  bottom: 1rem;
  width: 2.2rem;
  height: 2.2rem;
  text-align: center;
  color: #fff;
  background-color: rgba(90, 92, 105, 0.3);
  backdrop-filter: saturate(180%) blur(5px);

  border-top-left-radius: 0.25rem;
  border-bottom-left-radius: 0.25rem;

  z-index: ${(props) => props.theme.zIndices.scrollToTop};
  transition: background-color 0.3s ease-in-out;
  opacity: ${(props) => (props.show ? 1 : 0)};
  animation: ${(props) => (props.show ? 'fadeInRight' : props.up ? 'fadeOutRight' : 'none')} 1s 1
    cubic-bezier(0.77, 0, 0.175, 1);

  &:focus,
  &:hover {
    color: white;
  }

  &:hover {
    background: rgba(90, 92, 105, 0.5);
  }

  & i {
    font-weight: 800;
  }
`;

const ScrollToTop = () => {
  const [scrollPosition, speed] = useScrollPosition();
  const up = speed < 0;
  const show = scrollPosition > 100;
  return (
    <BaseScrollToTop
      up={up}
      show={show}
      onClick={() => {
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      }}
    >
      <KeyboardArrowUp />
    </BaseScrollToTop>
  );
};

export default ScrollToTop;
