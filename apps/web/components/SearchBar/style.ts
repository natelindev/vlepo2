import { SearchBox } from 'react-instantsearch-dom';

import styled from '@xstyled/styled-components';

export const InputGroupText = styled.span`
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;

  border: none;
  background: none;
  padding: 0;
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
  padding-left: 0.5rem;

  display: flex;
  align-items: center;
  margin-bottom: 0;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: ${(props) => props.theme.colors.muted};
  text-align: center;
  white-space: nowrap;
  border-radius: 0.25rem;
`;

export const SearchInput = styled(SearchBox)`
  display: flex;
  width: 100%;

  > form {
    display: flex;
    width: 100%;
  }

  input {
    border: none;
    background: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    position: relative;
    flex: 1 1 auto;
    width: 1%;
    margin-bottom: 0;
    display: block;
    height: calc(1.5em + 0.75rem + 2px);
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: ${(props) => props.theme.colors.muted};
    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    overflow: visible;
    margin: 0;
    font-family: inherit;
    outline: none;
    appearance: none;

    &::-webkit-search-cancel-button {
      display: none;
    }
  }

  button[type='submit'] {
    display: none;
  }

  button[type='reset'] {
    margin-left: auto;
    margin-right: 0.5rem;
    border: none;
    color: ${(props) => props.theme.colors.text};
    background-color: transparent;

    > svg {
      fill: ${(props) => props.theme.colors.text};
    }
  }
`;

export const BaseSearchBar = styled.div<{ show?: boolean }>`
  > svg {
    cursor: pointer;
  }
  @media only screen and (max-width: sm) {
    background-color: ${(props) => (props.show ? props.theme.colors.bgMuted : 'inherit')};
  }

  background-color: ${(props) => props.theme.colors.bgMuted};
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    margin-block-start: 0;
    margin-block-end: 0;
  }

  .ais-Hits-item {
    padding: 0.3rem;
  }

  ${SearchInput} {
    display: flex;
    @media only screen and (max-width: sm) {
      display: ${(props) => (props.show ? 'flex' : 'none')};
    }
  }

  position: relative;
  display: flex;
  align-items: stretch;

  margin-left: auto;

  border-radius: 0.25rem;

  flex-grow: ${(props) => (props.show ? 1 : 0)};
  transition: all 0.12s;
  text-transform: none;

  &:focus-within {
    box-shadow: 0 2px 0 0 ${(props) => props.theme.colors.secondary};
    flex-grow: 1;
  }

  > svg {
    margin-left: 0.5rem;
    margin-top: auto;
    margin-bottom: auto;
  }

  > .ais-Hits {
    width: 100%;
    position: absolute;
    top: ${(props) => (props.show ? '100%' : '-999999999rem')};
    background-color: ${(props) => props.theme.colors.bgSecondary};
    z-index: ${(props) => props.theme.zIndices.dropDownMenu};
    display: flex;
    flex-direction: column;
    float: left;
    min-width: 10rem;
    padding: 0.3rem;
    margin: 0.1rem 0 0;
    border-radius: ${(props) => `0 0 ${props.theme.radii.default} ${props.theme.radii.default}`};
    box-shadow: ${(props) => props.theme.shadows.dropdown};
  }

  .ais-Hits-item {
    display: flex;
    position: relative;
    border-radius: ${(props) => `${props.theme.radii.default}`};
    &:hover {
      background-color: ${(props) => props.theme.colors.bgMuted};
    }
  }
`;
