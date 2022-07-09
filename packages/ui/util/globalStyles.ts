import { createGlobalStyle } from '@xstyled/styled-components';

export const GlobalStyles = createGlobalStyle`
      html,
      body {
        margin: 0;
        padding: 0;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        background-color: bg;
        color: text;
        text-align: left;
        font-family: content;
      }
      *,
      ::after,
      ::before {
        box-sizing: border-box;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        -webkit-tap-highlight-color: transparent;
      }
      *:focus {
        outline: none;
      }
      #__next {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        width: 100%;
      }

      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      textarea:-webkit-autofill,
      textarea:-webkit-autofill:hover,
      textarea:-webkit-autofill:focus,
      select:-webkit-autofill,
      select:-webkit-autofill:hover,
      select:-webkit-autofill:focus {
        appearance: none;
        color: bg !important;
        background-color: bg !important;
      }
      ::selection {
        color: whiteText;
        background-color: selection;
      }
    `;
