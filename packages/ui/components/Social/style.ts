import styled, { x } from '@xstyled/styled-components';

export const SocialLink = styled(x.a)`
  width: 2.5rem;
  height: 2.5rem;
`;

export const SocialLinkWrapper = styled(x.div)`
  display: flex;
  align-items: center;
  transition: all 0.4s ease-out;
  > ${SocialLink} {
    margin-left: 0.2rem;
    margin-right: 0.2rem;
  }
`;

export const SocialSvg = styled(x.svg)`
  width: 2.5rem;
  height: 2.5rem;
`;

export const SocialGroupInnerCircle = styled(x.circle)`
  fill: transparent;
  transition: all 0.2s;

  ${SocialLink}:hover & {
    fill: currentColor;
    transition: all 0.45s;
  }

  ${SocialSvg}:hover & {
    fill: currentColor;
    transition: all 0.45s;
  }
`;

export const SocialGroupOutline = styled(x.circle)`
  stroke: ${(props) => props.theme.colors.text};
  transform-origin: 50% 50%;
  transition: all 0.2s;

  ${SocialLink}:hover & {
    stroke: currentColor;
    transform: scale(1.1);
    transition: all 0.45s;
  }

  ${SocialSvg}:hover & {
    stroke: currentColor;
    transform: scale(1.1);
    transition: all 0.45s;
  }
`;

export const SocialGroupIcon = styled(x.path)`
  fill: ${(props) => props.theme.colors.text};

  ${SocialSvg}:hover & {
    fill: currentColor;
  }
  transition: all 0.45s;
`;
