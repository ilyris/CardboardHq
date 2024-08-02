"use client";
import React, { useEffect, useState } from "react";
import { Button, TextField, Container, Typography, Box } from "@mui/material";
import {
  signIn,
  getProviders,
  LiteralUnion,
  ClientSafeProvider,
  useSession,
} from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers/index";
import { FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface LoginProps {}

const LoginForm: React.FC<LoginProps> = ({}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>(null);

  const handleLogin = async (provider: string) => {
    if (provider === "google") await signIn(providers?.google.id);
  };

  useEffect(() => {
    const setTheProviders = async () => {
      const setUpTheProviders = await getProviders();
      setProviders(setUpTheProviders);
    };
    if (session?.user) router.push("/");

    setTheProviders();
  }, [session?.user?.name]);

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
          <Button variant="contained" onClick={() => handleLogin("google")}>
            <FaGoogle style={{ fontSize: "30px", marginRight: "10px" }} />
            Continue with Google
          </Button>
        </Box>
        {/* <Box
          component="form"
          onSubmit={(e) => handleSubmit(e, username, password)}
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box> */}
      </Box>
    </Container>
  );
};

export default LoginForm;
