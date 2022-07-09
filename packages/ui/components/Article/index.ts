import styled, { x } from '@xstyled/styled-components';

import { H1 } from '../Typography';

export const Header = styled(x.div)`
  width: 100%;
`;

export const Title = styled(H1)`
  font-weight: 600;
  text-align: center;
`;

export const Back = styled(x.div)`
  display: flex;
  margin-right: auto;
  cursor: pointer;
`;

export const ArticleBody = styled(x.article)`
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
`;

export const Body = styled(x.div)`
  display: flex;
`;

export const Content = styled(x.div)`
  display: flex;
  flex-direction: column;
`;
