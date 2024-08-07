import axios from "axios";

export const getPortfolioWithCardsList = async () => {
  const response = await axios.get("/api/portfolio");
  return response.data.results;
};
