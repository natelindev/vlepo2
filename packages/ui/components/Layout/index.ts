import styled, { x } from '@xstyled/styled-components';

export const Header = styled(x.header)`
  flex: none;
`;

export const Main = styled(x.main)`
  display: flex;
  flex-direction: column;
  margin-top: 3.5rem;
  flex: 1 0 auto;
  width: 100%;
  overflow-y: hidden;
  background-color: bg;
`;

export const Footer = styled(x.footer)`
  flex: none;
  border-top: 1px solid bgMuted;
  background-color: bgSecondary;
`;

export const Row = styled(x.div)`
  display: flex;
`;

export const Column = styled(x.div)`
  display: flex;
  flex-direction: column;
`;

export const Section = styled(x.div)`
  display: flex;
`;
