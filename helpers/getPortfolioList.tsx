import axios from "axios";

export const getPortfolioList = async () => {
  const response = await axios.get("/api/portfolio/allPortfolios");
  return response.data.results;
};
