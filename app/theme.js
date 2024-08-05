"use client";
import { createTheme } from "@mui/material/styles";
import "@fontsource/montserrat"; // Defaults to weight 400 with all styles included.

const headingFontStyle = {
  fontFamily: "Montserrat, Arial, sans-serif",
  fontWeight: 700,
};

export const theme = createTheme({
  palette: {
    primary: {
      main: "#B9B4C7",
    },
    secondary: {
      main: "#5C5470",
    },
    background: {
      default: "#352F44",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#B9B4C7",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1388, // Update the xl breakpoint to 1388px
    },
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#B9B4C7",
          "&:hover": {
            color: "#FAF0E6",
          },
          textDecoration: "none",
          margin: ".8rem",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          "&.primary": {
            backgroundColor: "#0D47A1",
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "#5472D3",
            },
          },
          "&.secondary": {
            backgroundColor: "#5472D3",
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "#0D47A1",
            },
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          // Some CSS
          maxWidth: "1388px !important",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: "#352F44",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#352F44",
        },
      },
    },
  },
  typography: {
    fontFamily: "Montserrat, Arial, sans-serif",
    fontWeightLight: 400,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: { ...headingFontStyle },
    h2: { ...headingFontStyle },
    h3: { ...headingFontStyle },
    h4: { ...headingFontStyle },
    h5: { ...headingFontStyle },
    h6: { ...headingFontStyle },
  },
});

export default theme;
