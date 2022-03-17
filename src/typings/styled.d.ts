import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    space: {
      xs: string;
      s: string;
      m: string;
      l: string;
      xl: string;
    };
    font: {
      family: {
        default: string;
      };
      size: {
        xs: string;
        s: string;
        m: string;
        l: string;
        xl: string;
      };
      weight: {
        normal: number;
        bold: number;
        extraBold: number;
      };
    };
    color: {
      emphasis: string;
      text: string;
      mainBackground: string;
      white: '#fff';
      success: string;
      danger: string;
      secondaryBackground: string;
      inputBackground: string;
    };
  }
}
