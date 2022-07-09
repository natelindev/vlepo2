import styled, { x } from '@xstyled/styled-components';

export const inlineCode = styled(x.code)`
  border-radius: ${(props) => props.theme.radii.default};
  background-color: ${(props) => props.theme.colors.highlight};
`;
