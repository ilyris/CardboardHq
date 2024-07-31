import axios from "axios";

export const getCardInformation = async (uniqueId: string) => {
  const response = await axios.get(`/api/cardInformation/get`, {
    params: {
      uniqueId,
    },
  });
  return response.data.results[0];
};
