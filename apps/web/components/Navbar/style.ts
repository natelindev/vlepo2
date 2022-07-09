import { a } from 'react-spring';

import styled, { x } from '@xstyled/styled-components';

import SearchBar from '../SearchBar';

export const BaseNavbar = styled(x.nav)`
  display: flex;
  position: fixed;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex-flow: row nowrap;
  box-shadow: ${(props) => props.theme.shadows.navbar};
  background-color: ${(props) => props.theme.colors.navbar};
  backdrop-filter: saturate(180%) blur(5px);
  height: ${(props) => props.theme.sizes.navbar};
  z-index: ${(props) => props.theme.zIndices.navbar};
`;

export const NavBrand = styled(x.a)`
  padding-top: 0.3125rem;
  padding-bottom: 0.3125rem;
  font-size: 1.25rem;
  line-height: inherit;
  white-space: nowrap;
  text-decoration: none;
  color: ${(props) => props.theme.colors.text};
`;

export const NavbarCollapse = styled(x.div)`
  flex-basis: 100%;
  flex-grow: 1;
`;

export const LeftNavCollapse = styled(NavbarCollapse)`
  margin-left: 0.5rem;
  flex-grow: 0;
  flex-basis: auto;
  margin-top: auto;
  margin-bottom: auto;
  @media only screen and (max-width: sm) {
    position: absolute;
    flex-direction: column;
    top: 100%;
    height: auto;
  }
`;

export const RightNavCollapse = styled(NavbarCollapse)`
  flex-grow: 0;
`;

export const NavbarNav = styled(x.div)`
  display: flex;
  padding-left: 0;
  margin-bottom: 0;
  list-style: none;
  height: 100%;
`;

export const NavItem = styled(x.li)`
  cursor: pointer;
  text-decoration: none;
`;

export const ModeSwitch = styled(x.div)`
  cursor: pointer;
  text-decoration: none;
`;

export const NavSearchBar = styled(SearchBar)`
  margin-left: auto;
  margin-right: 0.5rem;
`;

export const NavbarToggler = styled(x.div)`
  width: 1.8rem;
  height: 1.8rem;
  max-width: 1.8rem;
  max-height: 1.8rem;
  min-width: 1.8rem;
  min-height: 1.8rem;
  margin-top: 1rem;
  margin-left: 1rem;
  margin-right: 0;
  margin-bottom: auto;
`;

export const TogglerBar = styled(a(x.div))`
  background-color: ${(props) => props.theme.colors.text};
  display: block;
  width: 1.2em;
  height: 2px;
  border-radius: 1px;
  margin-top: 0.3rem;
`;
