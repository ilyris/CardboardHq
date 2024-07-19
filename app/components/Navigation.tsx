"use client";
import { Box } from "@mui/material";
import NextLink from "./NextLink";
import MainStyledLink from "./MainStyledLink";
import SearchBar from "./SearchBar";
import Image from "next/image";
import logo from "@/public/Logo.svg";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Navigation = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchQuery(e.currentTarget.value);
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      router.push(`/search/all/${searchQuery}`);
    } catch (error) {
      console.error("Error fetching card data:", error);
    }
  };

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
        <Box component="form" onSubmit={handleSubmit}>
          <SearchBar
            value={searchQuery}
            placeholder={"Nuu, Alluring Desire"}
            onChange={(e) => handleSearchChange(e)}
          />
        </Box>
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
