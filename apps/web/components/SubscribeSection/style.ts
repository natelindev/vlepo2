import styled, { x } from '@xstyled/styled-components';

export const BaseSubscribeSection = styled(x.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.colors.bgSecondary};
  box-shadow: ${(props) => props.theme.shadows.card};
  border-radius: ${(props) => props.theme.radii.default};
`;
