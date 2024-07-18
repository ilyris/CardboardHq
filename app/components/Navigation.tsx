"use client";
import { Box } from "@mui/material";
import NextLink from "./NextLink";
import MainStyledLink from "./MainStyledLink";
import SearchBar from "./SearchBar";
import Image from "next/image";
import logo from "@/public/Logo.svg";

const Navigation = () => {
  return (
    <Box
      component="nav"
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
        p: 3,
      }}
    >
      <Box>
        <NextLink href="/" component="button" variant="body2">
          <Image
            priority
            src={logo}
            alt="Cardboard HQ Logo"
            style={{ width: 75, height: 75 }}
          />
        </NextLink>
        <NextLink href="/" component="button" variant="body2">
          Sealed Product
        </NextLink>
        <NextLink href="/" component="button" variant="body2">
          Singles
        </NextLink>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <SearchBar
          value={"Nuu, Alluring Desire"}
          onChange={() => console.log("reee")}
        />
        <MainStyledLink
          href="/login"
          component="button"
          variant="body2"
          primary={true}
          sx={{ mr: 1 }}
        >
          Login
        </MainStyledLink>
        <MainStyledLink href="/" component="button" variant="body2">
          Sign up
        </MainStyledLink>
      </Box>
    </Box>
  );
};
export default Navigation;
