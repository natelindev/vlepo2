import { a } from 'react-spring';
import StyledModal from 'styled-modal';

import { Close } from '@styled-icons/material-outlined';
import styled, { x } from '@xstyled/styled-components';

export const BaseStyledModal = styled(StyledModal)<React.ComponentProps<typeof BaseAnimatedModal>>`
  border-radius: 0.5rem;
  background-color: bgSecondary;
`;

export const ModalContainer = styled(x.div)`
  height: 100%;
  width: 100%;
  top: 0px;
  left: 0px;
  overflow: hidden auto;
  position: fixed;
  z-index: 999;
  background: rgba(0, 0, 0, 0.5);
`;

export const ModalOverScroll = styled(x.div)`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
`;

export const BaseAnimatedModal = styled(a(x.div)).withConfig({
  shouldForwardProp: (propName) =>
    propName !== 'isToggled' && propName !== 'isClientSide' && propName !== 'theme',
})`
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  height: auto;
  background-color: bgSecondary;
  margin-top: auto;
  margin-bottom: auto;
`;

export const CloseIcon = styled(Close)`
  margin-top: -2rem;
  margin-bottom: auto;
  margin-left: auto;
  margin-right: -2rem;
`;
