"use client"
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0D47A1',
    },
    secondary: {
      main: '#5472D3',
    },
    background: {
      default: '#E3F2FD',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#001F3F',
      secondary: '#B0BEC5',
    },
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#0D47A1',
          '&:hover': {
            color: '#5472D3',
          },
          textDecoration: "none",
          margin: ".8rem",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          '&.primary': {
            backgroundColor: '#0D47A1',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#5472D3',
            },
          },
          '&.secondary': {
            backgroundColor: '#5472D3',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#0D47A1',
            },
          },
        },
      },
    },
  },
});

export default theme
