/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/no-array-index-key */
import { Highlight, themes } from 'prism-react-renderer';
import React, { useState } from 'react';

import { Theme, useColorMode, useTheme } from '@xstyled/styled-components';
import { Color, SystemProp } from '@xstyled/system';

import { isBright } from '../../util/colorUtil';
import { CopyButton, LanguageBadge, LanguageColors, Pre } from './style';

type CodeBlockProps = { children: React.ReactElement };
const CodeBlock = (props: CodeBlockProps) => {
  const { children } = props;

  const {
    props: { className, children: code = '' },
  } = children;

  const language = className?.replace(/language-/, '');
  const theme = useTheme();
  const [colorMode] = useColorMode();
  const [copyButtonText, setCopyButtonText] = useState('copy');
  const badgeColor =
    (Object.keys(LanguageColors).includes(language)
      ? LanguageColors[language as keyof typeof LanguageColors]
      : theme?.colors.accent) || '#333333';
  return (
    <Highlight
      code={code}
      language={language}
      theme={colorMode === 'dark' ? themes.vsDark : themes.vsLight}
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
              color={
                ((isBright(badgeColor) ? theme?.colors.blackText : theme?.colors.whiteText) ||
                  '#ffffff') as SystemProp<Color<Theme>, Theme>
              }
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
