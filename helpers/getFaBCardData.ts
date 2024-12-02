import { FilterTypes } from "@/typings/Filter";
import axios from "axios";

interface FabDataProps {
  slug: string;
  searchQuery?: string;
  cardId?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  edition: string;
  activeFilters?: FilterTypes;
}

const getFaBCardData = async ({
  slug,
  searchQuery,
  cardId,
  page,
  pageSize,
  sort,
  edition,
  activeFilters,
}: FabDataProps) => {
  console.log({ activeFilters });
  const cardsData = await axios.get("/api/cardData/get", {
    params: {
      setName: slug,
      searchQuery: searchQuery || "",
      cardId: cardId || "",
      page: page || undefined,
      pageSize: pageSize || undefined,
      sort: sort || "High To Low",
      edition,
      ...activeFilters,
    },
  });
  return cardsData;
};
export default getFaBCardData;
