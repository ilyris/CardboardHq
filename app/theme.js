"use client";
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#0D47A1",
    },
    secondary: {
      main: "#5472D3",
    },
    background: {
      default: "#E3F2FD",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#001F3F",
      secondary: "#B0BEC5",
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
          color: "#0D47A1",
          "&:hover": {
            color: "#5472D3",
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
