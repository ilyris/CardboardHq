// app/login/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import LoginForm from "../components/login/LoginForm";

export default async function LoginPage() {
  // Check if the user is already authenticated
  const session = await auth();
  if (session) {
    // If the user is authenticated, redirect them to the homepage
    redirect("/");
  }

  return <LoginForm />;
}
