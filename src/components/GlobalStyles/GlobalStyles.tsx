import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  html, body {
    height: 100%;
    margin: 0;
    box-sizing: border-box;
    background: ${({ theme }) => theme.color.mainBackground};
    color: ${({ theme }) => theme.color.text};
    font-family: ${({ theme }) => theme.font.family.default};
    font-weight: ${({ theme }) => theme.font.weight.normal};
    vertical-align: middle;
  }

  html, body, #root {
    height: 100%;
  }

  #root {
    display: flex;
    flex-direction: column;
  }


  *, *:before, *:after {
    background: transparent;
    color: inherit;
    font-family: inherit;
    font-weight: inherit;
    box-sizing: inherit;
    vertical-align: inherit;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    cursor: pointer;
    text-decoration: none;
    
    &:hover {
      color: ${({ theme }) => theme.color.emphasis};
    }
  }

  button {
    cursor: pointer;
    border: none;
  }
  
  strong {
    font-weight: 600;
  }
`;
