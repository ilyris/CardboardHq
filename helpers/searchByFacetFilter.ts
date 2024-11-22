import axios from "axios";

export const searchByFacetFilter = async (
  isFacetSearchOpen: boolean,
  artist: string | null,
  className: string | null,
  searchQuery: string | null
) => {
  const response = await axios.get(`/api/searchCardData/get`, {
    params: {
      isFacetSearchOpen,
      searchQuery,
      artist,
      className,
    },
  });
  return response;
};
