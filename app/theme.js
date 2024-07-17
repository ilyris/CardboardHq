"use client";
import { createTheme } from "@mui/material/styles";

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
  },
});

export default theme;
