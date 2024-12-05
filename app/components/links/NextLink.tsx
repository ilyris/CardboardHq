import React from "react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import MuiLink, { LinkProps as MuiLinkProps } from "@mui/material/Link";

type LinkProps = Omit<MuiLinkProps, "href"> & NextLinkProps;

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  props,
  ref
) {
  const { href, as, ...other } = props;

  return (
    <NextLink href={href} as={as} passHref>
      <MuiLink ref={ref} {...other} />
    </NextLink>
  );
});

export default Link;
