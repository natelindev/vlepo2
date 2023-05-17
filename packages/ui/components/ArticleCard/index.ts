import Image from 'next/legacy/image';

import styled, { x } from '@xstyled/styled-components';

import Card from '../Card';
import { Row } from '../Layout';
import { H3 } from '../Typography';

export const Abstract = styled(x.div)`
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

export const ArticleCardTitle = styled(H3)`
  padding: 0;
  margin-block-start: 0;
  margin-block-end: 0.5rem;
  font-weight: ${(props) => props.theme.fontWeights.semiBold};
  font-family: ${(props) => props.theme.fonts.heading};
`;

export const ArticleDate = styled(x.div)`
  margin-right: auto;
`;

export const ArticleCardFooter = styled(x.div)`
  display: flex;
  height: auto;
  flex-wrap: wrap;
  margin-left: 1rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
`;

export const AuthorProfileImageContainer = styled(x.div)`
  margin-top: 0.5rem;
  margin-left: 0.2rem;
  margin-right: 0.5rem;
`;

export const AuthorName = styled(Row)`
  font-size: 0.9rem;
`;

export const AuthorProfileImage = styled(Image)`
  object-fit: contain;
`;

export const AuthorSection = styled(Row)`
  justify-content: flex-start;
  align-items: center;
`;

export const BaseArticleCard = styled(Card)`
  flex-direction: column;
  border-radius: ${(props) => `${props.theme.radii.default}`};
  box-shadow: ${(props) => props.theme.shadows.card};
  color: ${(props) => props.theme.colors.text};
  background-color: ${(props) => props.theme.colors.bgSecondary};
`;
