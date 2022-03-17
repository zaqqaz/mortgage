import React from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { lightTheme } from "./lightTheme";

export const ThemeProvider: React.FC = (props) => {

  return (
      <StyledThemeProvider theme={lightTheme}>
        {props.children}
      </StyledThemeProvider>
  );
};
