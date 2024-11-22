import axios from "axios";

interface FabDataProps {
  searchQuery?: string;
}

const getSearchCardData = async ({ searchQuery }: FabDataProps) => {
  console.log({ searchQuery });
  const cardsData = await axios.get("/api/searchCardData/get", {
    params: {
      searchQuery,
    },
  });
  return cardsData;
};
export default getSearchCardData;
