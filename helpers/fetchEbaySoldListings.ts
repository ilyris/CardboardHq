import axios from "axios";

export const fetchEbaySoldListings = async (query: string) => {
  const response = await axios.post(`/api/ebay/post`, { query });
  return response.data.result;
};
