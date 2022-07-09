import { match } from 'ts-pattern';

import styled, { x } from '@xstyled/styled-components';

import { BaseNavLink } from '../NavLink/style';

export type BaseDropDownProps = {
  show?: boolean;
  variant?: 'left' | 'right';
};

export const BaseDropdownMenu = styled(x.div)<BaseDropDownProps>`
  left: ${(props) =>
    match(props.variant)
      .with('left', () => '5px')
      .otherwise(() => 'auto')};
  right: ${(props) =>
    match(props.variant)
      .with('right', () => '5px')
      .otherwise(() => 'auto')};
  position: absolute;
  top: 100%;
  z-index: ${(props) => props.theme.zIndices.dropDownMenu};
  display: ${(props) => (props.show ? 'flex' : 'none')};
  flex-direction: column;
  float: left;
  min-width: 10rem;
  padding: 0.3rem;
  margin: 0.125rem 0 0;
  font-size: 1rem;
  color: ${(props) => props.theme.colors.bgSecondary};
  text-align: left;
  list-style: none;
  background-color: ${(props) => props.theme.colors.bgSecondary};
  background-clip: padding-box;
  box-shadow: ${(props) => props.theme.shadows.dropdown};
  border-radius: ${(props) => `${props.theme.radii.default}`};

  > ${BaseNavLink} {
    box-shadow: none;
  }
`;

export const BaseDropdown = styled.div`
  cursor: pointer;
  margin-top: auto;
  margin-bottom: auto;
  position: relative;
  display: inline-block;
`;

export const DropdownToggle = styled(x.div)`
  white-space: nowrap;
  cursor: pointer;

  &::after {
    display: inline-block;
    margin-left: 0.255em;
    vertical-align: 0.255em;
    content: '';
    border-top: 0.3em solid;
    border-right: 0.3em solid transparent;
    border-bottom: 0;
    border-left: 0.3em solid transparent;
  }

  &:empty::after {
    margin-left: 0;
  }
`;
