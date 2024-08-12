"use client";

import { getProviders, signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import { Button, Container, Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";

export default function LoginClient() {
  const [providers, setProviders] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const response = await getProviders();
      setProviders(response);
    })();
  }, []);

  const handleLogin = async (provider: string) => {
    if (provider === "google") await signIn(providers.google.id);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box mt={5}>
          {providers && (
            <Button variant="contained" onClick={() => handleLogin("google")}>
              <FaGoogle style={{ fontSize: "30px", marginRight: "10px" }} />
              Continue with Google
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
}
