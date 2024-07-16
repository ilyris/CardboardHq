import axios from "axios";

interface FabDataProps {
  slug: string;
  searchQuery?: string;
  cardId?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
}

const getFaBCardData = async ({
  slug,
  searchQuery,
  cardId,
  page,
  pageSize,
  sort,
}: FabDataProps) => {
  const cardsData = await axios.get("/api/cardData/get", {
    params: {
      setName: slug,
      searchQuery: searchQuery || "",
      cardId: cardId || "",
      page: page || undefined,
      pageSize: pageSize || undefined,
      sort: sort || "high to low",
    },
  });
  return cardsData;
};
export default getFaBCardData;
