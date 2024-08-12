import { TransformedPortfolioData } from "@/typings/Portfolios";
import { createAuthHeaders } from "./api/cookieAuthHeaders";

export const getPortfolioWithCardsList = async (
  email?: string | null
): Promise<TransformedPortfolioData[]> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const headers = createAuthHeaders();
  if (!email) {
    throw new Error(" Email not provided");
  }
  const response = await fetch(`${baseUrl}/api/portfolio?email=${email}`, {
    method: "GET",
    headers,
    credentials: "include", // Ensures cookies are included
    cache: "no-store",
  });

  const data = await response.json();
  return data.results;
};
