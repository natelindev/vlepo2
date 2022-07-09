import styled, { x } from '@xstyled/styled-components';

export const H1 = styled(x.h1)`
  font-family: heading;
  font-size: 5xl;
`;

export const H2 = styled(x.h2)`
  font-family: heading;
  font-size: 3xl;
`;

export const H3 = styled(x.h3)`
  font-family: heading;
  font-size: xl;
`;

export const H4 = styled(x.h4)`
  font-family: heading;
  font-size: lg;
`;

export const H5 = styled(x.h5)`
  font-family: heading;
  font-size: default;
`;

export const H6 = styled(x.h6)`
  font-family: heading;
  font-size: sm;
`;

export const Text = styled(x.div)`
  font-family: content;
  line-height: content;
  font-size: lg;
  margin-block-start: 1rem;
  margin-block-end: 1rem;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
`;

export const OL = styled(x.ol)`
  list-style: decimal;
  > li {
    margin-left: 1rem;
  }
`;

export const UL = styled(x.ul)`
  list-style: disc;
  > li {
    margin-left: 1rem;
  }
`;
