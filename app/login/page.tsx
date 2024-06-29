"use client";
import React, { useState } from "react";
import LoginForm from "../components/login/LoginForm";
import axios from "axios";

const LoginPage = () => {
  const [error, setError] = useState<string | null>(null);

  //   const handleLogin = async (username: string, password: string) => {
  //     console.log({ username });
  //     event.preventDefault();
  //     axios
  //       .post("/api/login", {
  //         username: username,
  //         password: password,
  //       })
  //       .then((response) => {
  //         console.log("Login successful:", response.data);
  //         // Possibly save the token in local storage or context and redirect user
  //       })
  //       .catch((error) => {
  //         console.error("Login failed:", error.response.data);
  //         setError(error.response.data.error || "Unknown error");
  //       }); // Authentication logic here

  //     console.log("Username:", username, "Password:", password);
  //     // Assuming login is successful:
  //   };

  return <LoginForm />;
};

export default LoginPage;
