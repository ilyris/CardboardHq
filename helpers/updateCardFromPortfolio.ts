import axios from "axios";

interface UpdateCardParams {
  portfolioId: string;
  printingId: string;
  edition: string;
  foiling: string;
  title: string;
  quantity: number;
}

export const updateCardFromPortfolio = async ({
  portfolioId,
  printingId,
  edition,
  foiling,
  title,
  quantity,
}: UpdateCardParams) => {
  const response = await axios.put(`/api/portfolio/holdings/put`, {
    data: {
      portfolioId,
      printingId,
      edition,
      foiling,
      title,
      quantity,
    },
  });
  return response;
};
