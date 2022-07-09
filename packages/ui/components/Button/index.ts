import { match } from 'ts-pattern';

import styled, { x } from '@xstyled/styled-components';

export type ButtonBaseProps = {
  variant?: 'small' | 'medium' | 'large';
  children?: React.ReactNode;
};

const Button = styled(x.button)<ButtonBaseProps>`
  cursor: pointer;
  font-weight: ${(props) => props.theme.fontWeights.regular};
  text-align: center;
  vertical-align: middle;
  user-select: none;
  background-color: transparent;
  border: none;
  border-radius: ${(props) => `${props.theme.radii.default}`};
  line-height: ${(props) => props.theme.lineHeights.content};

  padding: ${(props) =>
    match(props.variant)
      .with('small', () => '0.25rem 0.5rem')
      .with('medium', () => '0.375rem 0.75rem')
      .with('large', () => '0.625rem 1rem')
      .otherwise(() => '0.375rem 0.75rem')};

  font-size: ${(props) =>
    match(props.variant)
      .with('small', () => '0')
      .with('medium', () => '1')
      .with('large', () => '2')
      .otherwise(() => '1')};

  &:hover {
    text-decoration: none;
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    cursor: default;
  }

  &:disabled svg {
    opacity: 0.6;
  }
`;

export const OauthButtonSection = styled(x.div)`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  justify-content: flex-start;
  display: flex;
  flex-wrap: wrap;
`;

export const OauthButton = styled(Button)`
  display: flex;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0.25rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  margin-left: 0.5rem;
  &:last-of-type {
    margin-right: 0.5rem;
  }
  background-color: ${(props) => props.theme.colors.bgMuted};
  border-radius: 0.25rem;
  transition: all 0.3s ease-in-out;
  box-shadow: ${(props) => props.theme.shadows.card};
  align-items: center;
  justify-content: center;
  z-index: ${(props) => props.theme.zIndices.gradientButton};

  &:hover {
    box-shadow: ${(props) => props.theme.shadows.oauthButton};
  }
`;

export default Button;
