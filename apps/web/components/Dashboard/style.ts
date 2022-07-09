import styled, { x } from '@xstyled/styled-components';

export const BasePostCard = styled(x.div)`
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
  margin-right: 1rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 1.5rem 2rem;

  border-radius: ${(props) => props.theme.radii.default};
  box-shadow: ${(props) => props.theme.shadows.card};
  color: ${(props) => props.theme.colors.text};
  background-color: ${(props) => props.theme.colors.bgSecondary};
  z-index: ${(props) => props.theme.zIndices.sidebar};
`;

export const Title = styled(x.a)`
  text-decoration: none;
  font-weight: ${(props) => props.theme.fontWeights.semiBold};
  margin: 0;
  padding: 0;
  color: ${(props) => props.theme.colors.link};
  font-size: ${(props) => props.theme.fontSizes.lg};
`;

export const Time = styled(x.h5)`
  margin: 0;
  padding: 0;
  font-size: ${(props) => props.theme.fontSizes.sm};
`;
