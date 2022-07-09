import { Card, H3, ImageOverlay } from 'ui';

import styled, { x } from '@xstyled/styled-components';

export const Abstract = styled(x.div)`
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
  margin-top: 1rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease-in-out;
  opacity: 0;
`;

export const ProjectCardTitle = styled(H3)`
  padding: 0;
  margin-left: auto;
  margin-right: auto;
  font-weight: ${(props) => props.theme.fontWeights.semiBold};
  font-family: ${(props) => props.theme.fonts.heading};
  transition: all 0.3s ease-in-out;
`;

export const IndexImageOverlay = styled(ImageOverlay)`
  top: 25%;
  transition: all 0.3s ease-in-out;
`;

export const BaseProjectCard = styled(Card)`
  flex-direction: column;
  border-radius: ${(props) => props.theme.radii.default};
  box-shadow: ${(props) => props.theme.shadows.card};
  background-color: ${(props) => props.theme.colors.bgSecondary};

  ${ProjectCardTitle} {
    margin-top: auto;
    margin-bottom: auto;
  }

  @media only screen and (min-width: xs) {
    &:hover {
      ${Abstract} {
        opacity: 1;
      }

      ${ProjectCardTitle} {
        margin-top: unset;
        margin-bottom: unset;
      }

      ${IndexImageOverlay} {
        top: 0;
      }
    }
  }
`;
