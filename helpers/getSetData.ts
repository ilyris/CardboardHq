import axios from "axios";

const getCardSet = async (setName: string) => {
  const cardsData = await axios.get("/api/setData/get", {
    params: {
      setName,
    },
  });
  return cardsData.data.result;
};
export default getCardSet;
