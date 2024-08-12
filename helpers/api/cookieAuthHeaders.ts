import { cookies } from "next/headers";

export const createAuthHeaders = (): HeadersInit => {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("next-auth.session-token")?.value;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (sessionToken) {
    headers["cookie"] = `next-auth.session-token=${sessionToken}`;
  }

  return headers;
};
