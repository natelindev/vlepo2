/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/no-array-index-key */
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import vsDark from 'prism-react-renderer/themes/vsDark';
import vsLight from 'prism-react-renderer/themes/vsLight';
import React, { useState } from 'react';

import { useColorMode, useTheme } from '@xstyled/styled-components';

import { isBright } from '../../util/colorUtil';
import { CopyButton, LanguageBadge, LanguageColors, Pre } from './style';

type CodeBlockProps = { children: React.ReactElement };
const CodeBlock = (props: CodeBlockProps) => {
  const { children } = props;

  const {
    props: { className, children: code = '' },
  } = children;

  const language = className?.replace(/language-/, '') as Language;
  const theme = useTheme();
  const [colorMode] = useColorMode();
  const [copyButtonText, setCopyButtonText] = useState('copy');
  const badgeColor = Object.keys(LanguageColors).includes(language)
    ? LanguageColors[language as keyof typeof LanguageColors]
    : theme.colors.accent;
  return (
    <Highlight
      {...defaultProps}
      code={code}
      language={language}
      theme={colorMode === 'dark' ? vsDark : vsLight}
    >
      {({ tokens, getLineProps, getTokenProps }) => (
        <Pre mx="1rem" w="100%">
          <CopyButton
            px="0.5rem"
            py="0.1rem"
            onClick={() => {
              setCopyButtonText('copied');
              navigator.clipboard.writeText(code);
              setTimeout(() => setCopyButtonText('copy'), 2000);
            }}
          >
            {copyButtonText}
          </CopyButton>
          {language && (
            <LanguageBadge
              px="0.5rem"
              py="0.1rem"
              bg={badgeColor}
              color={isBright(badgeColor) ? theme.colors.blackText : theme.colors.whiteText}
            >
              {language}
            </LanguageBadge>
          )}
          {tokens.slice(0, tokens.length - 1).map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </Pre>
      )}
    </Highlight>
  );
};

export default CodeBlock;
