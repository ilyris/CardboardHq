import axios from "axios";

export const getPortfolioList = async () => {
  const response = await axios.get("api/portfolio");
  return response.data.results;
};
