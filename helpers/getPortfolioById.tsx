import axios from "axios";

export const getPortfolioById = async (pid: string, email: string) => {
  const response = await axios.get("/api/portfolio", {
    params: { pid, email },
  });
  return response.data.results;
};
