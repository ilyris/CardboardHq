import axios from "axios";

export const getPortfolioHoldingAdjustments = async (portfolioId: string) => {
  const response = await axios.get("/api/portfolio/holdings/get", {
    params: { portfolioId },
  });
  return response.data.results;
};
