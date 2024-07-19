import axios from "axios";

interface FabDataProps {
  searchQuery?: string;
}

const getSearchCardData = async ({ searchQuery }: FabDataProps) => {
  const cardsData = await axios.get("/api/searchCardData/get", {
    params: {
      searchQuery,
    },
  });
  return cardsData;
};
export default getSearchCardData;
