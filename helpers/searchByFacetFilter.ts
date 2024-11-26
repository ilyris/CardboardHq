import axios from "axios";

export const searchByFacetFilter = async (
  isFacetSearchOpen: boolean,
  artist: string | null,
  className: string | null,
  searchQuery: string | null,
  page?: number
) => {
  const response = await axios.get(`/api/searchCardData/get`, {
    params: {
      isFacetSearchOpen,
      searchQuery,
      artist,
      className,
      page,
    },
  });
  return response;
};
