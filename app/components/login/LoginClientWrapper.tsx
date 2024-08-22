"use client";
import { getProviders, signIn } from "next-auth/react";
import { Container, Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";
import LoginForm from "./LoginForm";

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
    return;
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
        <LoginForm providers={providers} handleLoginCb={handleLogin} />
      </Box>
    </Container>
  );
}
