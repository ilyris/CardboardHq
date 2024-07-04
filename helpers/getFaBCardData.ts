import axios from "axios";

interface FabDataProps {
  slug: string;
  searchQuery?: string;
  cardId?: string;
  page?: number;
  pageSize?: number;
}

const getFaBCardData = async ({
  slug,
  searchQuery,
  cardId,
  page,
  pageSize,
}: FabDataProps) => {
  const cardsData = await axios.get("/api/cardData/get", {
    params: {
      setName: slug,
      searchQuery: searchQuery || "",
      cardId: cardId || "",
      page: page || undefined,
      pageSize: pageSize || undefined,
    },
  });
  return cardsData;
};
export default getFaBCardData;
