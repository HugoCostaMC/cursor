import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: ${({ theme }) => theme.typography.fontSizeBase};
    line-height: ${({ theme }) => theme.typography.lineHeightBase};
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
  }

  h1,
  h2 {
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    line-height: ${({ theme }) => theme.typography.lineHeightHeading};
    font-weight: ${({ theme }) => theme.typography.fontWeightBold};
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.heading1Size};
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.heading2Size};
  }
`;
