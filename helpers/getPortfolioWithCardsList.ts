import { TransformedPortfolioData } from "@/typings/Portfolios";
import { createAuthHeaders } from "./api/cookieAuthHeaders";

export const getPortfolioWithCardsList = async (): Promise<
  TransformedPortfolioData[]
> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const headers = createAuthHeaders();
  console.log({ headers });

  const response = await fetch(`${baseUrl}/api/portfolio`, {
    method: "GET",
    headers,
    credentials: "include",
    cache: "no-store",
  });

  const data = await response.json();
  return data.results;
};
