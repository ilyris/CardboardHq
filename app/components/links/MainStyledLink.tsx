"use client";
import { styled } from "@mui/material/styles";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { LinkProps as MuiLinkProps } from "@mui/material/Link";

interface CustomLinkProps extends Omit<MuiLinkProps, "href">, NextLinkProps {
  primary?: boolean;
}

// Style the Link component using MUI's styled function
const MainStyledLink = styled(NextLink)<CustomLinkProps>(
  ({ theme, primary }) => ({
    borderRadius: "15px",
    backgroundColor: primary
      ? theme.palette.secondary.main
      : theme.palette.secondary.dark,
    color: theme.palette.text.primary,
    fontWeight: "bold",
    padding: "8px 16px",
    textDecoration: "none",
    "&:hover": {
      backgroundColor: theme.palette.secondary.dark,
    },
  })
);

export default MainStyledLink;
