import { PortfolioCard } from "@/app/lib/db";
import axios from "axios";

export const addCardToPortfolio = async (card: PortfolioCard) => {
  const response = await axios.post("/api/portfolio/add", card);
  return response;
};
