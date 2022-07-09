import { Favorite } from '@styled-icons/material-outlined';
import styled, { x } from '@xstyled/styled-components';

export const BaseFootbar = styled(x.div)`
  display: flex;
  justify-content: space-around;
  margin-top: 3rem;
  margin-bottom: 2rem;
`;

export const CenteredText = styled(x.div)`
  color: ${(props) => props.theme.colors.muted};
  display: flex;
  justify-content: center;
`;

export const LoveIcon = styled(Favorite)`
  color: ${(props) => props.theme.colors.error};
  margin-top: 0.2rem;
  margin-left: 0.2rem;
  margin-right: 0.2rem;
`;

export const BottomText = styled(x.div)`
  color: ${(props) => props.theme.colors.muted};
`;
