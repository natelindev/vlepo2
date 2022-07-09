import styled, { x } from '@xstyled/styled-components';

export const SloganContainer = styled(x.div)`
  display: flex;
  justify-content: center;
  margin-top: 3rem;
  margin-bottom: 6rem;
  margin-left: auto;
  margin-right: auto;
  color: ${(props) => props.theme.colors.text};
`;

export const Slogan = styled(x.h4)`
  color: ${(props) => props.theme.colors.text};
`;
