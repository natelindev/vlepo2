import { Row } from 'ui';

import styled, { x } from '@xstyled/styled-components';

type BaseCommentProps = { variant: 'profile' | 'post' };
export const BaseComment = styled(x.div)<BaseCommentProps>`
  &:hover {
    background-color: ${(props) =>
      props.variant === 'profile' ? props.theme.colors.bgMuted : props.theme.colors.bgSecondary};
  }
  background-color: ${(props) =>
    props.variant === 'profile' ? undefined : props.theme.colors.bgSecondary};
  box-shadow: ${(props) => props.theme.shadows.card};
  border-radius: ${(props) => `${props.theme.radii.default}`};
  overflow-x: hidden;
`;

type BaseCommentSectionProps = {
  variant: 'profile' | 'post';
};

export const BaseCommentSection = styled(x.div)<BaseCommentSectionProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-top: ${(props) =>
    props.variant === 'post' ? `2px solid ${props.theme.colors.highlight}` : 'none'};
`;

export const CommentContent = styled(Row)`
  margin-top: 1rem;
  flex-wrap: wrap;
  > div {
    word-break: break-word;
    overflow-x: scroll;
  }
`;

export const NewComment = styled(x.div)`
  display: flex;
  flex-direction: column;
  box-shadow: ${(props) => props.theme.shadows.card};
  border-radius: ${(props) => `${props.theme.radii.default}`};
  background-color: ${(props) => props.theme.colors.bgSecondary};
  width: 100%;
  height: auto;
  overflow: visible;
  margin-top: 1em;
  padding-top: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 0.5rem;
`;

export const MarkdownPowered = styled(x.div)`
  cursor: pointer;
  display: flex;
  transition: 0.2s color ease-in-out;
  &:hover {
    color: ${(props) => props.theme.colors.link};
  }
`;
