"use client";

import { ReactNode, useEffect } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
  Theme,
} from "@mui/material";

interface ThemeProviderProps {
  theme: Theme;
  children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ theme, children }) => {
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--primary-color",
      theme.palette.primary.main
    );
    document.documentElement.style.setProperty(
      "--secondary-color",
      theme.palette.secondary.main
    );
    document.documentElement.style.setProperty(
      "--background-color",
      theme.palette.background.default
    );
    document.documentElement.style.setProperty(
      "--text-color",
      theme.palette.text.primary
    );
  }, [theme]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
