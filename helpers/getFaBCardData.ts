import axios from "axios";

const getFaBCardData = async (slug: string, cardId: string = "") => {
  const cardsData = await axios.get("/api/cardData/get", {
    params: {
      setName: slug,
      cardId,
    },
  });
  return cardsData;
};
export default getFaBCardData;
