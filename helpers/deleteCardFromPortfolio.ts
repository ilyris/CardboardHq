import axios from "axios";

interface DeleteCardParams {
  portfolioId: string;
  printingId: string;
  edition: string;
  foiling: string;
  title: string;
}

export const deleteCardFromPortfolio = async ({
  portfolioId,
  printingId,
  edition,
  foiling,
  title,
}: DeleteCardParams) => {
  const response = await axios.delete(`/api/portfolio/holdings/delete`, {
    data: {
      portfolioId,
      printingId,
      edition,
      foiling,
      title,
    },
  });
  return response.data;
};
