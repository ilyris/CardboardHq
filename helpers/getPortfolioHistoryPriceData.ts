import axios from "axios";

export const getPortfolioHistoryPriceData = async (portfolioId: string) => {
  const response = await axios.get("/api/portfolio/historicData", {
    params: { portfolioId },
  });
  return response.data.results;
};
