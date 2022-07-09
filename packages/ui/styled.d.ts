import '@xstyled/system';
import 'styled-components';

import { DefaultTheme as XStyledDefaultTheme, ITheme } from '@xstyled/styled-components';

import { theme } from './theme';

export type ThemeType = typeof theme & XStyledDefaultTheme & ITheme;

declare module '@xstyled/system' {
  export interface Theme extends ThemeType {}
}

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
