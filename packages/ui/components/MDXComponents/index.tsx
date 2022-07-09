import CodeBlock from '../CodeBlock';
import { AnimatedExternalLink } from '../Link';
import PlaceHolder from '../PlaceHolder';
import { H1, H2, H3, H4, H5, H6, OL, Text, UL } from '../Typography';
import { inlineCode } from './style';

export default {
  PlaceHolder,
  code: inlineCode,
  inlineCode,
  a: AnimatedExternalLink,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  pre: CodeBlock,

  p: Text,
  ol: OL,
  ul: UL,
};
