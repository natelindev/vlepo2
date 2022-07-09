import { match, Pattern } from 'ts-pattern';

import styled, { x } from '@xstyled/styled-components';

import { isBright } from '../../util/colorUtil';

type BaseTagProps = {
  mainColor?: string | null;
  secondaryColor?: string | null;
};

export const BaseTag = styled(x.a)<BaseTagProps>`
  color: ${(props) => props.mainColor ?? props.theme.colors.muted};

  font-size: ${(props) => props.theme.fontSizes.sm};

  margin-top: 0.2rem;
  margin-bottom: auto;

  margin-left: 0.3rem;
  margin-right: 0.3rem;

  text-decoration: none;
  padding-top: 0.1rem;
  padding-bottom: 0.1rem;
  padding-left: 0.2rem;
  padding-right: 0.2rem;
  border: 1px solid ${(props) => props.mainColor ?? props.theme.colors.muted};
  border-radius: 0.2rem;

  transition: all 0.1s ease-in-out;

  &:hover {
    color: ${(props) =>
      match(props)
        .with({ mainColor: Pattern.string, secondaryColor: Pattern.string }, (p) =>
          isBright(p.mainColor) && isBright(p.mainColor)
            ? p.theme.colors.blackText
            : p.theme.colors.whiteText,
        )
        .with({ mainColor: Pattern.string }, (p) =>
          isBright(p.mainColor) ? p.theme.colors.blackText : p.theme.colors.whiteText,
        )
        .otherwise(() => props.theme.colors.bg)};

    ${(props) =>
      match(props)
        .with(
          { mainColor: Pattern.string, secondaryColor: Pattern.string },
          (p) =>
            `background-image: linear-gradient(45deg, ${p.mainColor} 10%, ${p.secondaryColor} 90%);`,
        )
        .with({ mainColor: Pattern.string }, (p) => `background-color: ${p.mainColor};`)
        .otherwise(() => `background-color: ${props.theme.colors.text};`)};
  }

  &:focus,
  &.focus {
    box-shadow: ${(props) => props.theme.shadows.card};
  }

  &.disabled,
  &:disabled {
    color: ${(props) => props.theme.colors.text};
    background-color: transparent;
  }

  &:not(:disabled):not(.disabled):active {
    color: ${(props) => props.theme.colors.bg};
    background-color: ${(props) => props.theme.colors.text};
    border-color: ${(props) => props.theme.colors.text};
  }

  &:not(:disabled):not(.disabled):active:focus {
    box-shadow: ${(props) => props.theme.shadows.card};
  }

  z-index: ${(props) => props.theme.zIndices.tags};
`;
