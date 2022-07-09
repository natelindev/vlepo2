import { Card } from 'ui';

import styled, { x } from '@xstyled/styled-components';

export const DashboardCard = styled(Card)`
  padding: 1rem;
`;

export const Container = styled(x.div)`
  display: flex;
`;

export const DashboardMain = styled(x.div)`
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  width: 100%;
  margin-right: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

export const Numbers = styled(x.div)`
  display: flex;
  font-size: ${(props) => props.theme.fontSizes.xl};
  font-weight: ${(props) => props.theme.fontWeights.semiBold};
`;

export const NumbersLabel = styled(x.div)`
  color: ${(props) => props.theme.colors.muted};
  font-weight: ${(props) => props.theme.fontWeights.regular};
  font-size: ${(props) => props.theme.fontSizes.lg};
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 1rem;
`;
