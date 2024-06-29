"use client";

import { useEffect } from "react";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";

const ThemeProvider = ({ theme, children }) => {
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
