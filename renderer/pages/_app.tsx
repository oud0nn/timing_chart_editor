import { AppProps } from "next/app";
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { FluentProvider, webLightTheme } from "@fluentui/react-components";

initializeIcons();

import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'SourceHanCodeJP-Bold';
    src: url('/fonts/source-han-code-jp/SourceHanCodeJP-Bold.otf');
  }
  @font-face {
    font-family: 'SourceHanCodeJP-Normal';
    src: url('/fonts/source-han-code-jp/SourceHanCodeJP-Normal.otf');
  }
  body {
    font-family: 'SourceHanCodeJP-Normal';
    margin: 0;
  }
`;

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FluentProvider theme={webLightTheme}>
      <GlobalStyle />
      <Component {...pageProps} />
    </FluentProvider>
  );
}
