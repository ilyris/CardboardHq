import { TransformedPortfolioData } from "@/app/api/portfolio/route";

export const getPortfolioWithCardsList = async (): Promise<
  TransformedPortfolioData[]
> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/portfolio`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data = await response.json();
  return data.results;
};
