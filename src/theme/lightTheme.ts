import { DefaultTheme } from "styled-components";

export const lightTheme: DefaultTheme = {
  font: {
    family: {
      default: `'DAZNTrim', 'Helvetica', sans-serif`,
    },
    size: {
      xs: "10px",
      s: "14px",
      m: "18px",
      l: "22px",
      xl: "24px",
    },
    weight: {
      normal: 400,
      bold: 600,
      extraBold: 700,
    },
  },
  space: {
    xs: "4px",
    s: "8px",
    m: "12px",
    l: "16px",
    xl: "20px",
  },
  color: {
    emphasis: "#02588d",
    text: "#0c161c",
    white: "#fff",
    success: "#ecffb1",
    warn: "#ffeeb1",
    danger: "#ffb8b1",
    mainBackground: "#f5f5f5",
    secondaryBackground: "#e6f4fd",
    inputBackground: "#d7d7d7",
  },
};
