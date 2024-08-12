import { cookies } from "next/headers";

export const createAuthHeaders = (): HeadersInit => {
  const cookieStore = cookies();

  // Attempt to get the session token based on different possible cookie names
  const sessionToken =
    cookieStore.get("__Secure-next-auth.session-token")?.value || // Production cookie
    cookieStore.get("next-auth.session-token")?.value; // Development cookie

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (sessionToken) {
    const cookieName = sessionToken.startsWith("__Secure-")
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token";
    headers["cookie"] = `${cookieName}=${sessionToken}`;
  }

  return headers;
};
