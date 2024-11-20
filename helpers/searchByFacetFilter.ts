import axios from "axios";

export const searchByFacetFilter = async (
  isFacetSearchOpen: boolean,
  artist: string | null,
  className: string | null
) => {
  const response = await axios.get(`/api/searchCardData/get`, {
    params: {
      isFacetSearchOpen,
      artist,
      className,
    },
  });
  return response;
};
