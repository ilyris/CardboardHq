import axios from "axios";

const getDays = (dayInterval: string) => {
  switch (dayInterval) {
    case "7d":
      return 7;
    case "1m":
      return 31;
    case "6m":
      return 31 * 6;
    default:
      return 7;
  }
};

export const getPortfolioHistoryPriceData = async (
  portfolioId: string,
  dayInterval = "7d"
) => {
  const days = getDays(dayInterval);
  const response = await axios.get("/api/portfolio/historicData", {
    params: { portfolioId, dayInterval: days },
  });
  return response.data.results;
};
